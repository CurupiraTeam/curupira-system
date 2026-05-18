import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DiagnosisCard } from '../../components/dashboard/DiagnosisCard';
import { LatestReportsPanel } from '../../components/dashboard/LatestReportsPanel';
import { SummaryMetricGrid } from '../../components/dashboard/SummaryMetricGrid';
import { ReportDialog } from '../../components/reports/ReportDialog';
import { ErrorState, LoadingState, PartialDataState, UnauthorizedState } from '../../components/ui/StateView';
import { useRealtimeArduinoData } from '../../hooks/useRealtimeArduinoData';
import { useReports } from '../../hooks/useReports';
import { useSensorMetrics } from '../../hooks/useSensorMetrics';
import { fadeUp, staggerContainer } from '../../hooks/useScrollReveal';
import { formatRelativeUpdate } from '../../utils/formatDate';
import { getStatusByIqa } from '../../utils/status';

export function HomePage() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const metrics = useSensorMetrics();
  const reports = useReports();
  const realtime = useRealtimeArduinoData();

  useEffect(() => {
    if (realtime.connectionState === 'disconnected' || realtime.connectionState === 'error') {
      void metrics.refetch();
    }
  }, [metrics.refetch, realtime.connectionState]);

  const summary = useMemo(() => {
    const reportItems = reports.data || [];
    const aqiValue = metrics.data?.aqiValue ?? 78;
    return {
      region: 'Manaus, AM',
      subRegion: 'Centro',
      updatedAt: realtime.latest ? formatRelativeUpdate(realtime.latest.timestamp) : formatRelativeUpdate(metrics.data?.updatedAt),
      aqiValue,
      aqiStatus: metrics.data?.aqiStatus || getStatusByIqa(aqiValue),
      nearbySensorsCount: metrics.data?.pm25 ? 1 : 0,
      officialAlertsCount: reportItems.filter((report) => report.source !== 'Usuário').length || 2,
      regionalReportsCount: reportItems.length,
      alertMessage:
        'A região possui relatos recentes de fumaça e dados próximos indicando piora na qualidade do ar. Evite atividades ao ar livre em áreas críticas.',
      isPartial: Boolean(metrics.error || reports.error)
    };
  }, [metrics.data, metrics.error, realtime.latest, reports.data, reports.error]);

  return (
    <main className="min-h-[calc(100vh-72px)] px-4 pb-24 pt-4 sm:px-6 md:flex md:items-center md:pb-6 md:pt-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl">
        {(metrics.isLoading || reports.isLoading) && (
          <div className="mb-4">
            <LoadingState compact title="Atualizando painel" description="Buscando indicadores ambientais e relatos recentes." />
          </div>
        )}

        {(metrics.isUnauthorized || reports.isUnauthorized) && (
          <div className="mb-4">
            <UnauthorizedState compact title="Sessão necessária" description="Entre para carregar dados protegidos da API. Dados locais podem aparecer como fallback." />
          </div>
        )}

        {(metrics.error || reports.error) && !metrics.isUnauthorized && !reports.isUnauthorized && (
          <div className="mb-4">
            <ErrorState compact title="Usando dados locais" description="Não foi possível carregar a API agora; o painel segue com dados de demonstração." />
          </div>
        )}

        {summary.isPartial && (
          <div className="mb-4">
            <PartialDataState compact title="Dados parciais" description="Alguns indicadores podem estar em modo fallback até a API responder." />
          </div>
        )}

        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-6"
        >
          <motion.div variants={fadeUp} className="rounded-[2.5rem] bg-white/80 border border-emerald-100/60 backdrop-blur-xl p-4 shadow-xl shadow-slate-200/30 sm:p-5 lg:p-6 text-slate-800">
            <DiagnosisCard summary={summary} onReport={() => setIsReportOpen(true)} />
            <div className="mt-4">
              <SummaryMetricGrid summary={summary} />
            </div>
            {realtime.latest && (
              <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                Sensor atualizado: {realtime.latest.valor} em {formatRelativeUpdate(realtime.latest.timestamp)}.
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <LatestReportsPanel reports={reports.data || []} />
          </motion.div>
        </motion.section>

        <ReportDialog open={isReportOpen} onClose={() => setIsReportOpen(false)} onSuccess={() => void reports.refetch()} />
      </section>
    </main>
  );
}
