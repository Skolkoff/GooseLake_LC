
import React, { useMemo } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Ingredient, IngredientCategory } from '../shared/api/mockTypes';
import { CUSTOM_SANDWICH_RULES } from '../features/order/model/customSandwichRules';

interface CustomSandwichBuilderProps {
  ingredients: Ingredient[];
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  fieldName: string; // e.g. "selectedIngredientIds"
}

export const CustomSandwichBuilder: React.FC<CustomSandwichBuilderProps> = ({
  ingredients,
  register,
  watch,
  errors,
  fieldName
}) => {
  const selectedIds: string[] = watch(fieldName) || [];

  const groupedIngredients = useMemo(() => {
    return ingredients.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<IngredientCategory, Ingredient[]>);
  }, [ingredients]);

  const categories = Object.keys(CUSTOM_SANDWICH_RULES) as IngredientCategory[];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {categories.map((catKey) => {
        const rule = CUSTOM_SANDWICH_RULES[catKey];
        const catIngredients = groupedIngredients[catKey] || [];
        
        // Calculate currently selected count for this specific category
        const selectedInCategory = catIngredients.filter(ing => selectedIds.includes(ing.id));
        const currentCount = selectedInCategory.length;
        const isMaxReached = currentCount >= rule.max;

        return (
          <div key={catKey} className="space-y-3">
            <div className="flex justify-between items-end border-b border-neutral-100 pb-2">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">{rule.label}</h4>
                <p className="text-xs text-neutral-400">
                  {rule.min === rule.max 
                    ? `Pick exactly ${rule.max}` 
                    : `Choose ${rule.min} to ${rule.max}`}
                </p>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                currentCount > rule.max || currentCount < rule.min 
                  ? 'bg-red-100 text-red-600' 
                  : currentCount === rule.max ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
              }`}>
                {currentCount} / {rule.max}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {catIngredients.map((ing) => {
                const isSelected = selectedIds.includes(ing.id);
                const isDisabled = !isSelected && isMaxReached;

                return (
                  <label 
                    key={ing.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-neutral-900 shadow-sm' 
                        : isDisabled 
                          ? 'opacity-40 bg-neutral-50 border-neutral-100 cursor-not-allowed'
                          : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        value={ing.id}
                        disabled={isDisabled}
                        {...register(fieldName, {
                           validate: (value: string[]) => {
                             // This internal validation handles the logic per category if needed, 
                             // but we usually rely on the main form validation.
                             return true;
                           }
                        })}
                        className="w-5 h-5 accent-primary border-neutral-300 rounded focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
                      />
                    </div>
                    <span className="text-sm font-semibold">{ing.name}</span>
                  </label>
                );
              })}
            </div>
            {/* Display category specific errors if they were passed down */}
            {errors[catKey] && (
               <p className="text-xs text-red-500 font-bold">{errors[catKey]?.message as string}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
