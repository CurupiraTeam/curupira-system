import { HistorySummaryCards } from '../../components/history/HistorySummaryCards';
import { HistoryTrendChart } from '../../components/history/HistoryTrendChart';
import { RecentRecordsList } from '../../components/history/RecentRecordsList';
import { EmptyState, ErrorState, LoadingState, PartialDataState, UnauthorizedState } from '../../components/ui/StateView';
import { useHistoricalStats } from '../../hooks/useHistoricalStats';
import { useReports } from '../../hooks/useReports';

export function HistoryPage() {
  const history = useHistoricalStats();
  const reports = useReports();
  const stats = history.data || [];
  const recentReports = (reports.data || []).slice(0, 6);

  return (
    <section className="px-4 py-8 pb-24 md:px-6 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Histórico</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Tendências, alertas e relatos ao longo do tempo</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Acompanhe o comportamento recente do IQA, volume de relatos e alertas oficiais sem excesso de detalhe técnico.
          </p>
        </div>

        <div className="mb-5 grid gap-3">
          {(history.isLoading || reports.isLoading) && <LoadingState compact title="Carregando histórico" description="Buscando séries recentes e registros detalhados." />}
          {(history.isUnauthorized || reports.isUnauthorized) && <UnauthorizedState compact title="Sessão necessária" description="Entre para carregar dados protegidos da API. Dados locais podem aparecer como fallback." />}
          {(history.error || reports.error) && !history.isUnauthorized && !reports.isUnauthorized && (
            <ErrorState compact title="Usando histórico local" description="A API não respondeu agora; a página segue com dados de demonstração." />
          )}
          {(history.error || reports.error) && <PartialDataState compact title="Dados parciais" description="Algumas informações podem vir de fallback enquanto a API não responde." />}
        </div>

        {stats.length ? (
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <HistoryTrendChart stats={stats} />
            <HistorySummaryCards stats={stats} />
          </div>
        ) : (
          <EmptyState title="Sem histórico disponível" description="Ainda não há dados suficientes para montar a tendência dos últimos dias." />
        )}

        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-black text-slate-950">Últimos registros armazenados</h2>
          <RecentRecordsList reports={recentReports} />
        </div>
      </div>
    </section>
  );
}
