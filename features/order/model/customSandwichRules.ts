
import { IngredientCategory } from '../../../shared/api/mockTypes';

export const CUSTOM_SANDWICH_RULES: Record<IngredientCategory, { min: number; max: number; label: string }> = {
  BREAD:   { min: 1, max: 1, label: "Bread" },
  MEAT:    { min: 0, max: 3, label: "Meat" },
  VEGGIES: { min: 0, max: 3, label: "Veggies" },
  SAUCE:   { min: 0, max: 3, label: "Sauce" }
};
