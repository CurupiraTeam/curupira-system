import { useState, useEffect, useRef } from 'react';
import { 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Award, 
  ShieldAlert 
} from 'lucide-react';
import { QUESTIONS_POOL, type Question } from './questions';

// Função auxiliar para selecionar 5 perguntas aleatórias do banco de dados
const selectRandomQuestions = (): Question[] => {
  const shuffled = [...QUESTIONS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};

export default function QuizCurupira() {
  // Inicialização das 5 questões ativas de forma síncrona
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() => selectRandomQuestions());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [streak, setStreak] = useState(0);

  // Referência para focar automaticamente o botão de avançar
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Efeito para focar o botão "Avançar" ou "Ver Resultado" assim que o usuário responder
  useEffect(() => {
    if (hasAnswered && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [hasAnswered]);

  const handleAnswer = (optionIdx: number, isCorrect: boolean) => {
    if (hasAnswered) return;
    
    setSelectedOption(optionIdx);
    setHasAnswered(true);

    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(st => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setHasAnswered(false);

    if (currentQuestion + 1 < activeQuestions.length) {
      setCurrentQuestion(c => c + 1);
    } else {
      setShowResult(true);
    }
  };

  // Replay mantendo exatamente as mesmas 5 perguntas para o usuário aprender com os erros
  const replaySameGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setShowResult(false);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  // Inicia um jogo completamente novo, sorteando outras 5 perguntas da piscina de 15
  const startNewGame = () => {
    setActiveQuestions(selectRandomQuestions());
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setShowResult(false);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  // Configuração dos Resultados
  const getBadgeDetails = (finalScore: number) => {
    if (finalScore === activeQuestions.length) {
      return {
        title: 'Guardião Lendário da Floresta! 👑🦊✨',
        desc: 'Incrível! Você acertou tudo e demonstrou ter o conhecimento de um verdadeiro herói da Amazônia. O Curupira está extremamente orgulhoso da sua dedicação!',
        color: '#2d6a4f',
        bgColor: '#d8f3dc',
        icon: '👑'
      };
    } else if (finalScore >= 3) {
      return {
        title: 'Protetor da Natureza! 🛡️🐆🍃',
        desc: 'Excelente desempenho! Você demonstrou uma ótima base de consciência ambiental. Que tal tentar mais uma vez para obter a medalha máxima do Curupira?',
        color: '#f77f00',
        bgColor: '#ffeedd',
        icon: '🛡️'
      };
    } else {
      return {
        title: 'Aprendiz de Protetor! 🌱🦊',
        desc: 'Bom começo! Revisar as curiosidades da floresta vai te ajudar a dominar essas informações. Tente novamente o mesmo desafio para melhorar seu placar!',
        color: '#ef233c',
        bgColor: '#fff0f1',
        icon: '🌱'
      };
    }
  };

  const badge = getBadgeDetails(score);

  if (activeQuestions.length === 0) return null;

  return (
    <div className="quiz-container">
      <style>{`
        .quiz-container {
          background: #fff;
          border-radius: 28px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          max-width: 800px;
          margin: 0 auto;
          font-family: 'Comic Sans MS', 'Chalkboard SE', 'Barlow', sans-serif;
          border: 4px solid #fff;
          box-sizing: border-box;
          user-select: none;
        }

        /* Mapa de Trilha da Floresta */
        .forest-path {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 35px;
          position: relative;
          padding: 0 20px;
        }

        .path-line {
          position: absolute;
          top: 50%;
          left: 40px;
          right: 40px;
          height: 6px;
          background: #e9ecef;
          z-index: 1;
          transform: translateY(-50%);
        }

        .path-line-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #f77f00;
          z-index: 1;
          transition: width 0.4s ease;
        }

        .path-node {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #fff;
          border: 4px solid #dee2e6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          color: #adb5bd;
          position: relative;
          z-index: 2;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .path-node.active {
          border-color: #f77f00;
          color: #f77f00;
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(247, 127, 0, 0.4);
          animation: pulseNode 1.5s infinite ease-in-out;
        }

        .path-node.completed {
          background: #52b788;
          border-color: #2d6a4f;
          color: #fff;
        }

        @keyframes pulseNode {
          0%, 100% { transform: scale(1.2); }
          50% { transform: scale(1.28); }
        }

        /* Pergunta HUD */
        .question-card {
          background: #fff8f2;
          border: 3px dashed #fcbf49;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 25px;
          box-shadow: inset 0 0 10px rgba(252,191,73,0.05);
          animation: popQuestion 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        @keyframes popQuestion {
          0% { transform: translateY(15px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .question-title {
          font-size: 22px;
          color: #d66d00;
          margin: 0;
          line-height: 1.45;
          text-align: left;
        }

        /* Opções de Respostas */
        .options-list {
          display: grid;
          gap: 15px;
          margin-bottom: 25px;
        }

        .option-button {
          background: #fff;
          border: 3px solid #dee2e6;
          padding: 18px 22px;
          border-radius: 18px;
          font-size: 18px;
          font-weight: bold;
          color: #495057;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 5px 0 #dee2e6;
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          outline: none;
        }

        .option-button:hover:not(:disabled) {
          border-color: #f77f00;
          transform: translateY(-2px);
          box-shadow: 0 7px 0 #ffeedd;
          color: #d66d00;
        }

        .option-button:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: 0 3px 0 #dee2e6;
        }
        
        .option-button:focus-visible:not(:disabled) {
          border-color: #f77f00;
          box-shadow: 0 0 0 4px rgba(247, 127, 0, 0.3);
        }

        /* Classes de Feedback */
        .option-button.correct {
          background: #d8f3dc !important;
          border-color: #52b788 !important;
          color: #1b4332 !important;
          box-shadow: 0 4px 0 #2d6a4f !important;
          transform: translateY(2px);
        }

        .option-button.wrong {
          background: #fff0f1 !important;
          border-color: #ef233c !important;
          color: #2d0004 !important;
          box-shadow: 0 4px 0 #c90822 !important;
          transform: translateY(2px);
        }

        .option-button.dimmed {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* Balão do Curupira (Explicação) */
        .explanation-box {
          background: #fdfcfa;
          border: 3px solid #e9ecef;
          border-radius: 22px;
          padding: 22px;
          display: flex;
          gap: 20px;
          align-items: center;
          text-align: left;
          box-shadow: 0 8px 16px rgba(0,0,0,0.04);
          animation: slideUp 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          margin-bottom: 25px;
        }

        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .curupira-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ffeedd;
          border: 3px solid #fcbf49;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          flex-shrink: 0;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }

        .explanation-text {
          font-size: 15px;
          line-height: 1.5;
          color: #495057;
          margin: 0;
        }

        /* Botão Avançar */
        .btn-next {
          background: #f77f00;
          color: #fff;
          border: 3px solid #d66d00;
          padding: 16px 45px;
          font-size: 20px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 6px 0 #d66d00;
          transition: all 0.1s;
          outline: none;
        }

        .btn-next:hover {
          background: #ff911c;
          transform: translateY(-2px);
          box-shadow: 0 8px 0 #d66d00;
        }

        .btn-next:active {
          transform: translateY(3px);
          box-shadow: 0 3px 0 #d66d00;
        }

        .btn-next:focus-visible {
          box-shadow: 0 0 0 4px rgba(247, 127, 0, 0.4);
        }

        /* Painel de Resultados */
        .result-panel {
          border-radius: 24px;
          padding: 35px;
          border: 3px solid #fff;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          animation: popResult 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popResult {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .medal-show {
          font-size: 80px;
          margin-bottom: 15px;
          animation: medalFloat 2s infinite ease-in-out;
        }

        @keyframes medalFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Título do Quiz com Combo Streak */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HelpCircle size={32} color="#f77f00" />
          <h2 style={{ color: '#f77f00', margin: 0, fontSize: 32 }}>Quiz do Curupira</h2>
        </div>
        {streak >= 2 && (
          <div style={{
            background: '#ffccd5', border: '2px solid #ef233c', color: '#c90822',
            padding: '6px 15px', borderRadius: 50, fontWeight: 'bold', fontSize: 15,
            display: 'flex', alignItems: 'center', gap: 6, animation: 'pulseNode 1s infinite'
          }}>
            <Sparkles size={16} fill="#ef233c"/> Combo x{streak}! 🔥
          </div>
        )}
      </div>

      {showResult ? (
        /* TELA DE RESULTADOS */
        <div className="result-panel" style={{ background: badge.bgColor, borderColor: badge.color }}>
          <div className="medal-show">{badge.icon}</div>
          <h3 style={{ fontSize: 30, color: badge.color, margin: '0 0 15px 0' }}>
            {badge.title}
          </h3>
          <p style={{ fontSize: 17, color: '#444', lineHeight: 1.5, margin: '0 0 25px 0', padding: '0 20px' }}>
            {badge.desc}
          </p>

          {/* Placar Analítico */}
          <div style={{
            background: '#fff', border: `3px solid ${badge.color}`, borderRadius: 20,
            padding: '20px 30px', display: 'flex', justifyContent: 'space-around',
            marginBottom: 35, boxShadow: '0 6px 0 rgba(0,0,0,0.05)'
          }}>
            <div>
              <span style={{ fontSize: 13, color: '#888', fontWeight: 'bold', display: 'block' }}>PONTUAÇÃO</span>
              <strong style={{ fontSize: 28, color: badge.color }}>{score * 20} pts</strong>
            </div>
            <div style={{ width: 2, background: '#e9ecef' }} />
            <div>
              <span style={{ fontSize: 13, color: '#888', fontWeight: 'bold', display: 'block' }}>ACERTOS</span>
              <strong style={{ fontSize: 28, color: badge.color }}>{score} / {activeQuestions.length}</strong>
            </div>
          </div>

          {/* Botões Inteligentes de Replay */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 15, flexWrap: 'wrap' }}>
            {score < activeQuestions.length ? (
              <>
                <button onClick={replaySameGame} style={{
                  background: '#2d6a4f', color: '#fff', border: 'none', padding: '16px 30px', fontSize: 18,
                  borderRadius: 50, cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: 10,
                  boxShadow: `0 6px 0 #1b4332`
                }}>
                  <RotateCcw size={20} /> Corrigir Erros (Mesmas Perguntas)
                </button>
                <button onClick={startNewGame} style={{
                  background: '#f77f00', color: '#fff', border: 'none', padding: '16px 30px', fontSize: 18,
                  borderRadius: 50, cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: 10,
                  boxShadow: `0 6px 0 #d66d00`
                }}>
                  <Sparkles size={20} /> Novos Desafios (Aleatório)
                </button>
              </>
            ) : (
              <button onClick={startNewGame} style={{
                background: '#2d6a4f', color: '#fff', border: 'none', padding: '16px 45px', fontSize: 20,
                borderRadius: 50, cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: 10,
                boxShadow: `0 6px 0 #1b4332`
              }}>
                <Sparkles size={22} /> Novo Desafio Aleatório
              </button>
            )}
          </div>
        </div>
      ) : (
        /* QUESTÕES DO QUIZ */
        <div>
          {/* Trilha do Protetor */}
          <div className="forest-path">
            <div className="path-line">
              <div 
                className="path-line-fill" 
                style={{ width: `${(currentQuestion / (activeQuestions.length - 1)) * 100}%` }} 
              />
            </div>
            {activeQuestions.map((q, index) => {
              let nodeClass = 'path-node';
              if (index === currentQuestion) nodeClass += ' active';
              else if (index < currentQuestion) nodeClass += ' completed';
              
              return (
                <div key={q.id} className={nodeClass}>
                  {index < currentQuestion ? '✓' : index + 1}
                </div>
              );
            })}
          </div>

          {/* Cartão de Pergunta */}
          <div className="question-card">
            <h3 className="question-title">
              {activeQuestions[currentQuestion].question}
            </h3>
          </div>

          {/* Opções de Respostas */}
          <div className="options-list">
            {activeQuestions[currentQuestion].options.map((option, idx) => {
              let optClass = 'option-button';
              if (hasAnswered) {
                if (option.isCorrect) optClass += ' correct';
                else if (selectedOption === idx) optClass += ' wrong';
                else optClass += ' dimmed';
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleAnswer(idx, option.isCorrect)}
                  className={optClass}
                >
                  <span>{option.text}</span>
                  {hasAnswered && option.isCorrect && <CheckCircle2 size={24} color="#2d6a4f"/>}
                  {hasAnswered && selectedOption === idx && !option.isCorrect && <XCircle size={24} color="#ef233c"/>}
                </button>
              );
            })}
          </div>

          {/* Explicação do Curupira + Botão com Auto-Foco */}
          {hasAnswered && (
            <div>
              <div className="explanation-box">
                <div className="curupira-badge">
                  {activeQuestions[currentQuestion].options[selectedOption!].isCorrect ? '🦊' : '💡'}
                </div>
                <div>
                  <strong style={{ 
                    color: activeQuestions[currentQuestion].options[selectedOption!].isCorrect ? '#2d6a4f' : '#f77f00',
                    fontSize: 16, display: 'block', marginBottom: 4 
                  }}>
                    {activeQuestions[currentQuestion].options[selectedOption!].isCorrect ? 'Excelente!' : 'Curiosidade Protetora:'}
                  </strong>
                  <p className="explanation-text">
                    {activeQuestions[currentQuestion].explanation}
                  </p>
                </div>
              </div>

              {/* Botão Avançar - Recebe foco programático no DOM */}
              <button 
                ref={nextButtonRef}
                onClick={handleNext} 
                className="btn-next"
                tabIndex={0}
              >
                {currentQuestion + 1 === activeQuestions.length ? 'Ver Resultado' : 'Próxima Pergunta'}
                <ArrowRight size={22} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
