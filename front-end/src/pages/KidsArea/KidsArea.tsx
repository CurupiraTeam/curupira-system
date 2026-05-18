import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Flame, HeartHandshake, HelpCircle } from 'lucide-react';

import InfoPanels from './InfoPanels';
import ApagueOFogo from './games/ApagueOFogo';
import SalveOsAnimais from './games/SalveOsAnimais';
import QuizCurupira from './games/QuizCurupira';

function KidsHome() {
  return (
    <div style={{ textAlign: 'center', width: '100%', zIndex: 1, position: 'relative' }}>
      {/* Banner Principal Hero - Expandido e Estilizado */}
      <div className="kids-hero-banner">
        <div className="hero-content">
          <div className="hero-badge">🦊 PORTAL EDUCATIVO</div>
          <h2>Bem-vindo à Floresta do Curupira!</h2>
          <p>
            Explore o portal interativo, encare os desafios práticos de preservação ambiental e torne-se um verdadeiro guardião da nossa fauna e flora!
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-icon">🌳</span>
              <span><strong>100%</strong> Interativo</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🛡️</span>
              <span><strong>Missão:</strong> Preservar a Natureza</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grade de Cartões / Jogos - Muito mais larga, espaçosa e sem bugs de overlap */}
      <div className="kids-grid">

        <Link to="info" className="kids-card info-card">
          <div className="icon-wrapper bg-blue"><BookOpen size={36} color="#fff" /></div>
          <div className="card-badge bg-blue-pill">📖 Sabedoria</div>
          <h3>O que é a fumaça?</h3>
          <p>Descubra como o ar fica poluído e aprenda a blindar sua respiração de forma prática.</p>
          <span className="card-btn">Explorar Painel</span>
        </Link>

        <Link to="apague-o-fogo" className="kids-card fire-card">
          <div className="icon-wrapper bg-red"><Flame size={36} color="#fff" /></div>
          <div className="card-badge bg-red-pill">🎮 Ação</div>
          <h3>Apague o Fogo</h3>
          <p>Seja ágil e utilize água para combater os focos de incêndio antes que destruam a mata!</p>
          <span className="card-btn">Jogar Agora</span>
        </Link>

        <Link to="salve-os-animais" className="kids-card animal-card">
          <div className="icon-wrapper bg-green"><HeartHandshake size={36} color="#fff" /></div>
          <div className="card-badge bg-green-pill">🧠 Memória</div>
          <h3>Jogo da Memória</h3>
          <p>Encontre os pares corretos e resgate os animais da floresta que estão em perigo.</p>
          <span className="card-btn">Iniciar Jogo</span>
        </Link>

        <Link to="quiz" className="kids-card quiz-card">
          <div className="icon-wrapper bg-orange"><HelpCircle size={36} color="#fff" /></div>
          <div className="card-badge bg-orange-pill">🏆 Desafio</div>
          <h3>Quiz do Curupira</h3>
          <p>Responda às curiosidades ecológicas e prove ser um guardião florestal oficial.</p>
          <span className="card-btn">Responder Quiz</span>
        </Link>

      </div>
    </div>
  );
}

export default function KidsArea() {
  const location = useLocation();
  const isHome = location.pathname === '/kids' || location.pathname === '/kids/';

  return (
    <>
      <style>{`
        /* Plano de Fundo Premium - Cores de natureza rica e gradiente aberto */
        .kids-bg {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f0faf4 0%, #d3efe0 100%);
          font-family: 'Barlow', 'Comic Sans MS', 'Chalkboard SE', sans-serif;
          padding: 30px 40px; /* Mais espaço nas laterais */
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          min-height: 100vh;
        }

        /* ----------------------------------------------------
           VEGETAÇÃO DE FUNDO DETALHADA E MAIS PRESENTE (SVGs)
           ---------------------------------------------------- */
        .bg-foliage-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .corner-foliage {
          position: absolute;
          pointer-events: none;
        }

        /* Ramo Superior Esquerdo - Pendurado */
        .corner-foliage.top-left {
          top: -20px;
          left: -20px;
          width: 320px;
          height: 320px;
          transform-origin: top left;
          animation: swayBranch 10s infinite ease-in-out;
        }

        /* Ramo Superior Direito - Pendurado */
        .corner-foliage.top-right {
          top: -20px;
          right: -20px;
          width: 320px;
          height: 320px;
          transform-origin: top right;
          animation: swayBranchRight 12s infinite ease-in-out;
        }

        /* Plantas Tropicais Inferior Direita - Folhas de Costela-de-Adão */
        .corner-foliage.bottom-right {
          bottom: -30px;
          right: -30px;
          width: 360px;
          height: 360px;
          transform-origin: bottom right;
          animation: swayFern 14s infinite ease-in-out;
        }

        /* Plantas Tropicais Inferior Esquerda */
        .corner-foliage.bottom-left {
          bottom: -30px;
          left: -30px;
          width: 340px;
          height: 340px;
          transform-origin: bottom left;
          animation: swayFernLeft 13s infinite ease-in-out;
        }

        /* Animações de Balanço Suave da Vegetação */
        @keyframes swayBranch {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(3deg) scale(1.01); }
        }
        @keyframes swayBranchRight {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-3deg) scale(1.01); }
        }
        @keyframes swayFern {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-2.5deg) scale(1.02); }
        }
        @keyframes swayFernLeft {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(2.5deg) scale(1.02); }
        }

        /* Partículas de folhas mais visíveis e dinâmicas */
        .leaf-particle {
          position: absolute;
          font-size: 26px;
          opacity: 0.18; /* Mais presente que antes */
          animation: floatLeaf 16s infinite ease-in-out;
          pointer-events: none;
        }
        
        .leaf-1 { left: 12%; top: 25%; animation-duration: 16s; }
        .leaf-2 { right: 14%; top: 22%; animation-duration: 22s; animation-delay: 2s; }
        .leaf-3 { left: 16%; bottom: 20%; animation-duration: 26s; animation-delay: 4s; }
        .leaf-4 { right: 15%; bottom: 25%; animation-duration: 20s; animation-delay: 1s; }
        .leaf-5 { left: 45%; top: 15%; animation-duration: 18s; animation-delay: 3s; }
        .leaf-6 { right: 45%; bottom: 12%; animation-duration: 24s; animation-delay: 5s; }

        @keyframes floatLeaf {
          0%, 100% { transform: translateY(0) rotate(0deg) translateX(0); }
          50% { transform: translateY(-40px) rotate(180deg) translateX(20px); }
        }

        /* ----------------------------------------------------
           ELEMENTOS DO SISTEMA E CABEÇALHO
           ---------------------------------------------------- */
        .kids-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 30px;
          background: rgba(45, 106, 79, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(45, 106, 79, 0.12);
          z-index: 2;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        .kids-btn-back {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          color: #2d6a4f;
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 13px;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        .kids-btn-back:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(45, 106, 79, 0.25);
          background: #2d6a4f;
          color: #ffffff;
        }

        /* Banner Hero - Largo e Esticado para as laterais */
        .kids-hero-banner {
          background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
          border-radius: 28px;
          padding: 45px 50px;
          box-shadow: 0 12px 35px rgba(27, 67, 50, 0.12);
          margin-bottom: 35px;
          color: #ffffff;
          text-align: left;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          box-sizing: border-box;
        }

        .kids-hero-banner::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -10%;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(82,183,136,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 18px;
        }

        .kids-hero-banner h2 {
          font-size: 34px;
          margin: 0 0 12px 0;
          font-weight: 800;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .kids-hero-banner p {
          font-size: 18px;
          line-height: 1.6;
          color: #d8f3dc;
          max-width: 900px;
          margin: 0 0 25px 0;
        }

        .hero-stats {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 14px;
        }

        .stat-icon {
          font-size: 18px;
        }

        /* ----------------------------------------------------
           GRADE DE CARTÕES - AMPLA E DETALHADA
           ---------------------------------------------------- */
        .kids-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px; /* Mais espaço entre os cartões */
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 40px;
        }

        /* Cartões de Aventura Premium (Sem Bugs de Overlap) */
        .kids-card {
          background: #ffffff;
          border-radius: 28px;
          padding: 30px 25px;
          text-align: center;
          transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #2d6a4f;
          text-decoration: none;
          position: relative;
          box-shadow: 0 10px 30px rgba(27, 67, 50, 0.04);
          box-sizing: border-box;
        }

        .kids-card:hover {
          transform: translateY(-10px);
        }

        /* Ícones circulares */
        .icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease;
          margin-bottom: 12px; /* Espaço para o badge */
        }

        .kids-card:hover .icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .bg-blue { background: #48cae4; box-shadow: 0 6px 18px rgba(72, 202, 228, 0.25); }
        .bg-red { background: #ef233c; box-shadow: 0 6px 18px rgba(239, 35, 60, 0.25); }
        .bg-green { background: #2a9d8f; box-shadow: 0 6px 18px rgba(42, 157, 143, 0.25); }
        .bg-orange { background: #f77f00; box-shadow: 0 6px 18px rgba(247, 127, 0, 0.25); }

        /* Badge reposicionado no fluxo da div (Resolve o bug de overlap) */
        .card-badge {
          display: inline-block;
          padding: 5px 14px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 800;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 15px; /* Espaço até o título */
          box-shadow: 0 3px 6px rgba(0,0,0,0.05);
        }
        
        .bg-blue-pill { background: #48cae4; }
        .bg-red-pill { background: #ef233c; }
        .bg-green-pill { background: #2a9d8f; }
        .bg-orange-pill { background: #f77f00; }

        .kids-card h3 {
          font-size: 23px;
          font-weight: 800;
          margin: 0 0 12px 0;
          color: #1b4332;
        }

        .kids-card p {
          font-size: 15px;
          color: #666;
          line-height: 1.5;
          margin: 0 0 25px 0;
          flex-grow: 1;
        }

        /* Botão simulado dentro do cartão */
        .card-btn {
          font-weight: 700;
          font-size: 14px;
          padding: 8px 24px;
          border-radius: 50px;
          transition: all 0.3s;
          background: #f4fbf7;
          border: 1.5px solid #d8f3dc;
          color: #2d6a4f;
        }

        /* Efeitos temáticos individuais no Hover */
        .info-card:hover {
          border-color: #48cae4;
          box-shadow: 0 20px 40px rgba(72, 202, 228, 0.18);
        }
        .info-card:hover .card-btn {
          background: #48cae4;
          border-color: #48cae4;
          color: #fff;
        }

        .fire-card:hover {
          border-color: #ef233c;
          box-shadow: 0 20px 40px rgba(239, 35, 60, 0.18);
        }
        .fire-card:hover .card-btn {
          background: #ef233c;
          border-color: #ef233c;
          color: #fff;
        }

        .animal-card:hover {
          border-color: #2a9d8f;
          box-shadow: 0 20px 40px rgba(42, 157, 143, 0.18);
        }
        .animal-card:hover .card-btn {
          background: #2a9d8f;
          border-color: #2a9d8f;
          color: #fff;
        }

        .quiz-card:hover {
          border-color: #f77f00;
          box-shadow: 0 20px 40px rgba(247, 127, 0, 0.18);
        }
        .quiz-card:hover .card-btn {
          background: #f77f00;
          border-color: #f77f00;
          color: #fff;
        }
      `}</style>
      
      <div className="kids-bg">
        {/* Camada de Vegetação Amazônica Detalhada nas Bordas do Viewport (SVG) */}
        <div className="bg-foliage-layer">
          
          {/* Superior Esquerdo - Ramo Suspenso */}
          <svg className="corner-foliage top-left" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 Q90,50 160,20 T300,10" stroke="#2d6a4f" strokeWidth="4" opacity="0.18"/>
            <path d="M40,20 Q65,45 55,75 Q30,65 40,20 Z" fill="#40916c" opacity="0.22"/>
            <path d="M90,25 Q120,55 105,85 Q80,75 90,25 Z" fill="#2d6a4f" opacity="0.25"/>
            <path d="M150,22 Q185,48 170,78 Q145,70 150,22 Z" fill="#40916c" opacity="0.22"/>
            <path d="M210,18 Q240,40 225,70 Q200,65 210,18 Z" fill="#2d6a4f" opacity="0.25"/>
            <path d="M260,12 Q285,30 275,55 Q255,50 260,12 Z" fill="#40916c" opacity="0.22"/>
            
            <path d="M0,0 Q50,90 20,180" stroke="#2d6a4f" strokeWidth="3" opacity="0.18"/>
            <path d="M25,45 Q50,65 40,95 Q15,85 25,45 Z" fill="#40916c" opacity="0.22"/>
            <path d="M28,105 Q52,125 45,155 Q20,145 28,105 Z" fill="#2d6a4f" opacity="0.25"/>
          </svg>

          {/* Superior Direito - Ramo Suspenso */}
          <svg className="corner-foliage top-right" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M300,0 Q210,50 140,20 T0,10" stroke="#2d6a4f" strokeWidth="4" opacity="0.18"/>
            <path d="M260,20 Q235,45 245,75 Q270,65 260,20 Z" fill="#40916c" opacity="0.22"/>
            <path d="M210,25 Q180,55 195,85 Q220,75 210,25 Z" fill="#2d6a4f" opacity="0.25"/>
            <path d="M150,22 Q115,48 130,78 Q155,70 150,22 Z" fill="#40916c" opacity="0.22"/>
          </svg>

          {/* Inferior Direito - Costelas de Adão e Arbusto Tropical */}
          <svg className="corner-foliage bottom-right" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Folha Monstera 1 */}
            <path d="M360,360 Q240,300 180,210 Q150,165 165,120 Q195,120 225,150 Q240,120 270,142 Q285,165 285,195 Q315,172 337,195 Q345,225 322,255 Q352,247 360,360 Z" fill="#2d6a4f" opacity="0.2"/>
            {/* Folha Monstera 2 */}
            <path d="M360,360 Q290,260 250,170 C240,185 270,225 300,240 Z" fill="#40916c" opacity="0.18"/>
            {/* Ramo de Folhas Finas */}
            <path d="M360,360 Q225,240 120,270" stroke="#40916c" strokeWidth="5" opacity="0.18"/>
            <path d="M270,270 Q225,225 195,195 C180,210 210,255 270,270 Z" fill="#40916c" opacity="0.2"/>
            <path d="M210,288 Q165,247 135,217 C120,232 150,277 210,288 Z" fill="#2d6a4f" opacity="0.22"/>
          </svg>

          {/* Inferior Esquerdo - Arbusto Tropical */}
          <svg className="corner-foliage bottom-left" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,340 Q120,300 180,210 Q210,165 195,120 Q165,120 135,150 Q120,120 90,142 Q75,165 75,195 Q45,172 23,195 Q15,225 38,255 Q8,247 0,340 Z" fill="#2d6a4f" opacity="0.2"/>
            <path d="M0,340 Q70,260 110,170 C120,185 90,225 60,240 Z" fill="#40916c" opacity="0.18"/>
          </svg>

          {/* Folhas Voando de Fundo */}
          <div className="leaf-particle leaf-1">🍃</div>
          <div className="leaf-particle leaf-2">🍁</div>
          <div className="leaf-particle leaf-3">🍃</div>
          <div className="leaf-particle leaf-4">🌿</div>
          <div className="leaf-particle leaf-5">🍀</div>
          <div className="leaf-particle leaf-6">🍂</div>
        </div>

        {/* Container Principal Expandido (maxWidth 1500px para ocupar a tela e acabar com o vazio exagerado) */}
        <div style={{ maxWidth: 1500, width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1 }}>

          {/* Cabeçalho Premium Glassmorphism */}
          <header className="kids-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '28px', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.15))' }}>🦊</span>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '24px', fontWeight: 800, letterSpacing: '0.5px' }}>
                Curupira Kids
              </h1>
            </div>
            <Link to={isHome ? '/' : '/kids'} className="kids-btn-back">
              <ArrowLeft size={18} />
              {isHome ? 'Voltar ao Monitoramento' : 'Voltar ao Menu'}
            </Link>
          </header>

          {/* Páginas do Roteador */}
          <Routes>
            <Route path="/" element={<KidsHome />} />
            <Route path="/info" element={<InfoPanels />} />
            <Route path="/apague-o-fogo" element={<ApagueOFogo />} />
            <Route path="/salve-os-animais" element={<SalveOsAnimais />} />
            <Route path="/quiz" element={<QuizCurupira />} />
          </Routes>

        </div>
      </div>
    </>
  );
}
