export interface InventoryItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  quantity: number;
  price: number;
  createdBy?: { username: string; email: string };
  created_at?: string;
  updated_at?: string;
}
