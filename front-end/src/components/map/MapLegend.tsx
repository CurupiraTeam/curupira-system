import { fallbackCategories } from '../../constants/reportCategories';
import { mapCategoryToIcon } from '../../utils/mapCategoryToIcon';

export function MapLegend() {
  return (
    <div className="grid gap-2 rounded-3xl bg-white/95 p-4 text-sm font-bold text-slate-700 shadow-sm md:grid-cols-4">
      {fallbackCategories.map((category) => {
        const visual = mapCategoryToIcon(category.nome);
        return (
          <div key={category.id} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${visual.markerClass}`} />
            {category.nome}
          </div>
        );
      })}
    </div>
  );
}
