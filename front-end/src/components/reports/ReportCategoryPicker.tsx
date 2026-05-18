import { FieldWrapper, SelectField } from '../ui/FormControls';

interface ReportCategoryPickerProps {
  value: string;
  error?: string;
  light?: boolean;
  onChange: (value: string) => void;
}

const REPORT_CATEGORIES = [
  { id: 'fumaca', nome: 'Fumaça' },
  { id: 'queimada', nome: 'Queimada' },
  { id: 'cheiro-forte-quimico', nome: 'Cheiro Forte Químico' }
];

export function ReportCategoryPicker({ value, error, light, onChange }: ReportCategoryPickerProps) {
  return (
    <FieldWrapper label="Tipo da ocorrência" error={error} light={light}>
      <SelectField
        value={value}
        onChange={(event) => onChange(event.target.value)}
        light={light}
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
