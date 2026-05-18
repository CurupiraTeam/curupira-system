import { useState, useEffect } from 'react';
import { Play, RotateCcw, Heart, ShieldAlert, Sparkles, Volume2, VolumeX } from 'lucide-react';

type CardType = 'good' | 'bad';

interface Card {
  id: number;
  emoji: string;
  type: CardType;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const GOOD_PAIRS = [
  { emoji: '🐆', name: 'Onça-Pintada' },
  { emoji: '🐒', name: 'Macaco-Prego' },
  { emoji: '🦥', name: 'Bicho-Preguiça' },
  { emoji: '🦜', name: 'Arara-Canindé' },
  { emoji: '🐊', name: 'Jacaré-Açu' },
];

const BAD_PAIRS = [
  { emoji: '🔥', name: 'Queimada' },
  { emoji: '🗑️', name: 'Lixo Comercial' },
  { emoji: '🪓', name: 'Desmatamento' },
];

export default function SalveOsAnimais() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [matchedGoods, setMatchedGoods] = useState<string[]>([]);
  const [matchedBads, setMatchedBads] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = (type: 'flip' | 'match' | 'victory') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'flip') {
        // Clique rápido de madeira/papel
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'match') {
        // Nota mágica cintilante dupla
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'victory') {
        // Arpejo de vitória alegre ascendente
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          noteGain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
          noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.3);
          noteOsc.start(ctx.currentTime + idx * 0.08);
          noteOsc.stop(ctx.currentTime + idx * 0.08 + 0.3);
        });
      }
    } catch (e) {
      console.warn('Audio Context block', e);
    }
  };

  const initGame = () => {
    // Gerar os pares (10 cartas boas + 6 cartas ruins = 16 cartas total)
    const goodCards: Card[] = GOOD_PAIRS.flatMap((item, idx) => [
      { id: idx * 2, emoji: item.emoji, type: 'good', name: item.name, isFlipped: false, isMatched: false },
      { id: idx * 2 + 1, emoji: item.emoji, type: 'good', name: item.name, isFlipped: false, isMatched: false }
    ]);

    const badCards: Card[] = BAD_PAIRS.flatMap((item, idx) => [
      { id: 10 + idx * 2, emoji: item.emoji, type: 'bad', name: item.name, isFlipped: false, isMatched: false },
      { id: 10 + idx * 2 + 1, emoji: item.emoji, type: 'bad', name: item.name, isFlipped: false, isMatched: false }
    ]);

    const allCards = [...goodCards, ...badCards];

    // Embaralhar (Fisher-Yates)
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }

    setCards(allCards);
    setSelectedIndices([]);
    setMatchedGoods([]);
    setMatchedBads([]);
    setMoves(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const handleCardClick = (clickedIndex: number) => {
    if (!isPlaying || selectedIndices.length >= 2) return;
    if (cards[clickedIndex].isFlipped || cards[clickedIndex].isMatched) return;

    playSound('flip');

    // Virar a carta
    const updatedCards = [...cards];
    updatedCards[clickedIndex].isFlipped = true;
    setCards(updatedCards);

    const newSelection = [...selectedIndices, clickedIndex];
    setSelectedIndices(newSelection);

    if (newSelection.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newSelection;

      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        // Encontrou um par!
        setTimeout(() => {
          playSound('match');

          setCards(prevCards => {
            const finalCards = prevCards.map((c, idx) => {
              if (idx === firstIdx || idx === secondIdx) {
                return { ...c, isMatched: true };
              }
              return c;
            });

            // Verificar fim de jogo
            if (finalCards.every(c => c.isMatched)) {
              setGameOver(true);
              setIsPlaying(false);
              playSound('victory');
            }
            return finalCards;
          });

          // Mover para as áreas de destino
          const matchedEmoji = cards[firstIdx].emoji;
          if (cards[firstIdx].type === 'good') {
            setMatchedGoods(prev => [...prev, matchedEmoji]);
          } else {
            setMatchedBads(prev => [...prev, matchedEmoji]);
          }

          setSelectedIndices([]);
        }, 550);
      } else {
        // Não é um par, desvira após 1 segundo
        setTimeout(() => {
          setCards(prevCards => {
            const finalCards = [...prevCards];
            finalCards[firstIdx].isFlipped = false;
            finalCards[secondIdx].isFlipped = false;
            return finalCards;
          });
          setSelectedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="memory-game-wrapper" style={{ animation: 'slideUp 0.3s ease-out' }}>
      
      {/* Cabeçalho do Jogo com Grid Autocompensador */}
      <div className="game-hud-top">
        <div style={{ padding: '0 4.5rem', width: '100%', boxSizing: 'border-box' }}>
          <h2 style={{ color: '#2a9d8f', margin: '0 0 0.3rem 0', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            🧩 Jogo da Memória Ecológico
          </h2>
          <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', color: '#555', margin: 0 }}>
            Encontre os pares! Proteja a fauna da floresta amazônica e neutralize todas as ameaças ambientais!
          </p>
        </div>
        
        {/* Controle de Áudio */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)} 
          className="sound-toggle-btn"
          title={soundEnabled ? 'Desativar Som' : 'Ativar Som'}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Estatísticas com dimensões fluídas */}
      {isPlaying && (
        <div className="score-board-row">
          <div className="score-badge memory-badge-attempts">
            <span style={{ fontSize: '1.2rem' }}>🧠</span>
            <span>Tentativas: <strong>{moves}</strong></span>
          </div>
          <div className="score-badge memory-badge-saves">
            <span style={{ fontSize: '1.2rem' }}>🐾</span>
            <span>Espécies Salvas: <strong>{matchedGoods.length} / 5</strong></span>
          </div>
        </div>
      )}

      {/* Grid Responsivo Principal (Sem px rígidos!) */}
      <div className="memory-game-layout">

        {/* Painel Esquerdo: Animais Salvos */}
        <div className="side-panel panel-green">
          <h4 className="panel-title panel-title-green">
            <Heart size={18} fill="#2e7d32" /> Animais Salvos
          </h4>
          <div className="saved-items-grid">
            {matchedGoods.map((emoji, i) => (
              <div key={i} className="saved-avatar good-pop">
                {emoji}
              </div>
            ))}
            {matchedGoods.length === 0 && (
              <span className="panel-empty-text empty-green">Nenhum animal salvo ainda</span>
            )}
          </div>
        </div>

        {/* Tabuleiro Central (Fluído, escala naturalmente) */}
        <div className="board-center-panel">

          {/* Overlay Iniciar / Fim do Jogo */}
          {!isPlaying && (
            <div className={`game-overlay-screen ${gameOver ? 'victory-bg' : 'start-bg'}`}>
              {!gameOver ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1.2rem', animation: 'floatIcons 2s ease-in-out infinite' }}>🦊🐆🦜</div>
                  <button onClick={initGame} className="btn-start-action" style={{ background: '#2a9d8f', boxShadow: '0 0.4rem 0 #1e7066' }}>
                    Começar Missão! 🚀
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', maxWidth: '85%' }}>
                  <div style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '0.8rem' }}>🏆🌳🐾</div>
                  <h3 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: '#1b4332', margin: '0 0 0.6rem 0', fontWeight: 800 }}>Excelente Trabalho!</h3>
                  <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: '#2d6a4f', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                    Incrível! Você abrigou todos os animais silvestres na Reserva Protegida e neutralizou todas as queimadas e poluições em apenas <strong>{moves}</strong> tentativas! 🎉
                  </p>
                  <button onClick={initGame} className="btn-replay-action replay-win" style={{ background: '#2e7d32', boxShadow: '0 0.4rem 0 #1b5e20' }}>
                    <RotateCcw size={18} /> Jogar Novamente
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Grade de Cartas 100% Fluída */}
          <div className="cards-grid">
            {cards.map((card, idx) => {
              const showFace = card.isFlipped || card.isMatched;

              return (
                <div
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  className={`card-flip ${showFace ? 'flipped' : ''}`}
                  style={{
                    visibility: card.isMatched ? 'hidden' : 'visible',
                    pointerEvents: (card.isMatched || !isPlaying) ? 'none' : 'auto'
                  }}
                >
                  <div className="card-inner">
                    {/* Verso da Carta */}
                    <div className="card-back">
                      🌳
                    </div>
                    {/* Frente da Carta */}
                    <div className={`card-front ${card.type === 'good' ? 'front-good' : 'front-bad'}`}>
                      {card.emoji}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Painel Direito: Ameaças Neutralizadas */}
        <div className="side-panel panel-red">
          <h4 className="panel-title panel-title-red">
            <ShieldAlert size={18} fill="#c62828" /> Ameaças Neutralizadas
          </h4>
          <div className="saved-items-grid">
            {matchedBads.map((emoji, i) => (
              <div key={i} className="saved-avatar bad-pop">
                {emoji}
              </div>
            ))}
            {matchedBads.length === 0 && (
              <span className="panel-empty-text empty-red">Nenhum risco detectado</span>
            )}
          </div>
        </div>

      </div>

      <style>{`
        .memory-game-wrapper {
          background: #ffffff;
          border-radius: 2rem;
          padding: 2.2rem 3%;
          text-align: center;
          box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.03);
          width: 100%;
          box-sizing: border-box;
        }

        .game-hud-top {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 0.15rem solid #f0f0f0;
          padding-bottom: 1.2rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .sound-toggle-btn {
          position: absolute;
          right: 0;
          top: 0;
          background: #f8f9fa;
          border: 0.15rem solid #dee2e6;
          color: #495057;
          width: 2.8rem;
          height: 2.8rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 0.2rem 0 #dee2e6;
        }

        .sound-toggle-btn:hover {
          background: #e9ecef;
          transform: translateY(-0.15rem);
          box-shadow: 0 0.3rem 0 #dee2e6;
        }

        .sound-toggle-btn:active {
          transform: translateY(0.15rem);
          box-shadow: 0 0.05rem 0 #dee2e6;
        }

        /* Indicadores de Status Fluídos */
        .score-board-row {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1.8rem;
          flex-wrap: wrap;
        }

        .score-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 1.8rem;
          border-radius: 3rem;
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          font-weight: bold;
          box-shadow: 0 0.3rem 0 rgba(0,0,0,0.03);
        }

        .memory-badge-attempts {
          background: #f1fbf7;
          border: 0.15rem solid #d8f3dc;
          color: #1b4332;
        }

        .memory-badge-saves {
          background: #edf7f6;
          border: 0.15rem solid #c1ece8;
          color: #1e7066;
        }

        /* ----------------------------------------------------
           Layout Responsivo em Grid (Sem PX rígidos!)
           ---------------------------------------------------- */
        .memory-game-layout {
          display: grid;
          grid-template-columns: 1fr 1.6fr 1fr; /* Central tem 1.6x o tamanho das laterais */
          gap: 1.5rem;
          width: 100%;
          box-sizing: border-box;
          align-items: stretch;
        }

        /* Painéis Laterais Fluídos */
        .side-panel {
          border-radius: 1.5rem;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
        }

        .panel-green {
          background: #f1fbf7;
          border: 0.18rem solid #b7e4c7;
        }

        .panel-red {
          background: #fff8f8;
          border: 0.18rem solid #fecdd3;
        }

        .panel-title {
          margin: 0 0 1rem 0;
          font-size: clamp(1rem, 2.2vw, 1.25rem);
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .panel-title-green { color: #1b4332; }
        .panel-title-red { color: #9b0b1a; }

        .saved-items-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          justify-content: center;
          align-content: flex-start;
          width: 100%;
          flex-grow: 1;
        }

        .saved-avatar {
          font-size: clamp(1.8rem, 3.8vw, 2.5rem);
          background: #ffffff;
          border-radius: 50%;
          width: clamp(3rem, 6.5vw, 4.2rem);
          height: clamp(3rem, 6.5vw, 4.2rem);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.05);
          border: 0.15rem solid #e2e8f0;
        }

        .panel-empty-text {
          font-size: clamp(0.85rem, 1.8vw, 0.95rem);
          margin-top: 3.5rem;
          font-style: italic;
        }

        .empty-green { color: #74c69d; }
        .empty-red { color: #fda4af; }

        /* ----------------------------------------------------
           Tabuleiro Central Fluído
           ---------------------------------------------------- */
        .board-center-panel {
          position: relative;
          width: 100%;
          min-height: 25rem;
          background: #f8f9fa;
          border-radius: 1.5rem;
          border: 0.25rem solid #e9ecef;
          padding: 1.2rem;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Grade 4x4 Fluída de Cartas */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.8rem;
          width: 100%;
          aspect-ratio: 1 / 1;
        }

        /* Cartas 3D */
        .card-flip {
          perspective: 60rem;
          aspect-ratio: 1 / 1;
          width: 100%;
          cursor: pointer;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.2);
          transform-style: preserve-3d;
          box-shadow: 0 0.3rem 0.6rem rgba(0, 0, 0, 0.06);
          border-radius: 1rem;
        }

        .card-flip.flipped .card-inner {
          transform: rotateY(180deg);
        }

        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          box-sizing: border-box;
        }

        .card-back {
          background: radial-gradient(circle, #2a9d8f 0%, #1e7066 100%);
          border: 0.18rem solid #ffd166;
          color: #ffffff;
        }

        .card-front {
          transform: rotateY(180deg);
        }

        .front-good {
          background: #f1fbf7;
          border: 0.18rem solid #74c69d;
        }

        .front-bad {
          background: #fff5f5;
          border: 0.18rem solid #fecdd3;
        }

        /* Overlay do Menu */
        .game-overlay-screen {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          border-radius: 1.2rem;
          backdrop-filter: blur(0.2rem);
          -webkit-backdrop-filter: blur(0.2rem);
          animation: popIn 0.3s ease-out;
        }

        .start-bg { background: rgba(255, 255, 255, 0.85); }
        .victory-bg { background: rgba(241, 251, 247, 0.95); border: 0.25rem solid #74c69d; }

        .btn-start-action {
          color: #ffffff;
          border: none;
          padding: 1rem 3rem;
          font-size: clamp(1.1rem, 2.2vw, 1.4rem);
          border-radius: 3rem;
          cursor: pointer;
          font-weight: 800;
          transition: all 0.15s;
        }

        .btn-start-action:hover {
          transform: translateY(-0.2rem);
          opacity: 0.95;
        }

        .btn-start-action:active {
          transform: translateY(0.2rem);
        }

        .btn-replay-action {
          color: #ffffff;
          border: none;
          padding: 0.9rem 2.5rem;
          font-size: clamp(1rem, 2vw, 1.15rem);
          border-radius: 3rem;
          cursor: pointer;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          transition: all 0.15s;
        }

        .btn-replay-action:hover {
          transform: translateY(-0.15rem);
          opacity: 0.95;
        }

        .btn-replay-action:active {
          transform: translateY(0.15rem);
        }

        /* Animações e Keyframes */
        .good-pop {
          animation: goodPopEffect 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .bad-pop {
          animation: badPopEffect 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes goodPopEffect {
          0% { transform: scale(0) rotate(-15deg); }
          70% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes badPopEffect {
          0% { transform: scale(0) rotate(15deg); }
          70% { transform: scale(1.2) rotate(-10deg); }
          100% { transform: scale(1) rotate(0); }
        }

        @keyframes floatIcons {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.5rem); }
        }

        @keyframes popIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slideUp {
          0% { transform: translateY(1.5rem); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* ----------------------------------------------------
           Responsividade Fluída (Notebooks / Mobile)
           ---------------------------------------------------- */
        @media (max-width: 1024px) {
          .memory-game-layout {
            grid-template-columns: 1fr 1.3fr 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .memory-game-layout {
            grid-template-columns: 1fr; /* Colapsa em coluna única em tablets/celulares */
            gap: 1.2rem;
          }
          
          .side-panel {
            min-height: auto;
            padding: 1rem;
          }

          .panel-empty-text {
            margin-top: 1rem;
          }

          .board-center-panel {
            order: -1; /* Tabuleiro de cartas fica no topo em telas menores */
          }
        }
      `}</style>
    </div>
  );
}
