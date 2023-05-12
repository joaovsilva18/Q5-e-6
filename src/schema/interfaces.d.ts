type DiscountCodeTypes = "absolute" | "percentage";

declare interface DiscountCode {
  id: number;
  code: string;
  value: number;
  type: DiscountCodeTypes;
  expiration_date: Date | string;
  minimum_order_value: number | null;
}

declare interface ApplicableCategory {
  discount_code_id: number;
  category_id: number;
}

declare interface Category {
  id: number;
  name: string;
}

declare interface Product {
  id: number;
  name: string;
  price: number;
  category_id: number;
}

declare interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  balance: number;
}

declare interface Order {
  id: number;
  user_id: number;
  confirmed: boolean;
  created_at: Date | string;
}

declare interface OrderDiscounts {
  order_id: number;
  discount_code_id: number;
}

declare interface OrderItem {
  order_id: number;
  product_id: number;
  quantity: number;
}
