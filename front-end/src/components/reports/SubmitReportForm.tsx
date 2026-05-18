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
    <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-glow sm:p-6">
      <div className="mb-5">
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          Sensor humano
        </span>
        <h3 className="mt-4 text-2xl font-black">Reporte a qualidade do ar agora</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Seu relato ajuda o Curupira a cruzar percepção local com dados ambientais e detectar incidentes mais rápido.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="mb-4">
          <UnauthorizedState compact title="Login necessário" description="Entre para enviar um relato autenticado." />
        </div>
      )}

      {categories.isLoading && <LoadingState compact title="Carregando categorias" description="Buscando tipos de ocorrência disponíveis." />}
      {categories.error && !categories.data?.length && (
        <div className="mb-4">
          <ErrorState compact title="Categorias em modo fallback" description="Não foi possível carregar a API; categorias locais serão usadas." />
        </div>
      )}

      <div className="grid gap-4">
        <FormSection title="Ocorrência">
          <ReportCategoryPicker
            value={categoriaId}
            error={submission.fieldErrors.categoria_id}
            onChange={setCategoriaId}
          />
        </FormSection>

        <FormSection title="Localização">
          <ReportLocationFields
            latitude={latitude}
            longitude={longitude}
            latitudeError={submission.fieldErrors.latitude}
            longitudeError={submission.fieldErrors.longitude}
            onLatitudeChange={setLatitude}
            onLongitudeChange={setLongitude}
          />
        </FormSection>

        <FormSection title="Detalhes">
          <FieldWrapper label="Descrição opcional" error={submission.fieldErrors.descricao}>
            <TextArea
              value={descricao}
              maxLength={500}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Descreva o que você está sentindo ou vendo na sua região..."
            />
          </FieldWrapper>
          <ReportPhotoField error={submission.fieldErrors.foto} onChange={setFoto} />
        </FormSection>

        {submission.status === 'success' && <SuccessState compact title="Relato registrado" description="Obrigado por contribuir com o monitoramento." />}
        {(submission.status === 'submissionError' || submission.status === 'unauthorized') && (
          <ErrorState compact title="Não foi possível enviar" description={submission.error?.message || 'Revise os dados e tente novamente.'} />
        )}
      </div>

      <div className="sticky bottom-0 -mx-5 mt-5 border-t border-white/10 bg-slate-950 px-5 pb-1 pt-4 sm:static sm:mx-0 sm:border-0 sm:p-0">
        <Button
          type="button"
          disabled={!isAuthenticated || submission.status === 'submitting'}
          onClick={handleSubmit}
          className="w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300"
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
