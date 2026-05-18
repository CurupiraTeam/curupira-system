import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
  Wind, Activity, AlertTriangle, ShieldCheck,
  Trees, MapPin, Radio, ChartLine, SlidersHorizontal, User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSocketUrl } from '../../services/api/endpoints';

const socket = io(getSocketUrl());

// ── Animated counter hook ─────────────────────────────────────────────────────
function useAnimatedNumber(target: number, duration = 600) {
  const [display, setDisplay] = useState(target);
  const rafRef   = useRef<number | undefined>(undefined);
  const startRef = useRef<number | null>(null);
  const fromRef  = useRef(target);

  useEffect(() => {
    fromRef.current  = display;
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(fromRef.current + (target - fromRef.current) * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target]);

  return display;
}

// ── AQI helpers ───────────────────────────────────────────────────────────────
function getAQ(v: number) {
  if (v < 50)  return { label: 'EXCELENTE', sub: 'Respire fundo!',           color: '#1d9e75', colorLight: '#5dcaa5' };
  if (v < 100) return { label: 'MODERADO',  sub: 'Atenção para sensíveis.',  color: '#ba7517', colorLight: '#ef9f27' };
  return            { label: 'CRÍTICO',   sub: 'Evite sair de casa!',       color: '#a32d2d', colorLight: '#e24b4a' };
}

function barColor(v: number) {
  if (v < 50)  return '#5dcaa5';
  if (v < 100) return '#ef9f27';
  return '#e24b4a';
}

const TICKER_MSGS = [
  'MONITORAMENTO ATIVO · SENSOR_01 · PONTA NEGRA, MANAUS',
  'PROJETO RESPIRA — DADOS AO VIVO DO ARDUINO',
  'DISTRITO INDUSTRIAL: RELATOS DE FUMAÇA AUMENTANDO',
  'AMAZON: QUALIDADE DO AR EM TEMPO REAL',
];

// ── Main component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [nivel,        setNivel]        = useState(42);
  const [timestamp,    setTimestamp]    = useState('--:--:--');
  const [conectado,    setConectado]    = useState(false);
  const [historico,    setHistorico]    = useState([42,38,55,61,48,72,80,65,58,44,50,42]);
  const [reportCount,  setReportCount]  = useState(14);
  const [reportFlash,  setReportFlash]  = useState(false);
  const [reportThanks, setReportThanks] = useState(false);
  const [tickerIdx,    setTickerIdx]    = useState(0);
  const [tickerVis,    setTickerVis]    = useState(true);
  const [clock,        setClock]        = useState('--:--:--');
  const [sliderVal,    setSliderVal]    = useState(42);
  const [mounted,      setMounted]      = useState(false);

  const animVal = useAnimatedNumber(nivel);
  const aq      = getAQ(nivel);
  const avg     = Math.round(historico.reduce((a, b) => a + b, 0) / historico.length);
  const pct     = Math.min(nivel / 200, 1);
  const gaugeOffset = 125.7 * (1 - pct); // semicircle path length ≈ 125.7

  // ── Socket.io ──────────────────────────────────────────────────────────────
  useEffect(() => {
    socket.on('connect',    () => setConectado(true));
    socket.on('disconnect', () => setConectado(false));
    socket.on('dados_arduino', (payload: { valor: string; timestamp: string }) => {
      const v = parseInt(payload.valor);
      setNivel(v);
      setSliderVal(v);
      setTimestamp(new Date(payload.timestamp).toLocaleTimeString('pt-BR'));
      setHistorico(prev => [...prev.slice(1), v]);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('dados_arduino');
    };
  }, []);

  // ── Clock ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setClock(new Date().toLocaleTimeString('pt-BR')), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Ticker cycle ───────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setTickerVis(false);
      setTimeout(() => { setTickerIdx(i => (i + 1) % TICKER_MSGS.length); setTickerVis(true); }, 300);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ── Demo drift — remove when your real socket is delivering data ───────────
  useEffect(() => {
    const id = setInterval(() => {
      setNivel(prev => {
        const next = Math.max(0, Math.min(200, prev + Math.floor(Math.random() * 11) - 5));
        setSliderVal(next);
        setHistorico(h => [...h.slice(1), next]);
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setMounted(true); }, []);

  // ── Report handler ─────────────────────────────────────────────────────────
  const handleReport = useCallback(() => {
    setReportCount(c => c + 1);
    setReportFlash(true);
    setReportThanks(true);
    setTimeout(() => setReportFlash(false), 300);
    setTimeout(() => setReportThanks(false), 1800);
  }, []);

  // ── Slider ─────────────────────────────────────────────────────────────────
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value);
    setSliderVal(v);
    setNivel(v);
    setHistorico(prev => [...prev.slice(1), v]);
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Barlow:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #07090d; color: #f0f2f5; font-family: 'Barlow', sans-serif; -webkit-font-smoothing: antialiased; }
        .bc  { font-family: 'Barlow Condensed', sans-serif; }

        @keyframes slideUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseRing  { 0%,100% { transform:scale(1); opacity:.6; } 50% { transform:scale(1.7); opacity:0; } }
        @keyframes barIn      { from { transform:scaleY(0); } to { transform:scaleY(1); } }
        @keyframes countPop   { 0% { transform:scale(1); } 50% { transform:scale(1.25); } 100% { transform:scale(1); } }

        .anim-up { animation: slideUp .5s ease both; }

        .card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: 16px;
          transition: transform .2s ease, border-color .2s ease;
        }
        .card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16); }

        .report-btn {
          width:100%; border:none; border-radius:10px; padding:11px;
          font-family:'Barlow Condensed',sans-serif; font-size:13px;
          font-weight:800; font-style:italic; letter-spacing:.15em;
          text-transform:uppercase; cursor:pointer; color:#07090d;
          transition: filter .15s, transform .15s, background .3s;
        }
        .report-btn:hover  { filter: brightness(1.1); }
        .report-btn:active { transform: scale(.97); }

        .slider-track {
          -webkit-appearance:none; appearance:none;
          height:4px; border-radius:99px;
          background:rgba(255,255,255,.12); outline:none; flex:1;
        }
        .slider-track::-webkit-slider-thumb {
          -webkit-appearance:none; width:16px; height:16px;
          border-radius:50%; background:#1d9e75; cursor:pointer;
          transition:transform .15s;
        }
        .slider-track:hover::-webkit-slider-thumb { transform:scale(1.2); }

        .bar-item {
          transform-origin:bottom;
          animation:barIn .45s cubic-bezier(.34,1.56,.64,1) both;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#07090d', color: '#f0f2f5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 32px' }}>

          {/* ── TICKER ──────────────────────────────────────────────────────── */}
          <div style={{
            background: '#0f6e56', borderRadius: '0 0 10px 10px',
            padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
          }}>
            <Radio size={12} color="#9fe1cb" />
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase',
              color: '#9fe1cb',
              opacity: tickerVis ? 1 : 0,
              transform: tickerVis ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity .3s, transform .3s',
            }}>
              {TICKER_MSGS[tickerIdx]}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: '#5dcaa5', fontFamily: 'monospace' }}>{clock}</span>
          </div>

          {/* ── HEADER ──────────────────────────────────────────────────────── */}
          <header className="anim-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${aq.color}22`, border: `0.5px solid ${aq.color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .4s, border-color .4s',
              }}>
                <Wind size={20} color={aq.color} />
              </div>
              <div>
                <h1 className="bc" style={{
                  fontSize: 20, fontWeight: 900, fontStyle: 'italic',
                  textTransform: 'uppercase', letterSpacing: '-.01em', lineHeight: 1, margin: 0,
                }}>
                  PROJETO RESPIRA <span style={{ color: aq.color }}>.</span>
                </h1>
                <p style={{ fontSize: 10, color: 'rgba(240,242,245,.45)', display: 'flex', alignItems: 'center', gap: 4, margin: '2px 0 0' }}>
                  <MapPin size={9} color="#d85a30" /> SENSOR_01 | PONTA NEGRA — MANAUS
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/kids" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f0f2f5', textDecoration: 'none', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', transition: 'background .3s' }}>
                <User size={14} /> Espaço Kids
              </Link>
              <span style={{ marginLeft: 10, position: 'relative', width: 8, height: 8, borderRadius: '50%', background: conectado ? '#1d9e75' : '#a32d2d', display: 'inline-block' }}>
                {conectado && (
                  <span style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: '#1d9e7444', animation: 'pulseRing 2s infinite' }} />
                )}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: conectado ? '#1d9e75' : '#a32d2d' }}>
                {conectado ? 'STREAM ATIVO' : 'OFFLINE'}
              </span>
            </div>
          </header>

          {/* ── TOP GRID ────────────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 14, marginBottom: 14 }}>

            {/* Hero AQI card */}
            <div className="card anim-up" style={{ padding: '24px 28px', position: 'relative', overflow: 'hidden', animationDelay: '.05s' }}>
              {/* Ambient glow */}
              <div style={{
                position: 'absolute', top: -60, right: -60,
                width: 220, height: 220, borderRadius: '50%',
                background: `radial-gradient(circle, ${aq.color}18 0%, transparent 70%)`,
                transition: 'background .6s', pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Activity size={13} color="rgba(240,242,245,.4)" />
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.22em', color: 'rgba(240,242,245,.4)', textTransform: 'uppercase' }}>
                    Qualidade do Ar Atual
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="bc" style={{ fontSize: 36, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1, color: aq.color, transition: 'color .4s' }}>
                    {aq.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(240,242,245,.5)', marginTop: 3 }}>{aq.sub}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 16 }}>
                <span className="bc" style={{ fontSize: 'clamp(72px,11vw,120px)', fontWeight: 900, fontStyle: 'italic', lineHeight: .9, letterSpacing: '-.04em', color: '#f0f2f5' }}>
                  {animVal}
                </span>
                <div style={{ marginBottom: 8 }}>
                  <div className="bc" style={{ fontSize: 22, fontWeight: 700, fontStyle: 'italic', color: aq.colorLight }}>AQI</div>
                  <div style={{ marginTop: 6, width: 160, height: 4, borderRadius: 99, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      width: `${Math.max(pct * 100, 2)}%`,
                      background: `linear-gradient(90deg,${aq.color},${aq.colorLight})`,
                      transition: 'width .7s cubic-bezier(.34,1.56,.64,1), background .4s',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'rgba(240,242,245,.3)', marginTop: 3, fontFamily: 'monospace' }}>
                    <span>0</span><span>BOM → CRÍTICO</span><span>200</span>
                  </div>
                </div>
              </div>

              {/* Bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 56 }}>
                {historico.map((v, i) => {
                  const h      = Math.max((v / Math.max(...historico, 1)) * 100, 6);
                  const isLast = i === historico.length - 1;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
                      {isLast && <span style={{ fontSize: 8, color: barColor(v), fontFamily: 'monospace', fontWeight: 700 }}>{v}</span>}
                      <div
                        className="bar-item"
                        style={{
                          width: '100%', height: `${h}%`,
                          borderRadius: '3px 3px 1px 1px',
                          background: isLast ? barColor(v) : `${barColor(v)}55`,
                          outline: isLast ? `1.5px solid ${barColor(v)}88` : 'none',
                          outlineOffset: 1,
                          animationDelay: `${i * .04}s`,
                          transformOrigin: 'bottom',
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  {([['#5dcaa5','Bom'],['#ef9f27','Moderado'],['#e24b4a','Crítico']] as const).map(([c,l]) => (
                    <span key={l} style={{ fontSize: 9, color: 'rgba(240,242,245,.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: 9, color: 'rgba(240,242,245,.3)', fontFamily: 'monospace' }}>
                  ⏱ {timestamp !== '--:--:--' ? timestamp : clock}
                </span>
              </div>
            </div>

            {/* Right stats column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="card anim-up" style={{ padding: '13px 15px', animationDelay: '.1s' }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.15em', color: 'rgba(240,242,245,.4)', textTransform: 'uppercase', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={10} color="#d85a30" /> Sensor
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>SENSOR_01</div>
                <div style={{ fontSize: 10, color: 'rgba(240,242,245,.45)' }}>Ponta Negra · AM</div>
              </div>

              <div className="card anim-up" style={{ padding: '13px 15px', animationDelay: '.14s' }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.15em', color: 'rgba(240,242,245,.4)', textTransform: 'uppercase', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ChartLine size={10} /> Última leitura
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, fontFamily: 'monospace' }}>{timestamp !== '--:--:--' ? timestamp : clock}</div>
                <div style={{ fontSize: 10, color: 'rgba(240,242,245,.45)' }}>Via Arduino Serial</div>
              </div>

              <div className="card anim-up" style={{ padding: '13px 15px', animationDelay: '.18s' }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.15em', color: 'rgba(240,242,245,.4)', textTransform: 'uppercase', marginBottom: 5 }}>
                  Média hoje
                </div>
                <div className="bc" style={{ fontSize: 22, fontWeight: 900, fontStyle: 'italic' }}>
                  {avg} <span style={{ fontSize: 11, fontWeight: 400, fontStyle: 'normal', color: 'rgba(240,242,245,.4)' }}>AQI</span>
                </div>
              </div>

              {/* SVG Gauge */}
              <div className="card anim-up" style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', animationDelay: '.22s', flex: 1 }}>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.15em', color: 'rgba(240,242,245,.4)', textTransform: 'uppercase', marginBottom: 6 }}>Nível</span>
                <svg viewBox="0 0 100 60" width="110" height="66" aria-hidden="true">
                  <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="7" strokeLinecap="round" />
                  <path
                    d="M10 50 A40 40 0 0 1 90 50" fill="none"
                    stroke={aq.color} strokeWidth="7" strokeLinecap="round"
                    strokeDasharray="125.7" strokeDashoffset={gaugeOffset}
                    style={{ transition: 'stroke-dashoffset .7s cubic-bezier(.34,1.56,.64,1), stroke .4s' }}
                  />
                  <text x="50" y="50" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f0f2f5"
                    fontFamily="'Barlow Condensed', sans-serif" fontStyle="italic">
                    {animVal}
                  </text>
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: 110, fontSize: 8, color: 'rgba(240,242,245,.3)', fontFamily: 'monospace', marginTop: -4 }}>
                  <span>0</span><span>200</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM GRID ──────────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>

            <div className="card anim-up" style={{ padding: '18px 20px', animationDelay: '.28s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <ShieldCheck size={18} color="#185fa5" />
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.12em', color: 'rgba(240,242,245,.4)', textTransform: 'uppercase' }}>Saúde</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: '#f0f2f5' }}>
                {nivel > 60
                  ? 'Evite atividades físicas ao ar livre. Índice de fumaça acima do ideal.'
                  : 'Condições ideais para atividades ao ar livre. Aproveite o clima na Ponta Negra!'}
              </p>
            </div>

            <div className="card anim-up" style={{ padding: '18px 20px', animationDelay: '.32s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Trees size={18} color="#3b6d11" />
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.12em', color: 'rgba(240,242,245,.4)', textTransform: 'uppercase' }}>Floresta</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: '#f0f2f5' }}>
                Visibilidade da copa em áreas de preservação:{' '}
                <strong style={{ color: nivel > 80 ? '#e24b4a' : nivel > 50 ? '#ef9f27' : '#3b6d11', transition: 'color .4s' }}>
                  {Math.round(100 - nivel / 2)}%
                </strong>
              </p>
            </div>

            <div className="card anim-up" style={{ padding: '18px 20px', animationDelay: '.36s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <AlertTriangle size={18} color="#ba7517" />
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.12em', color: 'rgba(240,242,245,.4)', textTransform: 'uppercase' }}>Crowdsource</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div className="bc" style={{
                  fontSize: 32, fontWeight: 900, fontStyle: 'italic', color: '#ba7517',
                  animation: reportFlash ? 'countPop .3s ease' : 'none',
                  transition: 'color .3s',
                }}>
                  {reportCount}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>relatos hoje</div>
                  <div style={{ fontSize: 10, color: 'rgba(240,242,245,.45)' }}>Distrito Industrial</div>
                </div>
              </div>
              <button
                className="report-btn"
                onClick={handleReport}
                style={{ background: reportThanks ? '#0f6e56' : aq.color }}
              >
                {reportThanks ? '✓  OBRIGADO!' : '⚡  REPORTAR FUMAÇA'}
              </button>
            </div>
          </div>

          {/* ── SIMULATOR ────────────────────────────────────────────────────── */}
          <div className="card anim-up" style={{ padding: '14px 18px', marginTop: 14, animationDelay: '.42s' }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(240,242,245,.4)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <SlidersHorizontal size={11} /> Simulador — arraste para testar sem o Arduino
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, color: 'rgba(240,242,245,.4)' }}>0</span>
              <input
                type="range" min="0" max="200" step="1"
                value={sliderVal}
                onChange={handleSlider}
                className="slider-track"
              />
              <span style={{ fontSize: 11, color: 'rgba(240,242,245,.4)' }}>200</span>
              <span style={{ fontSize: 12, fontWeight: 500, minWidth: 56, textAlign: 'right', fontFamily: 'monospace', color: aq.color }}>
                {sliderVal} AQI
              </span>
            </div>
          </div>

          {/* ── FOOTER ────────────────────────────────────────────────────────── */}
          <footer style={{ marginTop: 20, textAlign: 'center', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(240,242,245,.2)', fontFamily: 'monospace' }}>
            PROJETO RESPIRA © 2025 — MANAUS, AMAZONAS — DADOS VIA SENSOR ARDUINO
          </footer>

        </div>
      </div>
    </>
  );
}