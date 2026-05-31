Atue como um Engenheiro Front-end Sênior. Vamos iniciar o desenvolvimento do front-end de um Marketplace B2B/B2C de animais de produção (gado, equinos, aves, etc).

1. Visão Geral e Arquitetura Base
Objetivo: Criar um marketplace eliminando intermediários, focando na rastreabilidade (genética, saúde, nutrição) na página do animal e logística integrada.
Stack Tecnológica: ReactJS, Tailwind CSS, Framer Motion, Lucide React e React Router DOM.

Design System e Cores:

Tema: Light Mode (bg-slate-50).

Cores Principais: Verde Esmeralda (emerald-600 para botões/ações) e Verde Musgo (emerald-950 para textos/títulos fortes).

Efeitos: Glassmorphism em headers e modais (bg-white/70 backdrop-blur-md border border-white/20).

Interações: hover:scale-[1.02] transition-transform duration-300 para cards e botões. Loading states com animate-pulse.

2. Estrutura Completa de Telas do Sistema
Tenha em mente este mapa para a criação das rotas e componentes futuros:

Tela 1: Landing Page - Vitrine pública, categorias e destaques.

Tela 2: Autenticação/Onboarding - Login e escolha de perfil (Produtor, Frigorífico, Transportadora, etc).

Tela 3: Catálogo de Busca - Feed do marketplace com barra lateral de filtros complexos.

Tela 4: Página do Anúncio (PDP) - Core do sistema. Galeria de fotos, botão de compra e seções completas de Rastreabilidade (Genética, Nutrição, Sanidade) e Mapa.

Tela 5: Checkout e Negociação - Carrinho, propostas e contrato digital.

Tela 6: Logística e Frete - Match de CEPs com opções de transportadoras ou frete próprio.

Tela 7: Dashboard do Vendedor - Gestão de anúncios e formulário wizard para cadastrar animais.

Tela 8: Dashboard do Comprador - Timeline de pedidos, status de frete e documentos fiscais.

3. Sua Tarefa Inicial (Primeiro Entregável)
Com base na arquitetura acima, estruture o roteamento básico e gere o código da Tela 1 (Landing Page). Siga os princípios de Clean Code, componentização e crie dados mockados para renderização.

Gere os seguintes arquivos/componentes iniciais:

Layout.jsx: Wrapper com Header fixo (Glassmorphism, logo, busca, botões "Entrar") e Footer.

Button.jsx: Componente de botão reutilizável (variantes: primary = emerald, outline, ghost).

AnimalCard.jsx: O card de produto para a vitrine (Imagem com placeholder sólido, Título, Preço, Preço/@, Localização). Adicione o hover state definido.

LandingPage.jsx: A página principal contendo:

Hero Section: Banner de impacto com chamada "Compre e venda genética animal direto da fonte".

Categories Grid: Grade responsiva com ícones do Lucide para espécies.

Featured Section: Seção de "Lotes em Destaque" renderizando no mínimo 3 AnimalCard com dados mockados.

Forneça o código completo e estruturado, aplicando Tailwind para responsividade (mobile-first) e Framer Motion para entradas suaves das seções.