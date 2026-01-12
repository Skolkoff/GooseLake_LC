
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
  fieldName: string;
}

export const CustomSandwichBuilder: React.FC<CustomSandwichBuilderProps> = ({
  ingredients,
  register,
  watch,
  fieldName,
  errors
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
    <div className="space-y-8">
      {categories.map((catKey) => {
        const rule = CUSTOM_SANDWICH_RULES[catKey];
        const catIngredients = groupedIngredients[catKey] || [];
        const selectedInCategory = catIngredients.filter(ing => selectedIds.includes(ing.id));
        const currentCount = selectedInCategory.length;
        const isMaxReached = currentCount >= rule.max;
        
        // Extract specific error for this category if it exists
        const categoryError = errors.customErrors?.[catKey]?.message as string | undefined;

        return (
          <div key={catKey} className="space-y-3">
            <div className="flex justify-between items-end border-b border-neutral-100 pb-2">
              <div>
                <h4 className={`text-sm font-bold uppercase tracking-widest ${categoryError ? 'text-red-600' : 'text-neutral-900'}`}>
                  {rule.label}
                </h4>
                <p className="text-[11px] text-neutral-400 font-medium">
                  {rule.min === rule.max 
                    ? `Требуется ровно ${rule.max}` 
                    : `От ${rule.min} до ${rule.max}`}
                </p>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                categoryError 
                  ? 'bg-red-100 text-red-600' 
                  : currentCount > rule.max || currentCount < rule.min 
                    ? 'bg-neutral-100 text-neutral-500' // Default state before validation
                    : 'bg-green-50 text-green-700'
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
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-neutral-900' 
                        : isDisabled 
                          ? 'opacity-40 bg-neutral-50 border-neutral-100 cursor-not-allowed'
                          : categoryError
                            ? 'bg-red-50 border-red-200'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={ing.id}
                      disabled={isDisabled}
                      {...register(fieldName)}
                      className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed accent-primary"
                    />
                    <span className="text-sm font-semibold">{ing.name}</span>
                  </label>
                );
              })}
            </div>
            
            {categoryError && (
              <div className="text-xs font-bold text-red-600 animate-in fade-in slide-in-from-top-1">
                {categoryError}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
