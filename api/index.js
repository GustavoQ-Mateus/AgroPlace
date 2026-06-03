const express = require('express')
const mysql   = require('mysql2/promise')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const cors    = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*',
  credentials: true,
}))
app.use(express.json())

// ── SSE — ERD Live Events ──────────────────────────────────────
const erdClients = new Set()

app.get('/api/erd-events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()
  erdClients.add(res)
  res.write('data: {"type":"connected"}\n\n')
  const hb = setInterval(() => res.write(': heartbeat\n\n'), 25000)
  req.on('close', () => { erdClients.delete(res); clearInterval(hb) })
})

function broadcastERD(action) {
  const msg = `data: ${JSON.stringify({ type: 'erd', action })}\n\n`
  erdClients.forEach((c) => c.write(msg))
}

const DB_CONFIG = {
  host:             process.env.DB_HOST     || 'mysql',
  port:             Number(process.env.DB_PORT) || 3306,
  user:             process.env.DB_USER     || 'agroplace',
  password:         process.env.DB_PASS     || 'agroplace123',
  database:         process.env.DB_NAME     || 'agroplace',
  waitForConnections: true,
  connectionLimit:  10,
}

const JWT_SECRET = process.env.JWT_SECRET || 'agroplace-dev-secret'

let pool

async function connectMySQL() {
  for (let i = 1; i <= 30; i++) {
    try {
      pool = mysql.createPool(DB_CONFIG)
      await pool.query('SELECT 1')
      console.log('MySQL conectado.')
      return
    } catch (err) {
      console.log(`MySQL aguardando... (${i}/30): ${err.message}`)
      pool = null
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
  throw new Error('Não foi possível conectar ao MySQL.')
}

// ── Auth middleware ────────────────────────────────────────────
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Não autenticado' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

// ── Auth ───────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone, role } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' })
  try {
    const id     = uuidv4()
    const hash   = await bcrypt.hash(password, 10)
    const avatar = (name || email).slice(0, 2).toUpperCase()
    const r      = role || 'comprador'
    await pool.query(
      'INSERT INTO users (id, email, password_hash, name, phone, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, email, hash, name || null, phone || null, r, avatar]
    )
    const token = jwt.sign({ id, email, role: r }, JWT_SECRET, { expiresIn: '7d' })
    broadcastERD('login')
    res.json({ user: { id, email, name, phone, role: r, avatar, verified: false }, token })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'E-mail já cadastrado' })
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' })
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' })
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    const { password_hash, ...u } = user
    broadcastERD('login')
    res.json({ user: u, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, name, phone, role, verified, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    )
    res.json(rows[0] || null)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/auth/me', auth, async (req, res) => {
  const allowed = ['name', 'phone']
  const updates = {}
  for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k]
  if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nenhum campo para atualizar' })
  try {
    const sets = Object.keys(updates).map((k) => `${k} = ?`).join(', ')
    await pool.query(`UPDATE users SET ${sets} WHERE id = ?`, [...Object.values(updates), req.user.id])
    const [rows] = await pool.query(
      'SELECT id, email, name, phone, role, verified, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Listings ───────────────────────────────────────────────────
app.get('/api/listings', async (req, res) => {
  const { q, category, state, priceMin, priceMax, traceMin, limit = 50, offset = 0 } = req.query
  try {
    const where  = ['a.status = "ativo"']
    const params = []
    if (q) {
      where.push('(a.title LIKE ? OR a.breed LIKE ? OR a.city LIKE ?)')
      params.push(`%${q}%`, `%${q}%`, `%${q}%`)
    }
    if (category) { where.push('a.category = ?');                params.push(category) }
    if (state)    { where.push('a.state = ?');                   params.push(state) }
    if (priceMin) { where.push('a.price_total >= ?');            params.push(Number(priceMin)) }
    if (priceMax) { where.push('a.price_total <= ?');            params.push(Number(priceMax)) }
    if (traceMin) { where.push('a.traceability_score >= ?');     params.push(Number(traceMin)) }

    const sql = `
      SELECT a.*, u.name AS seller_name, u.verified AS seller_verified,
        (SELECT url FROM fotos_anuncio WHERE anuncio_id = a.id AND is_cover = 1 LIMIT 1) AS cover_url
      FROM anuncios a
      LEFT JOIN users u ON a.seller_id = u.id
      WHERE ${where.join(' AND ')}
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?`
    params.push(Number(limit), Number(offset))
    const [rows] = await pool.query(sql, params)
    broadcastERD('catalog')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/listings/mine', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM anuncios WHERE seller_id = ? ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/listings/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, u.name AS seller_name, u.verified AS seller_verified,
        (SELECT url FROM fotos_anuncio WHERE anuncio_id = a.id AND is_cover = 1 LIMIT 1) AS cover_url
       FROM anuncios a LEFT JOIN users u ON a.seller_id = u.id WHERE a.id = ?`,
      [req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'Anúncio não encontrado' })
    pool.query('UPDATE anuncios SET view_count = view_count + 1 WHERE id = ?', [req.params.id]).catch(() => {})
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/listings', auth, async (req, res) => {
  const id = uuidv4()
  const { title, category, breed, quantity, weight, price_total, price_per_head, price_per_arroba, city, state, description } = req.body
  try {
    await pool.query(
      `INSERT INTO anuncios
       (id, seller_id, title, category, breed, quantity, weight, price_total, price_per_head, price_per_arroba, city, state, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, title, category, breed, quantity, weight, price_total, price_per_head, price_per_arroba, city, state, description]
    )
    const [rows] = await pool.query('SELECT * FROM anuncios WHERE id = ?', [id])
    broadcastERD('listing')
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/listings/:id', auth, async (req, res) => {
  const allowed = ['title','category','breed','quantity','weight','price_total','price_per_head','city','state','description','status']
  const updates = {}
  for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k]
  if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nenhum campo para atualizar' })
  try {
    const sets = Object.keys(updates).map((k) => `${k} = ?`).join(', ')
    await pool.query(
      `UPDATE anuncios SET ${sets} WHERE id = ? AND seller_id = ?`,
      [...Object.values(updates), req.params.id, req.user.id]
    )
    const [rows] = await pool.query('SELECT * FROM anuncios WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Favorites ──────────────────────────────────────────────────
app.get('/api/favorites', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT anuncio_id FROM favoritos WHERE user_id = ?', [req.user.id])
    res.json(rows.map((r) => r.anuncio_id))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/favorites/:id', auth, async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query('SELECT id FROM favoritos WHERE user_id = ? AND anuncio_id = ?', [req.user.id, id])
    if (rows[0]) {
      await pool.query('DELETE FROM favoritos WHERE user_id = ? AND anuncio_id = ?', [req.user.id, id])
      res.json({ saved: false })
    } else {
      await pool.query('INSERT INTO favoritos (id, user_id, anuncio_id) VALUES (?, ?, ?)', [uuidv4(), req.user.id, id])
      broadcastERD('favorite')
      res.json({ saved: true })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Proposals ─────────────────────────────────────────────────
app.get('/api/proposals', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, a.title AS anuncio_title, a.city, a.state
       FROM propostas p LEFT JOIN anuncios a ON p.anuncio_id = a.id
       WHERE p.buyer_id = ? ORDER BY p.created_at DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/proposals/seller', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, a.title AS anuncio_title, u.name AS buyer_name, u.phone AS buyer_phone
       FROM propostas p
       LEFT JOIN anuncios a ON p.anuncio_id = a.id
       LEFT JOIN users u    ON p.buyer_id   = u.id
       WHERE p.seller_id = ? ORDER BY p.created_at DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/proposals', auth, async (req, res) => {
  const id = uuidv4()
  const { anuncio_id, price_offered, signal_pct, withdrawal_date, freight_mode, message } = req.body
  let { seller_id } = req.body
  try {
    if (!seller_id && anuncio_id) {
      const [rows] = await pool.query('SELECT seller_id FROM anuncios WHERE id = ?', [anuncio_id])
      seller_id = rows[0]?.seller_id || null
    }
    await pool.query(
      `INSERT INTO propostas (id, anuncio_id, buyer_id, seller_id, price_offered, signal_pct, withdrawal_date, freight_mode, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, anuncio_id, req.user.id, seller_id, price_offered, signal_pct || 10, withdrawal_date || null, freight_mode || null, message || null]
    )
    const [rows] = await pool.query('SELECT * FROM propostas WHERE id = ?', [id])
    broadcastERD('proposta')
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/proposals/:id/accept', auth, async (req, res) => {
  try {
    await pool.query('UPDATE propostas SET status = "aceita", seller_note = ? WHERE id = ? AND seller_id = ?',
      [req.body.note || '', req.params.id, req.user.id])
    const [rows] = await pool.query('SELECT * FROM propostas WHERE id = ?', [req.params.id])
    broadcastERD('accept')
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/proposals/:id/reject', auth, async (req, res) => {
  try {
    await pool.query('UPDATE propostas SET status = "recusada", seller_note = ? WHERE id = ? AND seller_id = ?',
      [req.body.note || '', req.params.id, req.user.id])
    const [rows] = await pool.query('SELECT * FROM propostas WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Messages ──────────────────────────────────────────────────
app.get('/api/messages/:anuncio_id', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.*, u.name AS sender_name FROM mensagens m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.anuncio_id = ? ORDER BY m.created_at ASC`,
      [req.params.anuncio_id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/messages', auth, async (req, res) => {
  const id = uuidv4()
  const { anuncio_id, receiver_id, content } = req.body
  try {
    await pool.query(
      'INSERT INTO mensagens (id, anuncio_id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?, ?)',
      [id, anuncio_id, req.user.id, receiver_id, content]
    )
    const [rows] = await pool.query(
      'SELECT m.*, u.name AS sender_name FROM mensagens m LEFT JOIN users u ON m.sender_id = u.id WHERE m.id = ?',
      [id]
    )
    broadcastERD('message')
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Notifications ─────────────────────────────────────────────
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT *, (read_at IS NULL) AS unread FROM notificacoes WHERE user_id = ? ORDER BY created_at DESC LIMIT 30',
      [req.user.id]
    )
    if (rows.length) broadcastERD('notif')
    res.json(rows.map((r) => ({ ...r, read: !r.unread })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/notifications/read-all', auth, async (req, res) => {
  try {
    await pool.query('UPDATE notificacoes SET read_at = NOW() WHERE user_id = ? AND read_at IS NULL', [req.user.id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Logistics ─────────────────────────────────────────────────
const CITY_COORDS = {
  'fortaleza':         [-3.7172,  -38.5433],
  'recife':            [-8.0476,  -34.8770],
  'salvador':          [-12.9714, -38.5014],
  'são paulo':         [-23.5505, -46.6333],
  'sao paulo':         [-23.5505, -46.6333],
  'rio de janeiro':    [-22.9068, -43.1729],
  'belo horizonte':    [-19.9167, -43.9345],
  'brasília':          [-15.7801, -47.9292],
  'brasilia':          [-15.7801, -47.9292],
  'curitiba':          [-25.4278, -49.2731],
  'porto alegre':      [-30.0346, -51.2177],
  'manaus':            [-3.1019,  -60.0250],
  'belém':             [-1.4558,  -48.5044],
  'belem':             [-1.4558,  -48.5044],
  'goiânia':           [-16.6869, -49.2648],
  'goiania':           [-16.6869, -49.2648],
  'maceió':            [-9.6658,  -35.7350],
  'maceio':            [-9.6658,  -35.7350],
  'natal':             [-5.7945,  -35.2110],
  'teresina':          [-5.0892,  -42.8019],
  'campo grande':      [-20.4697, -54.6201],
  'cuiabá':            [-15.6014, -56.0979],
  'cuiaba':            [-15.6014, -56.0979],
  'palmas':            [-10.2491, -48.3243],
  'são luís':          [-2.5364,  -44.3068],
  'sao luis':          [-2.5364,  -44.3068],
  'joão pessoa':       [-7.1195,  -34.8450],
  'joao pessoa':       [-7.1195,  -34.8450],
  'aracaju':           [-10.9167, -37.0500],
  'vitória':           [-20.3155, -40.3128],
  'vitoria':           [-20.3155, -40.3128],
  'florianópolis':     [-27.5954, -48.5480],
  'florianopolis':     [-27.5954, -48.5480],
  'uberaba':           [-19.7476, -47.9307],
  'uberlândia':        [-18.9113, -48.2622],
  'uberlandia':        [-18.9113, -48.2622],
  'ribeirão preto':    [-21.1775, -47.8103],
  'ribeirao preto':    [-21.1775, -47.8103],
  'campinas':          [-22.9056, -47.0608],
  'maringá':           [-23.4273, -51.9375],
  'maringa':           [-23.4273, -51.9375],
  'londrina':          [-23.3045, -51.1696],
  'cascavel':          [-24.9578, -53.4595],
  'dourados':          [-22.2208, -54.8055],
  'rondonópolis':      [-16.4727, -54.6361],
  'rondonopolis':      [-16.4727, -54.6361],
  'barretos':          [-20.5571, -48.5678],
  'jataí':             [-17.8802, -51.7128],
  'jatai':             [-17.8802, -51.7128],
  'chapecó':           [-27.1007, -52.6152],
  'chapeco':           [-27.1007, -52.6152],
  'passo fundo':       [-28.2577, -52.4071],
  'bagé':              [-31.3289, -54.1069],
  'bage':              [-31.3289, -54.1069],
  'petrolina':         [-9.3891,  -40.5019],
  'mossoró':           [-5.1875,  -37.3444],
  'mossoro':           [-5.1875,  -37.3444],
  'montes claros':     [-16.7290, -43.8586],
  'patos de minas':    [-18.5787, -46.5185],
  'araxá':             [-19.5928, -46.9405],
  'araxa':             [-19.5928, -46.9405],
  'lavras':            [-21.2451, -44.9993],
}

function resolveCity(text) {
  if (!text) return null
  const norm = text.toLowerCase().replace(/,.*$/, '').trim()
  if (CITY_COORDS[norm]) return CITY_COORDS[norm]
  const key = Object.keys(CITY_COORDS).find((k) => norm.includes(k) || k.includes(norm))
  return key ? CITY_COORDS[key] : null
}

function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

app.get('/api/carriers', async (req, res) => {
  const { origin, dest } = req.query
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.nome_empresa, t.veiculo, t.capacidade, t.nota_media, t.taxa_km,
             1 AS verified
      FROM transportadoras t
      WHERE t.ativo = 1
      ORDER BY COALESCE(t.nota_media, 5.0) DESC
    `)

    const fromCoords = resolveCity(origin)
    const toCoords   = resolveCity(dest)
    const distKm     = fromCoords && toCoords ? haversineKm(fromCoords, toCoords) : null
    const TAXA_PADRAO = 5.20

    const result = rows.map((c) => {
      const taxa  = c.taxa_km ? Number(c.taxa_km) : TAXA_PADRAO
      const preco = distKm ? Math.round(distKm * taxa) : null
      const dias  = distKm ? Math.max(1, Math.ceil(distKm / 650)) : null
      return {
        id:             c.id,
        nome_empresa:   c.nome_empresa,
        veiculo:        c.veiculo || 'A definir',
        capacidade:     c.capacidade || null,
        nota_media:     c.nota_media ? Number(c.nota_media) : null,
        verified:       c.verified,
        distancia_km:   distKm,
        preco_estimado: preco,
        tempo_estimado: dias ? (dias === 1 ? '1 dia' : `${dias} dias`) : null,
      }
    }).sort((a, b) => (a.preco_estimado ?? 9999999) - (b.preco_estimado ?? 9999999))

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/freight', auth, async (req, res) => {
  const id = uuidv4()
  const { anuncio_id, transportadora_id, origem, destino, data_coleta } = req.body
  try {
    await pool.query(
      'INSERT INTO solicitacoes_frete (id, anuncio_id, comprador_id, transportadora_id, origem, destino, data_coleta) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, anuncio_id, req.user.id, transportadora_id, origem, destino, data_coleta || null]
    )
    broadcastERD('frete')
    res.json({ id, status: 'AGUARDANDO' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Health ────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date() }))

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
connectMySQL()
  .then(() => app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`)))
  .catch((err) => { console.error(err.message); process.exit(1) })
