import { FieldWrapper } from '../ui/FormControls';

interface ReportPhotoFieldProps {
  error?: string;
  light?: boolean;
  onChange: (file?: File) => void;
}

export function ReportPhotoField({ error, light, onChange }: ReportPhotoFieldProps) {
  return (
    <FieldWrapper label="Foto opcional" error={error} light={light}>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => onChange(event.target.files?.[0])}
        className={`w-full rounded-2xl border ${light ? 'border-slate-200 bg-white text-slate-800' : 'border-white/10 bg-white/5 text-slate-200'} px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:font-black file:text-white`}
      />
    </FieldWrapper>
  );
}
