import { useState } from 'react';
import { 
  CloudFog, 
  Trees, 
  HeartPulse, 
  Wind, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Eye,
  AlertTriangle,
  Zap,
  Trash2,
  Bike,
  ShieldAlert
} from 'lucide-react';

interface ScenarioChoice {
  label: string;
  emoji: string;
  isEco: boolean;
  desc: string;
  curupiraComment: string;
  pollutionLevel: number; // 0 para eco, 100 para poluente
  statusLabel: string;
  curupiraMood: string;
  curupiraAvatar: string;
}

interface Scenario {
  id: string;
  title: string;
  icon: string;
  choices: ScenarioChoice[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'transporte',
    title: 'Transporte Urbano',
    icon: '🚲',
    choices: [
      {
        label: 'Carros a Gasolina 🚗',
        emoji: '🚗',
        isEco: false,
        desc: 'Veículos movidos a combustão queimam derivados de petróleo e expelem monóxido de carbono e fuligem fina na atmosfera da cidade.',
        curupiraComment: 'Atenção! O excesso de veículos a gasolina cria nuvens cinzentas de fumaça tóxica nas cidades, irritando a garganta e afetando a nossa saúde respiratória.',
        pollutionLevel: 80,
        statusLabel: 'Ar Poluído 🌫️',
        curupiraMood: '🤬 Curupira Preocupado!',
        curupiraAvatar: '🤬'
      },
      {
        label: 'Bicicletas e Ônibus Elétricos 🚲',
        emoji: '🚲',
        isEco: true,
        desc: 'Meios de transporte limpos utilizam energia humana ou eletricidade renovável, deslocando as pessoas de forma saudável sem gerar emissões de queima.',
        curupiraComment: 'Excelente escolha! Utilizar ciclovias e transporte elétrico reduz a emissão de poluentes a zero, deixando o ar limpo e as calçadas muito mais agradáveis!',
        pollutionLevel: 0,
        statusLabel: 'Ar Puro e Fresco ✨',
        curupiraMood: '😁 Curupira Radiante!',
        curupiraAvatar: '😁'
      }
    ]
  },
  {
    id: 'lixo',
    title: 'Destino dos Resíduos',
    icon: '♻️',
    choices: [
      {
        label: 'Queima de Resíduos 🔥',
        emoji: '🔥',
        isEco: false,
        desc: 'Queimar lixo doméstico, sacolas plásticas ou folhas secas no quintal libera gases tóxicos, cinzas e fuligens que invadem as casas vizinhas.',
        curupiraComment: 'Perigo! A fumaça gerada pela queima de plásticos contém toxinas perigosas. Isso irrita os olhos, provoca tosse imediata e é péssimo para quem tem asma.',
        pollutionLevel: 95,
        statusLabel: 'Fumaça Tóxica ⚠️',
        curupiraMood: '😢 Curupira Triste',
        curupiraAvatar: '😢'
      },
      {
        label: 'Reciclagem e Compostagem ♻️',
        emoji: '♻️',
        isEco: true,
        desc: 'Separar o lixo reciclável e transformar restos de comida em adubo natural evita a queima e cria nutrientes ricos para fertilizar o solo.',
        curupiraComment: 'Maravilhoso! A reciclagem poupa recursos naturais e a compostagem transforma cascas de vegetais em terra rica para cultivar hortas sem poluição!',
        pollutionLevel: 0,
        statusLabel: 'Poluição Zero 🌿',
        curupiraMood: '👑 Curupira Orgulhoso!',
        curupiraAvatar: '👑'
      }
    ]
  },
  {
    id: 'energia',
    title: 'Geração de Energia',
    icon: '☀️',
    choices: [
      {
        label: 'Usinas Térmicas a Carvão 🏭',
        emoji: '🏭',
        isEco: false,
        desc: 'Usinas queimam carvão mineral para ferver água e mover turbinas, liberando enormes colunas de fumaça carregadas de gás carbônico na atmosfera.',
        curupiraComment: 'Alerta! O carvão mineral é um dos maiores poluidores climáticos. Sua queima lança fuligem pesada que viaja com o vento por milhares de quilômetros.',
        pollutionLevel: 100,
        statusLabel: 'Alerta Atmosférico 🚨',
        curupiraMood: '🤬 Curupira Furioso!',
        curupiraAvatar: '🤬'
      },
      {
        label: 'Energia Solar e Eólica ☀️',
        emoji: '☀️',
        isEco: true,
        desc: 'Captação direta da luz do sol através de painéis fotovoltaicos e da força do vento através de aerogeradores para gerar eletricidade limpa.',
        curupiraComment: 'Sensacional! A energia solar e eólica aproveitam as forças renováveis do nosso planeta sem queimar nenhum combustível e sem gerar nenhuma gota de fumaça!',
        pollutionLevel: 0,
        statusLabel: 'Energia Limpa e Renovável ⚡',
        curupiraMood: '👑 Curupira Lendário!',
        curupiraAvatar: '👑'
      }
    ]
  },
  {
    id: 'agricultura',
    title: 'Manejo do Solo',
    icon: '🚜',
    choices: [
      {
        label: 'Uso de Fogo (Queimadas) 🔥',
        emoji: '🔥',
        isEco: false,
        desc: 'Queimar a vegetação seca para limpar terrenos rapidamente antes do plantio, eliminando a matéria orgânica superficial.',
        curupiraComment: 'Atenção! As queimadas agrícolas destroem os nutrientes da terra, eliminam micro-organismos protetores e facilmente saem do controle, virando incêndios florestais.',
        pollutionLevel: 90,
        statusLabel: 'Risco de Incêndio 🪓',
        curupiraMood: '😢 Curupira Alarmado',
        curupiraAvatar: '😢'
      },
      {
        label: 'Roçagem Mecânica e Adubação 🚜',
        emoji: '🚜',
        isEco: true,
        desc: 'Cortar a vegetação de forma mecânica sem queimar, mantendo a palha cobrindo o solo para preservar sua umidade e nutrientes.',
        curupiraComment: 'Excelente atitude! A roçagem manual ou mecânica preserva a riqueza do solo, evita acidentes catastróficos com fogo e não gera poluição do ar!',
        pollutionLevel: 0,
        statusLabel: 'Solo Protegido 🌾',
        curupiraMood: '🙂 Curupira Satisfeito',
        curupiraAvatar: '🙂'
      }
    ]
  }
];

export default function InfoPanels() {
  const [activeTab, setActiveTab] = useState<'info' | 'body' | 'simulator'>('info');
  const [selectedBodyPart, setSelectedBodyPart] = useState<'olhos' | 'nariz' | 'pulmoes'>('pulmoes');
  
  // Controle de estados para o novo Laboratório de Escolhas (Aba 3)
  const [activeScenarioId, setActiveScenarioId] = useState<string>('transporte');
  const [scenarioSelections, setScenarioSelections] = useState<Record<string, number>>({
    transporte: 1, // Começa no ecológico (Bicicletas)
    lixo: 1,       // Começa no ecológico (Reciclagem)
    energia: 1,    // Começa no ecológico (Solar)
    agricultura: 1 // Começa no ecológico (Roçagem)
  });

  // Obter cenário atual e escolha atual
  const currentScenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];
  const activeChoiceIndex = scenarioSelections[activeScenarioId];
  const currentChoice = currentScenario.choices[activeChoiceIndex];

  // Alterna a escolha do cenário atual
  const handleSelectChoice = (choiceIndex: number) => {
    setScenarioSelections(prev => ({
      ...prev,
      [activeScenarioId]: choiceIndex
    }));
  };

  return (
    <div className="info-section">
      <style>{`
        .info-section {
          font-family: 'Comic Sans MS', 'Chalkboard SE', 'Barlow', sans-serif;
          user-select: none;
        }

        /* Centralização Geral e Ajuste do Card */
        .info-content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        /* Abas Interativas */
        .info-tabs {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          width: 100%;
        }
        
        .tab-btn {
          background: #fff;
          border: 3px solid #dee2e6;
          padding: 12px 24px;
          border-radius: 50px;
          font-size: 18px;
          font-weight: bold;
          color: #495057;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 0 #dee2e6;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .tab-btn:hover {
          transform: translateY(-3px);
          border-color: #52b788;
          box-shadow: 0 8px 0 #d8f3dc;
          color: #2d6a4f;
        }
        
        .tab-btn.active {
          background: #2d6a4f;
          color: #fff;
          border-color: #1b4332;
          box-shadow: 0 5px 0 #1b4332;
          transform: translateY(2px);
        }

        /* Conteúdo Principal Centrado e Equilibrado */
        .info-card-main {
          background: #fff;
          border-radius: 28px;
          padding: 35px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          min-height: 420px;
          border: 4px solid #fff;
          width: 100%;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        /* Aba 1: O Mistério da Fumaça */
        .mystery-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          align-items: start;
        }
        
        @media (max-width: 768px) {
          .mystery-grid {
            grid-template-columns: 1fr;
          }
        }

        .compare-box {
          border-radius: 20px;
          padding: 20px;
          border: 3px solid #dee2e6;
          transition: transform 0.2s;
        }
        
        .compare-box.clean {
          background: #f4fbf7;
          border-color: #a3b18a;
        }
        
        .compare-box.smoky {
          background: #f8f9fa;
          border-color: #ced4da;
        }

        .compare-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .particles-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
        }

        .particle-item {
          background: #fff;
          padding: 12px;
          border-radius: 12px;
          border: 2px solid #e9ecef;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Aba 2: Detetive do Corpo */
        .body-container {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 30px;
          align-items: stretch;
        }
        
        @media (max-width: 768px) {
          .body-container {
            grid-template-columns: 1fr;
          }
        }

        .body-visual {
          background: #f8f9fa;
          border-radius: 24px;
          padding: 20px;
          border: 3px solid #e9ecef;
          display: flex;
          flex-direction: column;
          gap: 12px;
          justify-content: center;
        }

        .body-btn {
          background: #fff;
          border: 3px solid #dee2e6;
          padding: 15px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          box-shadow: 0 4px 0 #dee2e6;
          color: #495057;
        }

        .body-btn:hover {
          transform: translateY(-2px);
          border-color: #fcbf49;
          box-shadow: 0 6px 0 #ffe3a8;
        }

        .body-btn.active {
          background: #e76f51;
          color: #fff;
          border-color: #b54a30;
          box-shadow: 0 4px 0 #b54a30;
        }

        .body-btn.active.eye-color { background: #48cae4; border-color: #0096c7; box-shadow: 0 4px 0 #0077b6; }
        .body-btn.active.nose-color { background: #fcbf49; border-color: #f77f00; box-shadow: 0 4px 0 #d66d00; color: #495057; }
        .body-btn.active.lung-color { background: #ef233c; border-color: #c90822; box-shadow: 0 4px 0 #a30015; }

        .body-detail-card {
          background: #fff3f3;
          border: 3px dashed #ef233c;
          border-radius: 20px;
          padding: 30px;
          text-align: left;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .body-detail-card.eye-theme { background: #f0faff; border-color: #48cae4; }
        .body-detail-card.nose-theme { background: #fffdf5; border-color: #fcbf49; }
        .body-detail-card.lung-theme { background: #fff0f1; border-color: #ef233c; }

        /* ----------------------------------------------------
           Aba 3: Novo Laboratório de Escolhas do Guardião
           ---------------------------------------------------- */
        .choices-wrapper {
          display: flex;
          flex-direction: column;
          gap: 25px;
          animation: popIn 0.3s ease-out;
        }

        /* Seletor de Cenários Ecológicos */
        .scenario-selector-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          width: 100%;
        }

        @media (max-width: 850px) {
          .scenario-selector-bar {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .scenario-btn {
          background: #fff;
          border: 2px solid #dee2e6;
          border-radius: 16px;
          padding: 12px 10px;
          font-size: 15px;
          font-weight: 800;
          color: #495057;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 0 #dee2e6;
        }

        .scenario-btn:hover {
          border-color: #52b788;
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #d8f3dc;
          color: #2d6a4f;
        }

        .scenario-btn.active {
          background: #2d6a4f;
          color: #fff;
          border-color: #1b4332;
          box-shadow: 0 4px 0 #1b4332;
          transform: translateY(2px);
        }

        /* Layout Divivido em 2 Colunas */
        .choices-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: start;
        }

        @media (max-width: 850px) {
          .choices-split {
            grid-template-columns: 1fr;
          }
        }

        /* Painel Esquerdo: Opções */
        .choices-options-box {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .choice-card-btn {
          background: #fff;
          border: 3px solid #dee2e6;
          border-radius: 20px;
          padding: 20px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 5px 0 #dee2e6;
          display: flex;
          gap: 18px;
          align-items: flex-start;
          outline: none;
        }

        .choice-card-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 15px rgba(0,0,0,0.04);
        }

        .choice-card-btn.active-eco {
          background: #f4fbf7;
          border-color: #52b788;
          box-shadow: 0 5px 0 #2d6a4f;
        }

        .choice-card-btn.active-polluter {
          background: #fff3f3;
          border-color: #ef233c;
          box-shadow: 0 5px 0 #c90822;
        }

        .choice-icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
          border: 2px solid #dee2e6;
        }

        .choice-card-btn.active-eco .choice-icon-circle {
          background: #d8f3dc;
          border-color: #52b788;
        }

        .choice-card-btn.active-polluter .choice-icon-circle {
          background: #ffccd5;
          border-color: #ef233c;
        }

        .choice-title {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 6px 0;
          color: #212529;
        }

        .choice-card-btn.active-eco .choice-title { color: #1b4332; }
        .choice-card-btn.active-polluter .choice-title { color: #ef233c; }

        .choice-desc {
          font-size: 13px;
          color: #6c757d;
          line-height: 1.45;
          margin: 0;
        }

        .choice-card-btn.active-eco .choice-desc { color: #40916c; }
        .choice-card-btn.active-polluter .choice-desc { color: #5f0f40; }

        /* Painel Direito: Monitoramento do Impacto */
        .choices-monitor-box {
          background: #f8f9fa;
          border-radius: 24px;
          padding: 24px;
          border: 3px solid #e9ecef;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        /* Simulador Visual de Atmosfera */
        .sky-simulation-box {
          height: 140px;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 3px solid #fff;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.06);
          transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .sky-simulation-box.eco-sky {
          background: linear-gradient(180deg, #d8f3dc 0%, #b7e4c7 100%);
        }

        .sky-simulation-box.polluted-sky {
          background: linear-gradient(180deg, #3d3a3a 0%, #7d7575 100%);
        }

        .sky-elements {
          font-size: 40px;
          animation: skyBounce 3s infinite ease-in-out;
          z-index: 2;
        }

        @keyframes skyBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .sky-fog-layer {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.1);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .sky-simulation-box.polluted-sky .sky-fog-layer {
          opacity: 1;
        }

        /* Medidor de Poluição HUD */
        .choices-hud-card {
          background: #fff;
          border-radius: 16px;
          padding: 12px 18px;
          border: 2px solid #e9ecef;
          box-shadow: 0 4px 0 #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Barra de Progresso de Poluição */
        .pollution-hud-bar {
          background: #e9ecef;
          border-radius: 50px;
          height: 20px;
          width: 100%;
          overflow: hidden;
          border: 2px solid #dee2e6;
          position: relative;
        }

        .pollution-hud-fill {
          height: 100%;
          border-radius: 50px;
          transition: width 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), background-color 0.6s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 11px;
        }

        /* Balão do Curupira */
        .choices-curupira-balloon {
          background: #fff;
          border-radius: 18px;
          padding: 15px 18px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
          border-left: 6px solid #2d6a4f;
          text-align: left;
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .choices-curupira-balloon.bad-mood {
          border-left-color: #ef233c;
        }

        .choices-curupira-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #ffeedd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          border: 2px solid #fcbf49;
          flex-shrink: 0;
          animation: avatarPulse 2s infinite ease-in-out;
        }

        .choices-curupira-balloon.bad-mood .choices-curupira-avatar {
          background: #fff0f1;
          border-color: #ef233c;
        }

        .choices-curupira-text {
          font-size: 13.5px;
          color: #2b2d42;
          line-height: 1.45;
          margin: 0;
        }

        @keyframes popIn {
          0% { transform: scale(0.96); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Conteúdo Envelopado e Centralizado */}
      <div className="info-content-wrapper">
        <h2 style={{ color: '#2d6a4f', fontSize: 36, textAlign: 'center', marginBottom: 5 }}>
          Protetores da Natureza 🍃
        </h2>
        <p style={{ color: '#52b788', fontSize: 18, textAlign: 'center', margin: '0 0 35px 0', fontWeight: 'bold' }}>
          Descubra como a fumaça afeta nosso corpo e saiba como fazer as melhores escolhas ecológicas!
        </p>

        {/* Menu de Abas */}
        <nav className="info-tabs">
          <button 
            onClick={() => setActiveTab('info')} 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          >
            <CloudFog size={22} />
            O que é a Fumaça?
          </button>
          <button 
            onClick={() => setActiveTab('body')} 
            className={`tab-btn ${activeTab === 'body' ? 'active' : ''}`}
          >
            <HeartPulse size={22} />
            Efeitos no Corpo 🫁
          </button>
          <button 
            onClick={() => setActiveTab('simulator')} 
            className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
          >
            <Trees size={22} />
            Escolhas do Guardião 🌟
          </button>
        </nav>

        {/* Cartão de Conteúdo Principal */}
        <div className="info-card-main">

          {/* ABA 1: O MISTÉRIO DA FUMAÇA */}
          {activeTab === 'info' && (
            <div className="mystery-grid" style={{ animation: 'popIn 0.3s ease-out' }}>
              <div className="compare-box clean">
                <div className="compare-header" style={{ color: '#40916c' }}>
                  <span>🍃</span> Ar Limpo e Fresco
                </div>
                <p style={{ color: '#2d6a4f', fontSize: 16, lineHeight: 1.5, textAlign: 'left', margin: '0 0 15px 0' }}>
                  O ar puro é composto por gases invisíveis e saudáveis, principalmente o <strong>oxigênio</strong>. Ele é limpo, leve e dá energia para a gente brincar e correr!
                </p>
                <div className="particles-list">
                  <div className="particle-item" style={{ borderColor: '#d8f3dc' }}>
                    <span style={{ fontSize: 24 }}>💨</span>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ color: '#1b4332' }}>Oxigênio Puro</strong>
                      <p style={{ margin: 0, fontSize: 13, color: '#555' }}>Alimenta nossas células e cérebro.</p>
                    </div>
                  </div>
                  <div className="particle-item" style={{ borderColor: '#d8f3dc' }}>
                    <span style={{ fontSize: 24 }}>💧</span>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ color: '#1b4332' }}>Umidade Boa</strong>
                      <p style={{ margin: 0, fontSize: 13, color: '#555' }}>Mantém nossa respiração confortável.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="compare-box smoky">
                <div className="compare-header" style={{ color: '#e63946' }}>
                  <span>🌫️</span> O que é a Fumaça?
                </div>
                <p style={{ color: '#495057', fontSize: 16, lineHeight: 1.5, textAlign: 'left', margin: '0 0 15px 0' }}>
                  A fumaça é uma mistura de gases perigosos com pequenas "monstrinhos" sólidos chamados <strong>fuligem</strong> e <strong>cinzas</strong>. Ela é gerada pelo fogo.
                </p>
                <div className="particles-list">
                  <div className="particle-item" style={{ borderColor: '#ffccd5' }}>
                    <span style={{ fontSize: 24 }}>⚫</span>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ color: '#c90822' }}>Micropartículas (Fuligem)</strong>
                      <p style={{ margin: 0, fontSize: 13, color: '#555' }}>Pó preto microscópico que irrita as vias respiratórias.</p>
                    </div>
                  </div>
                  <div className="particle-item" style={{ borderColor: '#ffccd5' }}>
                    <span style={{ fontSize: 24 }}>⚠️</span>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ color: '#c90822' }}>Gases Tóxicos</strong>
                      <p style={{ margin: 0, fontSize: 13, color: '#555' }}>Monóxido de carbono que rouba nosso fôlego.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: DETETIVE DO CORPO */}
          {activeTab === 'body' && (
            <div className="body-container" style={{ animation: 'popIn 0.3s ease-out' }}>
              <div className="body-visual">
                <h3 style={{ fontSize: 18, color: '#2d6a4f', margin: '0 0 10px 0', textAlign: 'center' }}>Selecione um Órgão:</h3>
                <button 
                  onClick={() => setSelectedBodyPart('olhos')} 
                  className={`body-btn ${selectedBodyPart === 'olhos' ? 'active eye-color' : ''}`}
                >
                  <Eye size={20} />
                  Os Olhos 👀
                </button>
                <button 
                  onClick={() => setSelectedBodyPart('nariz')} 
                  className={`body-btn ${selectedBodyPart === 'nariz' ? 'active nose-color' : ''}`}
                >
                  <span>👃</span>
                  O Nariz
                </button>
                <button 
                  onClick={() => setSelectedBodyPart('pulmoes')} 
                  className={`body-btn ${selectedBodyPart === 'pulmoes' ? 'active lung-color' : ''}`}
                >
                  <Activity size={20} />
                  Os Pulmões 🫁
                </button>
              </div>

              {selectedBodyPart === 'olhos' && (
                <div className="body-detail-card eye-theme">
                  <h4 style={{ color: '#0077b6', fontSize: 22, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    👁️ Como a fumaça afeta os Olhos?
                  </h4>
                  <p style={{ fontSize: 16, color: '#005f73', lineHeight: 1.5, margin: 0 }}>
                    A fuligem e os gases irritantes no ar agem como pequenas pedrinhas invisíveis. 
                    Quando encostam nos olhos, o corpo tenta nos proteger gerando lágrimas para lavar a sujeira. 
                    Isso deixa os olhos <strong>vermelhos</strong>, <strong>ardendo</strong> e <strong>lacrimejando</strong>.
                  </p>
                  <div style={{ marginTop: 15, background: '#fff', padding: '10px 15px', borderRadius: 12, border: '2px solid #90e0ef', fontSize: 14, color: '#0077b6', fontWeight: 'bold' }}>
                    💡 Dica do Protetor: Lave o rosto e os olhos com água limpa e fresca se sentir ardência!
                  </div>
                </div>
              )}

              {selectedBodyPart === 'nariz' && (
                <div className="body-detail-card nose-theme">
                  <h4 style={{ color: '#e36414', fontSize: 22, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    👃 Como a fumaça afeta o Nariz?
                  </h4>
                  <p style={{ fontSize: 16, color: '#5f0f40', lineHeight: 1.5, margin: 0 }}>
                    O nariz é nossa primeira linha de defesa! Ele tem pelos e muco que servem como uma rede protetora para prender a poeira. 
                    Mas a fumaça das queimadas tem tanta fuligem fina que entope essa defesa, fazendo o nariz coçar, <strong>escorrer</strong> ou ficar entupido, nos obrigando a <strong>espirrar</strong> bastante!
                  </p>
                  <div style={{ marginTop: 15, background: '#fff', padding: '10px 15px', borderRadius: 12, border: '2px solid #fcbf49', fontSize: 14, color: '#e36414', fontWeight: 'bold' }}>
                    💡 Dica do Protetor: Assoar o nariz delicadamente ajuda a retirar a fuligem que ficou presa!
                  </div>
                </div>
              )}

              {selectedBodyPart === 'pulmoes' && (
                <div className="body-detail-card lung-theme">
                  <h4 style={{ color: '#ef233c', fontSize: 22, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    🫁 Como a fumaça afeta os Pulmões?
                  </h4>
                  <p style={{ fontSize: 16, color: '#2d0004', lineHeight: 1.5, margin: 0 }}>
                    Os pulmões absorvem o oxigênio necessário para o nosso corpo. 
                    Quando respiramos fumaça, a fuligem bloqueia a passagem do oxigênio para o sangue. 
                    Isso irrita as vias respiratórias e o corpo reage com a <strong>tosse</strong> para tentar expelir a sujeira. 
                    Respirar fumaça nos deixa cansados e causa falta de ar!
                  </p>
                  <div style={{ marginTop: 15, background: '#fff', padding: '10px 15px', borderRadius: 12, border: '2px solid #ffccd5', fontSize: 14, color: '#ef233c', fontWeight: 'bold' }}>
                    💡 Dica do Protetor: Fique dentro de casa com portas e janelas fechadas em dias de muita fumaça!
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA 3: LABORATÓRIO DE ESCOLHAS DO GUARDIÃO (INTERATIVO) */}
          {activeTab === 'simulator' && (
            <div className="choices-wrapper">
              
              {/* Barra Superior de Seleção de Cenários */}
              <div className="scenario-selector-bar">
                {SCENARIOS.map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => setActiveScenarioId(sc.id)}
                    className={`scenario-btn ${activeScenarioId === sc.id ? 'active' : ''}`}
                  >
                    <span>{sc.icon}</span>
                    {sc.title}
                  </button>
                ))}
              </div>

              {/* Corpo Interativo do Laboratório */}
              <div className="choices-split">
                
                {/* Lado Esquerdo: Cards de Escolha */}
                <div className="choices-options-box">
                  <h3 style={{ fontSize: 20, color: '#2d6a4f', margin: '0 0 5px 0', textAlign: 'left' }}>
                    Escolha uma Ação:
                  </h3>
                  <p style={{ fontSize: 14, color: '#6c757d', margin: '0 0 10px 0', textAlign: 'left' }}>
                    Compare o impacto ambiental de cada decisão no cotidiano.
                  </p>

                  {currentScenario.choices.map((choice, idx) => {
                    const isActive = activeChoiceIndex === idx;
                    let activeClass = '';
                    if (isActive) {
                      activeClass = choice.isEco ? 'active-eco' : 'active-polluter';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectChoice(idx)}
                        className={`choice-card-btn ${activeClass}`}
                      >
                        <div className="choice-icon-circle">
                          {choice.emoji}
                        </div>
                        <div>
                          <h4 className="choice-title">{choice.label}</h4>
                          <p className="choice-desc">{choice.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Lado Direito: HUD e Painel de Monitoramento Atmosférico */}
                <div className="choices-monitor-box">
                  <h3 style={{ fontSize: 18, color: '#2d6a4f', margin: 0, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
                    📊 Monitor de Impacto
                  </h3>

                  {/* Simulador Visual do Céu */}
                  <div className={`sky-simulation-box ${currentChoice.isEco ? 'eco-sky' : 'polluted-sky'}`}>
                    <div className="sky-fog-layer" />
                    <div className="sky-elements">
                      {currentChoice.isEco ? '☀️🕊️🍃' : '🌫️🏭😷'}
                    </div>
                    <span style={{ 
                      color: currentChoice.isEco ? '#1b4332' : '#ffffff', 
                      fontSize: 14, 
                      fontWeight: 'bold', 
                      marginTop: 8,
                      zIndex: 2,
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      Simulação do Céu
                    </span>
                  </div>

                  {/* HUD Informativo */}
                  <div className="choices-hud-card">
                    <span style={{ fontSize: 13, color: '#6c757d', fontWeight: 'bold' }}>ESTADO DO AR</span>
                    <strong style={{ 
                      fontSize: 16, 
                      color: currentChoice.isEco ? '#2d6a4f' : '#ef233c' 
                    }}>
                      {currentChoice.statusLabel}
                    </strong>
                  </div>

                  {/* Barra de Nível de Poluição */}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>
                      <span>Índice de Emissão de Fumaça:</span>
                      <span style={{ color: currentChoice.isEco ? '#2d6a4f' : '#ef233c' }}>
                        {currentChoice.pollutionLevel}%
                      </span>
                    </div>
                    <div className="pollution-hud-bar">
                      <div 
                        className="pollution-hud-fill"
                        style={{ 
                          width: `${currentChoice.pollutionLevel}%`, 
                          backgroundColor: currentChoice.isEco ? '#52b788' : '#ef233c' 
                        }}
                      >
                        {currentChoice.pollutionLevel > 0 ? 'MONÓXIDO / FULIGEM' : 'AR 100% LIMPO'}
                      </div>
                    </div>
                  </div>

                  {/* Feedback e Opinião do Curupira */}
                  <div className={`choices-curupira-balloon ${!currentChoice.isEco ? 'bad-mood' : ''}`}>
                    <div className="choices-curupira-avatar">
                      {currentChoice.curupiraAvatar}
                    </div>
                    <div>
                      <span style={{ 
                        fontSize: 13, 
                        fontWeight: 'bold', 
                        color: currentChoice.isEco ? '#2d6a4f' : '#ef233c', 
                        display: 'block', 
                        marginBottom: 2 
                      }}>
                        {currentChoice.curupiraMood}
                      </span>
                      <p className="choices-curupira-text">{currentChoice.curupiraComment}</p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
