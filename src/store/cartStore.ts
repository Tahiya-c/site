import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  totalCount: number; // ⭐ NEW

  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
}

const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.qty, 0);

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  totalCount: 0,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);

      let updatedItems;
      if (existing) {
        updatedItems = state.items.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
        );
      } else {
        updatedItems = [...state.items, item];
      }

      return {
        items: updatedItems,
        totalCount: calculateTotal(updatedItems),
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const updatedItems = state.items.filter((item) => item.id !== id);
      return {
        items: updatedItems,
        totalCount: calculateTotal(updatedItems),
      };
    }),

  increaseQty: (id) =>
    set((state) => {
      const updatedItems = state.items.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      );
      return {
        items: updatedItems,
        totalCount: calculateTotal(updatedItems),
      };
    }),

  decreaseQty: (id) =>
    set((state) => {
      const updatedItems = state.items
        .map((i) =>
          i.id === id ? { ...i, qty: Math.max(0, i.qty - 1) } : i
        )
        .filter((i) => i.qty > 0);

      return {
        items: updatedItems,
        totalCount: calculateTotal(updatedItems),
      };
    }),

  clearCart: () =>
    set({
      items: [],
      totalCount: 0,
    }),
}));
