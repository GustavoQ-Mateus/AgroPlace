-- =============================================================
--  AgroPlace — Seed de Dados de Demonstração
--  Execute APÓS o schema. Cria usuários demo via auth.users
--  (use apenas em ambiente de desenvolvimento).
-- =============================================================

-- ATENÇÃO: Em produção, use a interface do Supabase ou auth.admin
-- para criar usuários. Este seed usa UUIDs fixos para facilitar testes.

DO $$
DECLARE
  uid_vendedor   UUID := '00000000-0000-0000-0000-000000000001';
  uid_comprador  UUID := '00000000-0000-0000-0000-000000000002';
  uid_transp     UUID := '00000000-0000-0000-0000-000000000003';
  aid_1 UUID; aid_2 UUID; aid_3 UUID; aid_4 UUID; aid_5 UUID;
BEGIN

  -- ── Perfis (os triggers criam automaticamente ao cadastrar,
  --    mas aqui inserimos direto para o seed) ──────────────────

  INSERT INTO public.profiles (id, role, name, phone, document, verified)
  VALUES
    (uid_vendedor,  'produtor',        'Fazenda Santa Cruz',    '(34) 99901-0001', '111.111.111-11', true),
    (uid_comprador, 'comprador',       'Abatedouro Planalto',   '(19) 99902-0002', '22.222.222/0001-22', true),
    (uid_transp,    'transportadora',  'TranSul Logística',     '(51) 99903-0003', '33.333.333/0001-33', true)
  ON CONFLICT (id) DO NOTHING;

  -- ── Perfil Produtor ────────────────────────────────────────
  INSERT INTO public.perfis_produtor
    (profile_id, farm_name, car, area_hectares, city, state)
  VALUES
    (uid_vendedor, 'Fazenda Santa Cruz', 'MG-1234567-8', 450.00, 'Uberaba', 'MG')
  ON CONFLICT DO NOTHING;

  -- ── Perfil Corporativa ─────────────────────────────────────
  INSERT INTO public.perfis_corporativa
    (profile_id, razao_social, cnpj, city, state, segment)
  VALUES
    (uid_comprador, 'Abatedouro Planalto Ltda', '22.222.222/0001-22', 'Campinas', 'SP', 'Abate e Processamento')
  ON CONFLICT DO NOTHING;

  -- ── Perfil Transportadora ──────────────────────────────────
  INSERT INTO public.perfis_transportadora
    (profile_id, razao_social, cnpj, rntrc, vehicle_types, live_transport, city, state, score)
  VALUES
    (uid_transp, 'TranSul Logística S.A.', '33.333.333/0001-33', 'RNTRC-9876',
     ARRAY['carreta_boiadeira','truck_gaiola'], true, 'Porto Alegre', 'RS', 98.0)
  ON CONFLICT DO NOTHING;

  -- ── Anúncios ───────────────────────────────────────────────
  INSERT INTO public.anuncios
    (id, seller_id, title, category, breed, quantity, weight_min_kg, weight_max_kg,
     sex, price_total, price_per_head, city, state, farm_name, description,
     freight_mode, status, traceability_score)
  VALUES
    (uuid_generate_v4(), uid_vendedor,
     'Lote Nelore Boi Gordo — 85 cab.', 'bovinos', 'Nelore', 85,
     480, 540, 'macho_castrado', 204000, 2400, 'Uberaba', 'MG',
     'Fazenda Santa Cruz',
     'Lote de nelore com excelente acabamento de carcaça, terminado em confinamento por 90 dias.',
     'plataforma', 'ativo', 88),

    (uuid_generate_v4(), uid_vendedor,
     'Novilhas Girolando — 40 cab.', 'bovinos', 'Girolando', 40,
     350, 420, 'femea', 140000, 3500, 'Patos de Minas', 'MG',
     'Fazenda Santa Cruz',
     'Novilhas em idade reprodutiva, aptas para reposição de plantel leiteiro.',
     'plataforma', 'ativo', 75),

    (uuid_generate_v4(), uid_vendedor,
     'Santa Inês Matrizes — 120 cab.', 'ovinos', 'Santa Inês', 120,
     45, 65, 'femea', 72000, 600, 'Sobral', 'CE',
     'Granja Boa Vista',
     'Matrizes Santa Inês de alta prolificidade, vacinadas e com GTA.',
     'proprio', 'ativo', 63),

    (uuid_generate_v4(), uid_vendedor,
     'Frango de Corte Cobb 500 — 5.000 un.', 'aves', 'Cobb 500', 5000,
     2, 3, 'misto', 35000, 7, 'Chapecó', 'SC',
     'Granja Chapecó',
     'Lote de frango pronto para abate, 42 dias, peso médio 2,8 kg.',
     'plataforma', 'ativo', 100),

    (uuid_generate_v4(), uid_vendedor,
     'Mangalarga Marchador — 8 cab.', 'equinos', 'Mangalarga Marchador', 8,
     400, 480, 'misto', 280000, 35000, 'Lavras', 'MG',
     'Haras São João',
     'Animais com registro no studbook, selecionados para marcha batida.',
     'proprio', 'ativo', 88)
  RETURNING id INTO aid_1;

  RAISE NOTICE 'Seed concluído com sucesso.';
END $$;
