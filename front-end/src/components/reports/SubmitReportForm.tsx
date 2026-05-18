import { useState } from 'react';
import { Send } from 'lucide-react';
// categories are provided by the picker itself now
import { useAuth } from '../../hooks/useAuth';
import { useCategories } from '../../hooks/useCategories';
import { useSubmitReport } from '../../hooks/useSubmitReport';
import { Button, FieldWrapper, FormSection, TextArea } from '../ui/FormControls';
import { ErrorState, LoadingState, SuccessState, UnauthorizedState } from '../ui/StateView';
import { ReportCategoryPicker } from './ReportCategoryPicker';
import { ReportLocationFields } from './ReportLocationFields';
import { ReportPhotoField } from './ReportPhotoField';

interface SubmitReportFormProps {
  onSuccess?: () => void | Promise<void>;
}

export function SubmitReportForm({ onSuccess }: SubmitReportFormProps) {
  const { user, isAuthenticated } = useAuth();
  const categories = useCategories();
  const submission = useSubmitReport(onSuccess);
  const [categoriaId, setCategoriaId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [foto, setFoto] = useState<File | undefined>();

  async function handleSubmit() {
    const normalizedCategoryId = toNumberIfNumeric(categoriaId);
    const normalizedUserId = normalizeUserId(user?.id);
    const success = await submission.submit({
      usuario_id: normalizedUserId,
      categoria_id: normalizedCategoryId,
      descricao,
      latitude: Number(latitude),
      longitude: Number(longitude),
      foto
    });

    if (success) {
      setDescricao('');
      setCategoriaId('');
      setFoto(undefined);
    }
  }

  return (
    <div className="grid gap-6 rounded-[2.5rem] bg-white p-5 text-slate-800 shadow-2xl sm:p-6">
      <div className="grid gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-700 border border-emerald-100">
            🌱 Sensor humano
          </span>
        </div>
        <h3 className="text-2xl font-black text-slate-900">Reporte a qualidade do ar agora</h3>
        <p className="text-sm leading-6 text-slate-500">
          Seu relato ajuda o Curupira a cruzar percepção local com dados ambientais e detectar incidentes mais rápido.
        </p>
      </div>

      {!isAuthenticated && (
        <UnauthorizedState compact title="Login necessário" description="Entre para enviar um relato autenticado." />
      )}

      {categories.isLoading && <LoadingState compact title="Carregando categorias" description="Buscando tipos de ocorrência disponíveis." />}
      {categories.error && !categories.data?.length && (
        <ErrorState compact title="Categorias em modo fallback" description="Não foi possível carregar a API; categorias locais serão usadas." />
      )}

      <div className="grid gap-4 md:grid-cols-2 md:items-start lg:gap-6">
        <div className="grid gap-4">
          <FormSection title="Ocorrência" light>
            <ReportCategoryPicker
              value={categoriaId}
              error={submission.fieldErrors.categoria_id}
              onChange={setCategoriaId}
              light
            />
          </FormSection>

          <FormSection title="Localização" light>
            <ReportLocationFields
              latitude={latitude}
              longitude={longitude}
              latitudeError={submission.fieldErrors.latitude}
              longitudeError={submission.fieldErrors.longitude}
              onLatitudeChange={setLatitude}
              onLongitudeChange={setLongitude}
              light
            />
          </FormSection>
        </div>

        <div className="grid gap-4">
          <FormSection title="Detalhes" light>
            <FieldWrapper label="Descrição opcional" error={submission.fieldErrors.descricao} light>
              <TextArea
                value={descricao}
                maxLength={500}
                onChange={(event) => setDescricao(event.target.value)}
                placeholder="Descreva o que você está sentindo ou vendo na sua região..."
                light
                className="md:min-h-56"
              />
            </FieldWrapper>
            <ReportPhotoField error={submission.fieldErrors.foto} onChange={setFoto} light />
          </FormSection>
        </div>
      </div>

      <div className="mt-4">
        {submission.status === 'success' && <SuccessState compact title="Relato registrado" description="Obrigado por contribuir com o monitoramento." />}
        {(submission.status === 'submissionError' || submission.status === 'unauthorized') && (
          <ErrorState compact title="Não foi possível enviar" description={submission.error?.message || 'Revise os dados e tente novamente.'} />
        )}
      </div>

      <div className="sticky bottom-0 -mx-5 mt-5 border-t border-slate-100 bg-white px-5 pb-1 pt-4 sm:static sm:mx-0 sm:border-0 sm:p-0">
        <Button
          type="button"
          disabled={!isAuthenticated || submission.status === 'submitting'}
          onClick={handleSubmit}
          className="w-full bg-emerald-700 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-700/25 active:scale-95"
        >
          <Send size={18} aria-hidden="true" />
          {submission.status === 'submitting' ? 'Enviando...' : 'Enviar relato'}
        </Button>
      </div>
    </div>
  );
}

function toNumberIfNumeric(value: string) {
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}

function normalizeUserId(value: string | number | undefined) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}
