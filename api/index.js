const express = require('express')
const mysql   = require('mysql2/promise')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const cors    = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(cors())
app.use(express.json())

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
      SELECT a.*, u.name AS seller_name, u.verified AS seller_verified
      FROM anuncios a
      LEFT JOIN users u ON a.seller_id = u.id
      WHERE ${where.join(' AND ')}
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?`
    params.push(Number(limit), Number(offset))
    const [rows] = await pool.query(sql, params)
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
      `SELECT a.*, u.name AS seller_name, u.verified AS seller_verified
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
  const { anuncio_id, seller_id, price_offered, signal_pct, withdrawal_date, freight_mode, message } = req.body
  try {
    await pool.query(
      `INSERT INTO propostas (id, anuncio_id, buyer_id, seller_id, price_offered, signal_pct, withdrawal_date, freight_mode, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, anuncio_id, req.user.id, seller_id, price_offered, signal_pct || 10, withdrawal_date || null, freight_mode || null, message || null]
    )
    const [rows] = await pool.query('SELECT * FROM propostas WHERE id = ?', [id])
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
app.get('/api/carriers', async (_req, res) => {
  res.json([
    { id: 1, nome_empresa: 'TransAgro Sul',    nota_media: 4.8, preco_estimado: 2850, tempo_estimado: '2-3 dias', veiculo: 'Boiadeiro 24m', capacidade: 40 },
    { id: 2, nome_empresa: 'Frete Pecuário',   nota_media: 4.6, preco_estimado: 3100, tempo_estimado: '1-2 dias', veiculo: 'Bitrem 30m',    capacidade: 55 },
    { id: 3, nome_empresa: 'AgroFrete Express',nota_media: 4.5, preco_estimado: 3400, tempo_estimado: '1 dia',    veiculo: 'Bitrem 30m',    capacidade: 48 },
  ])
})

app.post('/api/freight', auth, async (req, res) => {
  const id = uuidv4()
  const { anuncio_id, transportadora_id, origem, destino, data_coleta } = req.body
  try {
    await pool.query(
      'INSERT INTO solicitacoes_frete (id, anuncio_id, comprador_id, transportadora_id, origem, destino, data_coleta) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, anuncio_id, req.user.id, transportadora_id, origem, destino, data_coleta || null]
    )
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
