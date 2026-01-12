import { SpecialSandwich, Ingredient, Extra } from '../../shared/api/adminTypes';

export const adminSpecialSandwiches: SpecialSandwich[] = [
  { id: "admin-spec-001", name: "Chicken Classic", description: "Grilled chicken with lettuce and mayo", isActive: true },
  { id: "admin-spec-002", name: "Turkey & Cheese", description: "Fresh turkey with swiss cheese", isActive: true },
  { id: "admin-spec-003", name: "Tuna Mayo", description: "Tuna mix with sweet corn", isActive: false }
];

export const adminIngredients: Ingredient[] = [
  { id: "admin-ing-001", name: "White Bread", category: "BREAD", isActive: true },
  { id: "admin-ing-002", name: "Whole Grain", category: "BREAD", isActive: true },
  { id: "admin-ing-003", name: "Chicken", category: "MEAT", isActive: true },
  { id: "admin-ing-004", name: "Beef", category: "MEAT", isActive: true },
  { id: "admin-ing-005", name: "Lettuce", category: "VEGGIES", isActive: true },
  { id: "admin-ing-006", name: "Tomato", category: "VEGGIES", isActive: true },
  { id: "admin-ing-007", name: "Mayo", category: "SAUCE", isActive: true },
  { id: "admin-ing-008", name: "Spicy Sauce", category: "SAUCE", isActive: false }
];

export const adminExtras: Extra[] = [
  { id: "admin-ext-001", name: "Apple", isActive: true },
  { id: "admin-ext-002", name: "Chips", isActive: true },
  { id: "admin-ext-003", name: "Seasonal Cookie", isActive: false }
];
