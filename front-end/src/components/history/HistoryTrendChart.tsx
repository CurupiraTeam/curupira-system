import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HistoricalStats } from '../../types';

export function HistoryTrendChart({ stats }: { stats: HistoricalStats[] }) {
  const data = stats.map((item) => ({
    date: item.date,
    reports: item.userReportsCount,
    officialAlerts: item.officialAlertsCount,
    aqi: item.aqi
  }));

  return (
    <div className="h-[390px] rounded-[2.5rem] border border-emerald-100/60 bg-white/80 backdrop-blur-xl p-5 shadow-xl shadow-slate-200/30 md:h-[430px] text-slate-900">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900">Relatos x Alertas oficiais</h2>
        <p className="text-sm text-slate-500">Comparativo recente para leitura de tendência regional.</p>
      </div>
      <div className="w-full" style={{ height: '82%', minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '1rem', color: '#0f172a' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="reports" name="Relatos" fill="#059669" radius={[8, 8, 0, 0]} />
            <Bar dataKey="officialAlerts" name="Alertas oficiais" fill="#f97316" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
