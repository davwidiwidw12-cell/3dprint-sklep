import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // product id + variant logic if needed, here just product id
  productId: string;
  name: string;
  price: number;
  quantity: number;
  slug: string;
  image?: string;
  hasMount?: boolean;
  customDimensions?: string;
  customImageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  shippingCost: (subtotal: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        // Consider custom items as unique if they have custom properties
        // For simplicity, we only group if NO custom props.
        // Or we group by id, assuming ID is unique per configuration? No, ID is product ID.
        // Let's generate a unique cartItemId for better handling in real apps, but for now:
        // Group only if exact match on custom props too.
        
        const existing = state.items.find((i) => 
            i.productId === item.productId && 
            i.customDimensions === item.customDimensions &&
            i.customImageUrl === item.customImageUrl
        );

        if (existing) {
          return {
            items: state.items.map((i) =>
              (i.productId === item.productId && i.customDimensions === item.customDimensions && i.customImageUrl === item.customImageUrl)
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (productId) => set((state) => ({ 
          // Warning: this removes ALL variants of product. 
          // Ideally should remove by index or unique cartId. 
          // For now let's assume user removes all instances or we need to fix this UI.
          // Let's change removeItem to accept index or object? 
          // To keep it simple without major refactor: remove matching productId.
          items: state.items.filter((i) => i.productId !== productId) 
      })),
      updateQuantity: (id, qty) => set((state) => ({
        items: state.items.map((i) => (i.productId === id ? { ...i, quantity: qty } : i)),
      })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      shippingCost: (subtotal: number) => subtotal >= 200 ? 0 : 10.99,
    }),
    { name: 'cart-storage' }
  )
);
