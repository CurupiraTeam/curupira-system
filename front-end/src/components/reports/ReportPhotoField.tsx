import { FieldWrapper } from '../ui/FormControls';

interface ReportPhotoFieldProps {
  error?: string;
  onChange: (file?: File) => void;
}

export function ReportPhotoField({ error, onChange }: ReportPhotoFieldProps) {
  return (
    <FieldWrapper label="Foto opcional" error={error}>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => onChange(event.target.files?.[0])}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-400 file:px-4 file:py-2 file:font-black file:text-slate-950"
      />
    </FieldWrapper>
  );
}
