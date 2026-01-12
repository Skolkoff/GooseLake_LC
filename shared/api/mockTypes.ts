
export type Id = string;

export type IngredientCategory = "BREAD" | "MEAT" | "VEGGIES" | "SAUCE";

export type ReferenceItem = { 
  id: Id; 
  name: string 
};

export type CatalogItem = { 
  id: Id; 
  name: string; 
  description?: string 
};

export type Ingredient = CatalogItem & { 
  category: IngredientCategory 
};

export type CreateOrderResponse = { 
  orderId: Id; 
  status: "SENT_TO_PRINT" 
};

export type OrderStatusResponse = { 
  status: "SENT_TO_PRINT" | "PRINTED" 
};

export type ServiceStatusResponse = { 
  isOpen: boolean; 
  message: string | null 
};

export type OrderWindowsResponse = { 
  orderWindow: { from: string; to: string }; 
  dayShift: { from: string; to: string } 
};
