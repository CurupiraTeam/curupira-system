import { FieldWrapper, SelectField } from '../ui/FormControls';

interface ReportCategoryPickerProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

const REPORT_CATEGORIES = [
  { id: 'fumaca', nome: 'Fumaça' },
  { id: 'queimada', nome: 'Queimada' },
  { id: 'cheiro-forte-quimico', nome: 'Cheiro Forte Químico' }
];

export function ReportCategoryPicker({ value, error, onChange }: ReportCategoryPickerProps) {
  return (
    <FieldWrapper label="Tipo da ocorrência" error={error}>
      <SelectField
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="[&>option]:bg-white [&>option]:text-slate-900"
      >
        <option value="" disabled>
          Selecione um tipo
        </option>
        {REPORT_CATEGORIES.map((category) => (
          <option key={category.id} value={String(category.id)}>
            {category.nome}
          </option>
        ))}
      </SelectField>
    </FieldWrapper>
  );
}
