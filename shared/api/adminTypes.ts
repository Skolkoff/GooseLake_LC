export type Role = "ADMIN" | "MANAGER" | "CHEF";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAtIso: string;
};

export type SpecialSandwich = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
};

export type IngredientCategory = "BREAD" | "MEAT" | "VEGGIES" | "SAUCE";

export type Ingredient = {
  id: string;
  name: string;
  category: IngredientCategory;
  isActive: boolean;
};

export type Extra = { 
  id: string; 
  name: string; 
  isActive: boolean 
};

export type TimeSettings = {
  orderWindowFrom: string; 
  orderWindowTo: string;
  dayShiftFrom: string; 
  dayShiftTo: string;
  nightShiftFrom: string; 
  nightShiftTo: string;
};

export type MaintenanceSettings = {
  isEnabled: boolean;
  message: string | null;
  untilIso: string | null;
};

export type LoginResponse = {
  accessToken: string;
};

export type AuthError = {
  code: string;
  message: string;
};
