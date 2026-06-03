const mysql  = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

const DB = {
  host:     process.env.DB_HOST || '127.0.0.1',
  port:     3306,
  user:     'agroplace',
  password: 'AgroPlace@2026',
  database: 'agroplace',
}

// Fotos específicas por anúncio (índice 0-17, mesma ordem dos anuncios[])
// Índice 0 de cada array = capa (is_cover=1)
const PHOTOS = [
  // 0 — Nelore Rastreado 120 Cabeças
  [
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80',
    'https://images.unsplash.com/photo-1527153818091-1a9638521e2a?w=800&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
  ],
  // 1 — Nelore EM 80 Garrotes
  [
    'https://images.unsplash.com/photo-1560114928-145b6d1b15ae?w=800&q=80',
    'https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&q=80',
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&q=80',
  ],
  // 2 — Angus Cruzado 50 Novilhos
  [
    'https://images.unsplash.com/photo-1594909522-e46b4dd70524?w=800&q=80',
    'https://images.unsplash.com/photo-1563306406-e66174fa3787?w=800&q=80',
    'https://images.unsplash.com/photo-1545468400-f0b939ac3e1c?w=800&q=80',
  ],
  // 3 — Vacas Holandesas Leiteiras 30 cab
  [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
    'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800&q=80',
    'https://images.unsplash.com/photo-1558969823-aa532e4b2f9f?w=800&q=80',
  ],
  // 4 — Gir Leiteiro Matrizes 20 cab
  [
    'https://images.unsplash.com/photo-1557684651-8a0f91960ec8?w=800&q=80',
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80',
    'https://images.unsplash.com/photo-1560114928-145b6d1b15ae?w=800&q=80',
  ],
  // 5 — Brangus Recria 200 Cabeças
  [
    'https://images.unsplash.com/photo-1548550994-4de5f6680b06?w=800&q=80',
    'https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
  ],
  // 6 — Zebu Reprodutores PO 5 Touros
  [
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&q=80',
    'https://images.unsplash.com/photo-1527153818091-1a9638521e2a?w=800&q=80',
    'https://images.unsplash.com/photo-1563306406-e66174fa3787?w=800&q=80',
  ],
  // 7 — Quarto de Milha 3 éguas
  [
    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80',
    'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=800&q=80',
    'https://images.unsplash.com/photo-1508817628294-5a453fa1c2e0?w=800&q=80',
  ],
  // 8 — Mangalarga Marchador Garanhão
  [
    'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=800&q=80',
    'https://images.unsplash.com/photo-1580837620751-6dc5d0c81e74?w=800&q=80',
    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80',
  ],
  // 9 — Appaloosa 4 Cavalos Laço
  [
    'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=800&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=800&q=80',
  ],
  // 10 — Suínos Terminados 500 Cabeças
  [
    'https://images.unsplash.com/photo-1535268244-3dcdde7a625a?w=800&q=80',
    'https://images.unsplash.com/photo-1604848698030-c434ba08ece1?w=800&q=80',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
  ],
  // 11 — Matrizes Suínas 50 cab
  [
    'https://images.unsplash.com/photo-1604848698030-c434ba08ece1?w=800&q=80',
    'https://images.unsplash.com/photo-1535268244-3dcdde7a625a?w=800&q=80',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
  ],
  // 12 — Frangos de Corte 10.000 cab
  [
    'https://images.unsplash.com/photo-1548550994-4de5f6680b06?w=800&q=80',
    'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=800&q=80',
    'https://images.unsplash.com/photo-1612196808214-b7b43b4f1dd6?w=800&q=80',
  ],
  // 13 — Matrizes Pesadas 2.000 Galinhas
  [
    'https://images.unsplash.com/photo-1612196808214-b7b43b4f1dd6?w=800&q=80',
    'https://images.unsplash.com/photo-1548550994-4de5f6680b06?w=800&q=80',
    'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=800&q=80',
  ],
  // 14 — Dorper 80 Cordeiros Terminados
  [
    'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=800&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
    'https://images.unsplash.com/photo-1623200216581-963d1d45c21d?w=800&q=80',
  ],
  // 15 — Santa Inês 100 Matrizes
  [
    'https://images.unsplash.com/photo-1623200216581-963d1d45c21d?w=800&q=80',
    'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=800&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
  ],
  // 16 — Boer 60 Caprinos Terminados
  [
    'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&q=80',
    'https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=800&q=80',
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
  ],
  // 17 — Saanen 30 Cabras Leiteiras
  [
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&q=80',
    'https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=800&q=80',
  ],
]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

async function main() {
  const c = await mysql.createConnection(DB)
  console.log('Conectado. Iniciando seed...')

  // Limpar tabelas
  await c.query('SET FOREIGN_KEY_CHECKS=0')
  for (const t of ['solicitacoes_frete','notificacoes','mensagens','contratos','propostas','favoritos','fotos_anuncio','anuncios','transportadoras','users']) {
    await c.query('TRUNCATE TABLE ' + t)
  }
  await c.query('SET FOREIGN_KEY_CHECKS=1')
  console.log('Tabelas limpas.')

  const hash = await bcrypt.hash('AgroPlace123', 10)

  // ── USUÁRIOS ────────────────────────────────────────────────
  const produtores = [
    { id: uuidv4(), email: 'joao.pecuarista@gmail.com',  name: 'João Carlos Silva',      phone: '(65) 99823-4501', role: 'produtor' },
    { id: uuidv4(), email: 'maria.fazenda@hotmail.com',  name: 'Maria Aparecida Costa',  phone: '(67) 98712-3300', role: 'produtor' },
    { id: uuidv4(), email: 'pedro.agro@yahoo.com.br',    name: 'Pedro Henrique Souza',   phone: '(34) 99401-8820', role: 'produtor' },
    { id: uuidv4(), email: 'ana.rural@gmail.com',        name: 'Ana Paula Rodrigues',    phone: '(62) 98834-6610', role: 'produtor' },
    { id: uuidv4(), email: 'roberto.pecuaria@gmail.com', name: 'Roberto Alves Mendes',   phone: '(66) 99102-7750', role: 'produtor' },
    { id: uuidv4(), email: 'carlos.fazendeiro@gmail.com',name: 'Carlos Eduardo Lima',    phone: '(18) 99573-2240', role: 'produtor' },
  ]
  const compradores = [
    { id: uuidv4(), email: 'frigorífico.sul@gmail.com',  name: 'Frigorífico Sul Ltda',   phone: '(54) 3222-8800', role: 'comprador' },
    { id: uuidv4(), email: 'compras.bovinos@gmail.com',  name: 'Lucas Ferreira Compras', phone: '(11) 98765-4321', role: 'comprador' },
    { id: uuidv4(), email: 'agrocompras@hotmail.com',    name: 'Fernanda Oliveira',       phone: '(47) 99234-5670', role: 'comprador' },
  ]
  const transportadoras = [
    { id: uuidv4(), email: 'boitruck@gmail.com',         name: 'BoiTruck Transportes',   phone: '(65) 99100-2233', role: 'transportadora' },
    { id: uuidv4(), email: 'ruralexpress@gmail.com',     name: 'Rural Express Cargas',   phone: '(67) 98800-5566', role: 'transportadora' },
    { id: uuidv4(), email: 'agrofrete@gmail.com',        name: 'AgroFrete Logística',    phone: '(62) 99300-7788', role: 'transportadora' },
  ]

  const allUsers = [...produtores, ...compradores, ...transportadoras]
  for (const u of allUsers) {
    await c.query(
      'INSERT INTO users (id,email,password_hash,name,phone,role,verified) VALUES (?,?,?,?,?,?,1)',
      [u.id, u.email, hash, u.name, u.phone, u.role]
    )
  }
  console.log('Usuários inseridos:', allUsers.length)

  // ── TRANSPORTADORAS ─────────────────────────────────────────
  const transProfiles = [
    { user: transportadoras[0], nome: 'BoiTruck Transportes',  veiculo: 'Bitrem Boiadeiro',     capacidade: 48, nota: 4.8, taxa: 3.20 },
    { user: transportadoras[1], nome: 'Rural Express Cargas',   veiculo: 'Treminhão Boiadeiro',  capacidade: 60, nota: 4.6, taxa: 2.85 },
    { user: transportadoras[2], nome: 'AgroFrete Logística',    veiculo: 'Carreta Boiadeira',    capacidade: 36, nota: 4.9, taxa: 3.50 },
  ]
  for (const t of transProfiles) {
    await c.query(
      'INSERT INTO transportadoras (id,nome_empresa,veiculo,capacidade,nota_media,taxa_km,ativo) VALUES (?,?,?,?,?,?,1)',
      [uuidv4(), t.nome, t.veiculo, t.capacidade, t.nota, t.taxa]
    )
  }
  console.log('Transportadoras inseridas.')

  // ── ANÚNCIOS ────────────────────────────────────────────────
  const anuncios = [
    { seller: produtores[0], title: 'Nelore Rastreado – Lote 120 Cabeças', category: 'bovinos', breed: 'Nelore', qty: 120, weight: 480, price_total: 936000, price_head: 7800,  price_arroba: 325, city: 'Cuiabá',       state: 'MT', score: 98, desc: 'Lote de nelore rastreado, todos com brinco, excelente acabamento de gordura. Prontos para abate. Vacinação em dia.' },
    { seller: produtores[1], title: 'Angus Cruzado – 50 Novilhos',         category: 'bovinos', breed: 'Angus x Nelore', qty: 50, weight: 420, price_total: 367500, price_head: 7350, price_arroba: 350, city: 'Campo Grande', state: 'MS', score: 95, desc: 'Novilhos cruzados Angus x Nelore, excelente marmoreio, classificação Prime esperada. Origem rastreada.' },
    { seller: produtores[2], title: 'Brangus Recria – 200 Cabeças',        category: 'bovinos', breed: 'Brangus',  qty: 200, weight: 320, price_total: 1100000, price_head: 5500, price_arroba: 300, city: 'Goiânia',      state: 'GO', score: 89, desc: 'Lote Brangus recria, padronizado, procedência garantida. Ideal para engorda. Brinco e vacinação completa.' },
  ]

  const anuncioIds = []
  for (const a of anuncios) {
    const id = uuidv4()
    anuncioIds.push({ id, idx: anuncioIds.length })
    await c.query(
      `INSERT INTO anuncios (id,seller_id,title,category,breed,quantity,weight,price_total,price_per_head,price_per_arroba,city,state,description,traceability_score,status,view_count)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,'ativo',?)`,
      [id, a.seller.id, a.title, a.category, a.breed, a.qty, a.weight,
       a.price_total, a.price_head, a.price_arroba || null,
       a.city, a.state, a.desc, a.score,
       Math.floor(Math.random() * 300) + 50]
    )
  }
  console.log('Anúncios inseridos:', anuncioIds.length)

  // ── FOTOS ──────────────────────────────────────────────────
  let fotoCount = 0
  for (const { id, idx } of anuncioIds) {
    const imgs = PHOTOS[idx] || PHOTOS[0]
    for (let i = 0; i < imgs.length; i++) {
      await c.query(
        'INSERT INTO fotos_anuncio (id,anuncio_id,url,is_cover,order_index) VALUES (?,?,?,?,?)',
        [uuidv4(), id, imgs[i], i === 0 ? 1 : 0, i]
      )
      fotoCount++
    }
  }
  console.log('Fotos inseridas:', fotoCount)

  // ── FAVORITOS ──────────────────────────────────────────────
  const favPairs = [
    [compradores[0].id, anuncioIds[0].id],
    [compradores[0].id, anuncioIds[2].id],
    [compradores[1].id, anuncioIds[1].id],
    [compradores[2].id, anuncioIds[0].id],
  ]
  for (const [uid, aid] of favPairs) {
    await c.query('INSERT INTO favoritos (id,user_id,anuncio_id) VALUES (?,?,?)', [uuidv4(), uid, aid])
  }
  console.log('Favoritos inseridos:', favPairs.length)

  // ── PROPOSTAS ──────────────────────────────────────────────
  const propostas = [
    { anuncio: anuncioIds[0], buyer: compradores[0], seller: produtores[0], price: 900000,  signal: 10, withdraw: '2026-07-15', freight: 'CIF', msg: 'Interesse no lote completo. Podemos negociar o frete?', status: 'aguardando' },
    { anuncio: anuncioIds[1], buyer: compradores[1], seller: produtores[1], price: 360000,  signal: 15, withdraw: '2026-07-20', freight: 'FOB', msg: 'Oferta pelos 50 novilhos Angus. Retirada na propriedade.', status: 'aceita' },
    { anuncio: anuncioIds[2], buyer: compradores[0], seller: produtores[2], price: 1050000, signal: 20, withdraw: '2026-08-01', freight: 'CIF', msg: 'Lote Brangus para nosso confinamento. Proposta firme.', status: 'aguardando' },
  ]
  const propostaIds = []
  for (const p of propostas) {
    const id = uuidv4()
    propostaIds.push({ id, p })
    await c.query(
      `INSERT INTO propostas (id,anuncio_id,buyer_id,seller_id,price_offered,signal_pct,withdrawal_date,freight_mode,message,status)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [id, p.anuncio.id, p.buyer.id, p.seller.id, p.price, p.signal, p.withdraw, p.freight, p.msg, p.status]
    )
  }
  console.log('Propostas inseridas:', propostaIds.length)

  // ── CONTRATOS ──────────────────────────────────────────────
  const contratosData = [
    { prop: propostaIds[1], anuncio: anuncioIds[1], buyer: compradores[1], seller: produtores[1], price: 360000, signal: 54000, withdraw: '2026-07-20', buyerName: 'Lucas Ferreira', sellerName: 'Maria Aparecida Costa' },
  ]
  for (const ct of contratosData) {
    await c.query(
      `INSERT INTO contratos (id,proposta_id,anuncio_id,buyer_id,seller_id,price_final,signal_value,withdrawal_date,status,buyer_sign_name,seller_sign_name,buyer_signed_at,seller_signed_at)
       VALUES (?,?,?,?,?,?,?,?,'assinado',?,?,NOW(),NOW())`,
      [uuidv4(), ct.prop.id, ct.anuncio.id, ct.buyer.id, ct.seller.id, ct.price, ct.signal, ct.withdraw, ct.buyerName, ct.sellerName]
    )
  }
  console.log('Contratos inseridos:', contratosData.length)

  // ── MENSAGENS ──────────────────────────────────────────────
  const msgs = [
    [anuncioIds[0].id, compradores[0].id, produtores[0].id, 'Olá! Tenho interesse no lote de nelore. O frete é incluso?'],
    [anuncioIds[0].id, produtores[0].id, compradores[0].id, 'Bom dia! O frete pode ser negociado. Qual a cidade de destino?'],
    [anuncioIds[0].id, compradores[0].id, produtores[0].id, 'Destino Campo Grande MS. Podemos fechar ainda essa semana?'],
    [anuncioIds[1].id, compradores[1].id, produtores[1].id, 'Gostei muito dos novilhos Angus. Posso visitar a propriedade?'],
    [anuncioIds[1].id, produtores[1].id, compradores[1].id, 'Claro! Disponível sexta-feira ou qualquer dia da próxima semana.'],
    [anuncioIds[2].id, compradores[0].id, produtores[2].id, 'Os 200 brangus têm rastreabilidade?'],
    [anuncioIds[2].id, produtores[2].id, compradores[0].id, 'Sim, todos com brinco SISBOV e sistema GTA em dia.'],
  ]
  for (const [anuncio_id, sender_id, receiver_id, content] of msgs) {
    await c.query(
      'INSERT INTO mensagens (id,anuncio_id,sender_id,receiver_id,content) VALUES (?,?,?,?,?)',
      [uuidv4(), anuncio_id, sender_id, receiver_id, content]
    )
  }
  console.log('Mensagens inseridas:', msgs.length)

  // ── NOTIFICAÇÕES ───────────────────────────────────────────
  const notifs = [
    [produtores[0].id, 'Nova proposta recebida', 'Frigorífico Sul fez uma proposta de R$ 900.000 no lote Nelore.', 'proposta'],
    [produtores[1].id, 'Proposta aceita', 'Contrato gerado para os 50 novilhos Angus com Lucas Ferreira.', 'contrato'],
    [compradores[0].id, 'Mensagem recebida', 'João Carlos Silva respondeu sua mensagem sobre o lote Nelore.', 'mensagem'],
    [compradores[1].id, 'Contrato assinado', 'O vendedor assinou o contrato dos novilhos Angus. Efetue o pagamento.', 'contrato'],
    [produtores[2].id, 'Nova mensagem', 'Frigorífico Sul perguntou sobre rastreabilidade do lote Brangus.', 'mensagem'],
  ]
  for (const [user_id, title, body, type] of notifs) {
    await c.query(
      'INSERT INTO notificacoes (id,user_id,title,body,type) VALUES (?,?,?,?,?)',
      [uuidv4(), user_id, title, body, type]
    )
  }
  console.log('Notificações inseridas:', notifs.length)

  // ── SOLICITAÇÕES DE FRETE ──────────────────────────────────
  const [transRows] = await c.query('SELECT id FROM transportadoras LIMIT 3')
  if (transRows.length >= 2) {
    const fretes = [
      [anuncioIds[0].id, compradores[0].id, transRows[0].id, 'Cuiabá, MT',       'Campo Grande, MS', '2026-07-18', 'pendente'],
      [anuncioIds[1].id, compradores[1].id, transRows[1].id, 'Campo Grande, MS', 'São Paulo, SP',    '2026-07-22', 'confirmado'],
      [anuncioIds[2].id, compradores[0].id, transRows[0].id, 'Goiânia, GO',      'Brasília, DF',     '2026-08-03', 'pendente'],
    ]
    for (const [anuncio_id, comprador_id, transportadora_id, origem, destino, data_coleta, status] of fretes) {
      await c.query(
        'INSERT INTO solicitacoes_frete (id,anuncio_id,comprador_id,transportadora_id,origem,destino,data_coleta,status) VALUES (?,?,?,?,?,?,?,?)',
        [uuidv4(), anuncio_id, comprador_id, transportadora_id, origem, destino, data_coleta, status]
      )
    }
    console.log('Solicitações de frete inseridas: 3')
  }

  await c.end()
  console.log('\n✓ Seed completo! Banco populado com sucesso.')
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1) })
