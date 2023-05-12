/**
 * Helper interface used by a repository to join together
 * an OrderItem and the Product it is associated with.
 */
declare interface OrderItemWithProductInformation extends OrderItem {
  product_name: string;
  product_price: number;
  product_category_id: number;
}
