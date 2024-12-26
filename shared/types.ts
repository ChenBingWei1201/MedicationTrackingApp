export type Product = {
  id: number;
  image: string | null;
  name: string;
  price: number;
};

export type PizzaSize = "S" | "M" | "L" | "XL";

export type CartItem = {
  id: string;
  product: Product;
  product_id: number;
  size: PizzaSize;
  quantity: number;
};

export const OrderStatusList: OrderStatus[] = [
  "New",
  "Cooking",
  "Delivering",
  "Delivered",
];

export type OrderStatus = "New" | "Cooking" | "Delivering" | "Delivered";

export type Order = {
  id: number;
  created_at: string;
  total: number;
  user_id: string;
  status: OrderStatus;

  order_items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  product_id: number;
  products: Product;
  order_id: number;
  size: PizzaSize;
  quantity: number;
};

export type Profile = {
  id: string;
  group: string;
  full_name: string;
  avatar_url: string;
  timestamps: string[];
};

export type UserProfileUpdate = {
  fullName: string;
  avatarUrl: string;
};

export type Notification = {
  id: string;
  created_at: string;
  user_id: string;
  message: string;
  read: boolean;
};

export type MedicationLog = {
  id: string;
  created_at: string;
  user_id: string;
  time: string;
  taken: boolean;
  date: string;
};

export type CalendarDay = {
  dateString: string;
  day: number;
  month: number;
  year: number;
};
