import { useState, useEffect } from 'react';
import { Flame, RotateCcw, Volume2, VolumeX } from 'lucide-react';

export default function ApagueOFogo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [fires, setFires] = useState<{ id: number; x: number; y: number }[]>([]);
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [lostBySpread, setLostBySpread] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  type Tree = { id: number; icon: string; left: number; top: number; size: number; zIndex: number; hue: number; bright: number };
  type Animal = { id: number; icon: string; top: number; duration: number; direction: string; hop: string; size: number };

  const generateMap = () => {
    const floraIcons = ['🌳'];
    const newTrees: Tree[] = Array.from({ length: 32 }).map((_, i) => {
      const col = i % 8;
      const row = Math.floor(i / 8);
      const cellWidth = 100 / 8;
      const cellHeight = 100 / 4;

      return {
        id: i,
        icon: floraIcons[Math.floor(Math.random() * floraIcons.length)],
        left: (col * cellWidth) + (Math.random() * (cellWidth * 0.55)),
        top: (row * cellHeight) + (Math.random() * (cellHeight * 0.45)),
        size: Math.floor(Math.random() * 25) + 50,
        zIndex: 2,
        hue: Math.floor(Math.random() * 60) - 30,
        bright: (Math.floor(Math.random() * 30) + 85) / 100,
      };
    });

    const animalIcons = ['🐆', '🐒', '🦥', '🦜', '🐍', '🐊', '🐿️'];
    const newAnimals: Animal[] = Array.from({ length: 6 }).map((_, i) => {
      const isLeft = Math.random() > 0.5;
      return {
        id: i,
        icon: animalIcons[Math.floor(Math.random() * animalIcons.length)],
        top: Math.floor(Math.random() * 65) + 15,
        duration: Math.floor(Math.random() * 12) + 10,
        direction: isLeft ? 'runLeft' : 'runRight',
        hop: isLeft ? 'hopLeft' : 'hopRight',
        size: Math.floor(Math.random() * 12) + 32,
      };
    });
    return { trees: newTrees, animals: newAnimals };
  };

  const [mapElements, setMapElements] = useState(generateMap());

  const playSound = (type: 'splash' | 'win' | 'lose') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'splash') {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'win') {
        const notes = [261.6, 329.6, 392.0, 523.3];
        notes.forEach((freq, index) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);
          noteGain.gain.setValueAtTime(0.1, ctx.currentTime + index * 0.1);
          noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.25);
          noteOsc.start(ctx.currentTime + index * 0.1);
          noteOsc.stop(ctx.currentTime + index * 0.1 + 0.25);
        });
      } else if (type === 'lose') {
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      console.warn('Audio Context block', e);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setFires([]);
    setSplashes([]);
    setGameOver(false);
    setLostBySpread(false);
    setMapElements(generateMap());
    setIsPlaying(true);
  };

  // Loop principal do Jogo: roda apenas uma vez quando isPlaying se torna verdadeiro!
  // Isso evita recriações constantes de intervalos e resolve o bug do tempo e dos fogos pulando.
  useEffect(() => {
    if (!isPlaying) return;

    // 1. Decrementador de Tempo
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Gerador de Fogos
    const spawner = setInterval(() => {
      setFires(prevFires => {
        if (prevFires.length >= 10) {
          clearInterval(timer);
          clearInterval(spawner);
          setIsPlaying(false);
          setGameOver(true);
          setLostBySpread(true);
          setTimeLeft(0);
          return prevFires;
        }

        const newFire = {
          id: Date.now() + Math.random(), // ID 100% único que evita conflitos de chaves React
          x: Math.floor(Math.random() * 88) + 6,
          y: Math.floor(Math.random() * 78) + 11,
        };
        return [...prevFires, newFire];
      });
    }, 850);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [isPlaying]);

  // Efeitos Sonoros de Fim de Jogo Reativos
  useEffect(() => {
    if (gameOver) {
      if (score >= 15 && !lostBySpread) {
        playSound('win');
      } else {
        playSound('lose');
      }
    }
  }, [gameOver]);

  const handleExtinguish = (id: number, x: number, y: number) => {
    setFires(prev => prev.filter(f => f.id !== id));
    setScore(s => s + 1);
    playSound('splash');

    const splashId = Date.now();
    setSplashes(prev => [...prev, { id: splashId, x, y }]);
    setTimeout(() => {
      setSplashes(prev => prev.filter(s => s.id !== splashId));
    }, 500);
  };

  return (
    <div className="fire-game-wrapper" style={{ animation: 'slideUp 0.3s ease-out' }}>
      
      {/* Cabeçalho do Minijogo */}
      <div className="game-hud-top">
        <div style={{ padding: '0 60px', width: '100%', boxSizing: 'border-box' }}>
          <h2 style={{ color: '#ef233c', margin: '0 0 4px 0', fontSize: 30, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            🔥 Apague o Fogo!
          </h2>
          <p style={{ fontSize: 15, color: '#555', margin: 0 }}>
            Seja rápido! Use sua mangueira de água para conter as chamas antes que 10 fogos se acumulem ao mesmo tempo!
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

      {/* Indicadores de Placar */}
      <div className="score-board-row">
        <div className="score-badge score-points">
          <span style={{ fontSize: 18 }}>💧</span>
          <span>Focos Apagados: <strong>{score} / 15</strong></span>
        </div>
        
        <div className={`score-badge score-timer ${timeLeft <= 5 ? 'timer-urgente' : ''}`}>
          <span style={{ fontSize: 18 }}>⏱️</span>
          <span>Tempo Restante: <strong>{timeLeft}s</strong></span>
        </div>
      </div>

      {/* Arena de Combate GIGANTE */}
      <div className="fire-arena-container">
        
        {/* Tela de Menu e Fim de Jogo */}
        {!isPlaying && (
          <div className={`game-overlay-screen ${gameOver ? (score >= 15 && !lostBySpread ? 'victory-bg' : 'defeat-bg') : 'start-bg'}`}>
            {!gameOver ? (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 70, display: 'block', marginBottom: 15, animation: 'pulseFlame 1.5s infinite' }}>🚒</span>
                <button onClick={startGame} className="btn-start-action">
                  Começar Missão! 🚀
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', maxWidth: 500, padding: 20 }}>
                {score >= 15 && !lostBySpread ? (
                  <>
                    <span style={{ fontSize: 60, display: 'block', marginBottom: 10 }}>🏆🌟</span>
                    <h3 style={{ fontSize: 32, color: '#1b4332', margin: '0 0 10px 0', fontWeight: 800 }}>Você Venceu! 🎉</h3>
                    <p style={{ fontSize: 16, color: '#2d6a4f', margin: '0 0 25px 0', lineHeight: 1.5 }}>
                      Fantástico! Você demonstrou reflexos rápidos ao extinguir <strong>{score}</strong> focos de incêndio e protegeu com sucesso os animais da floresta amazônica! 🌳💚
                    </p>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 60, display: 'block', marginBottom: 10 }}>🍂😢</span>
                    <h3 style={{ fontSize: 32, color: '#780000', margin: '0 0 10px 0', fontWeight: 800 }}>Mata Ameaçada! 😭</h3>
                    <p style={{ fontSize: 16, color: '#c1121f', margin: '0 0 25px 0', lineHeight: 1.5 }}>
                      {lostBySpread
                        ? "O fogo se alastrou rápido demais por falta de combate! Mais de 10 focos se juntaram de uma vez na floresta."
                        : `Você extinguiu apenas ${score} focos. Precisávamos de pelo menos 15 para salvar a reserva nacional.`}
                    </p>
                  </>
                )}

                <button onClick={startGame} className={`btn-replay-action ${(score >= 15 && !lostBySpread) ? 'replay-win' : 'replay-lose'}`}>
                  <RotateCcw size={20} /> Jogar Novamente
                </button>
              </div>
            )}
          </div>
        )}

        {/* Fauna correndo (Atrás das árvores) */}
        {mapElements.animals.map(animal => (
          <div 
            key={animal.id} 
            style={{ 
              position: 'absolute', 
              top: `${animal.top}%`, 
              animation: `${animal.direction} ${animal.duration}s linear infinite`, 
              zIndex: 1 
            }}
          >
            <div style={{ fontSize: animal.size, animation: `${animal.hop} 0.35s infinite alternate` }}>
              {animal.icon}
            </div>
          </div>
        ))}

        {/* Árvores de Fundo (32 unidades distribuídas) */}
        {mapElements.trees.map(tree => (
          <div key={tree.id} style={{
            position: 'absolute', 
            left: `${tree.left}%`, 
            top: `${tree.top}%`,
            fontSize: tree.size, 
            zIndex: tree.zIndex,
            filter: `hue-rotate(${tree.hue}deg) brightness(${tree.bright})`,
            pointerEvents: 'none'
          }}>
            {tree.icon}
          </div>
        ))}

        {/* Focos de Fogo */}
        {isPlaying && fires.map(fire => (
          <div
            key={fire.id}
            onMouseDown={() => handleExtinguish(fire.id, fire.x, fire.y)}
            className="fire-sprite-node"
            style={{
              left: `${fire.x}%`,
              top: `${fire.y}%`,
            }}
          >
            <Flame size={75} color="#ef233c" fill="#ffb703" style={{ animation: 'growFire 4.5s forwards' }} />
          </div>
        ))}

        {/* Gotas de Água (+1) */}
        {splashes.map(splash => (
          <div key={splash.id} style={{
            position: 'absolute', 
            left: `${splash.x}%`, 
            top: `${splash.y}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 11,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            animation: 'splashAnim 0.5s ease-out forwards'
          }}>
            <span style={{ fontSize: 52 }}>💦</span>
            <span style={{ fontSize: 26, fontWeight: 'bold', color: '#fff', textShadow: '0 2px 5px rgba(0,0,0,0.5)', marginTop: -10 }}>+1</span>
          </div>
        ))}

        {/* Foguinho Decorativo do Menu */}
        {!isPlaying && !gameOver && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 90, opacity: 0.15, animation: 'pulseFlame 2s infinite' }}>🔥</span>
          </div>
        )}
      </div>

      <style>{`
        .fire-game-wrapper {
          background: #ffffff;
          border-radius: 28px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          width: 100%;
          box-sizing: border-box;
        }

        .game-hud-top {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 18px;
          margin-bottom: 20px;
          text-align: center;
        }

        .sound-toggle-btn {
          position: absolute;
          right: 0;
          top: 0;
          background: #f8f9fa;
          border: 2px solid #dee2e6;
          color: #495057;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 3px 0 #dee2e6;
        }

        .sound-toggle-btn:hover {
          background: #e9ecef;
          transform: translateY(-2px);
          box-shadow: 0 5px 0 #dee2e6;
        }

        .sound-toggle-btn:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 #dee2e6;
        }

        /* Indicadores de Status */
        .score-board-row {
          display: flex;
          justify-content: center;
          gap: 25px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .score-badge {
          background: #f1fbf7;
          border: 2px solid #d8f3dc;
          padding: 10px 28px;
          border-radius: 50px;
          font-size: 19px;
          font-weight: bold;
          color: #2d6a4f;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 0 #d8f3dc;
        }

        .score-timer {
          background: #fdf2f2;
          border-color: #ffd6d6;
          color: #c1121f;
          box-shadow: 0 4px 0 #ffd6d6;
        }

        .timer-urgente {
          animation: pulseRed 0.8s infinite alternate;
        }

        @keyframes pulseRed {
          0% { border-color: #ffd6d6; box-shadow: 0 4px 0 #ffd6d6; }
          100% { border-color: #ef233c; box-shadow: 0 4px 10px rgba(239, 35, 60, 0.3); background-color: #ffeef0; }
        }

        /* Arena de Jogo */
        .fire-arena-container {
          position: relative;
          width: 100%;
          height: 480px;
          margin: 0 auto;
          background: linear-gradient(135deg, #b7e4c7 0%, #95d5b2 100%);
          border-radius: 24px;
          overflow: hidden;
          user-select: none;
          border: 6px solid #52b788;
          box-shadow: inset 0 0 30px rgba(27, 67, 50, 0.15);
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' style='font-size:26px;'><text y='50%'>💧</text></svg>") 16 16, auto;
        }

        /* Sprite do Fogo */
        .fire-sprite-node {
          position: absolute;
          transform: translate(-50%, -80%);
          cursor: inherit;
          z-index: 10;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* Overlays */
        .game-overlay-screen {
          position: absolute;
          inset: 0;
          z-index: 15;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: popIn 0.4s ease-out;
        }

        .start-bg { background: rgba(255, 255, 255, 0.82); }
        .victory-bg { background: rgba(216, 243, 220, 0.95); border: 4px solid #52b788; border-radius: 18px; margin: 10px; }
        .defeat-bg { background: rgba(255, 228, 230, 0.95); border: 4px solid #ef233c; border-radius: 18px; margin: 10px; }

        .btn-start-action {
          background: #48cae4;
          color: #fff;
          border: none;
          padding: 16px 48px;
          font-size: 24px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 800;
          box-shadow: 0 6px 0 #00b4d8;
          transition: all 0.15s;
        }

        .btn-start-action:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 0 #00b4d8;
          background: #00b4d8;
        }

        .btn-start-action:active {
          transform: translateY(3px);
          box-shadow: 0 3px 0 #00b4d8;
        }

        .btn-replay-action {
          color: #fff;
          border: none;
          padding: 14px 36px;
          font-size: 18px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.15s;
        }

        .replay-win {
          background: #52b788;
          box-shadow: 0 5px 0 #2d6a4f;
        }
        .replay-win:hover {
          background: #2d6a4f;
          transform: translateY(-2px);
          box-shadow: 0 7px 0 #1b4332;
        }

        .replay-lose {
          background: #ef233c;
          box-shadow: 0 5px 0 #9b0b1a;
        }
        .replay-lose:hover {
          background: #d90429;
          transform: translateY(-2px);
          box-shadow: 0 7px 0 #780000;
        }

        .btn-replay-action:active {
          transform: translateY(3px);
          box-shadow: 0 2px 0 rgba(0,0,0,0.15);
        }

        /* Animações */
        @keyframes popIn {
          0% { transform: translate(-50%, -80%) scale(0.15); opacity: 0; }
          100% { transform: translate(-50%, -80%) scale(1); opacity: 1; }
        }
        
        @keyframes growFire {
          0% { transform: scale(0.7); }
          100% { transform: scale(1.35); }
        }

        @keyframes pulseFlame {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }

        @keyframes splashAnim {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -90%) scale(1.25); opacity: 0; }
        }

        @keyframes runRight {
          0% { left: -15%; }
          100% { left: 115%; }
        }

        @keyframes runLeft {
          0% { left: 115%; }
          100% { left: -15%; }
        }

        @keyframes hopRight {
          0% { transform: translateY(0) scaleX(-1); }
          100% { transform: translateY(-16px) scaleX(-1); }
        }

        @keyframes hopLeft {
          0% { transform: translateY(0) scaleX(1); }
          100% { transform: translateY(-16px) scaleX(1); }
        }

        @keyframes slideUp {
          0% { transform: translateY(15px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
