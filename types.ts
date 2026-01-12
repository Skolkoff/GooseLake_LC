
export interface ServiceStatus {
  isOpen: boolean;
  message: string | null;
}

export interface OrderWindows {
  orderWindow: { from: string; to: string };
  dayShift: { from: string; to: string };
}

export interface ReferenceItem {
  id: string;
  name: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description?: string;
}

export interface Ingredient extends CatalogItem {
  category: string;
}
