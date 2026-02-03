"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import type { Product } from "@/types/product";

// Cart item type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Cart state
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Cart actions
type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean };

// Initial state
const initialState: CartState = {
  items: [],
  isOpen: false,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          product.stock,
        );
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        };
      }

      // Add new item
      return {
        ...state,
        items: [
          ...state.items,
          { product, quantity: Math.min(quantity, product.stock) },
        ],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.payload.productId,
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== productId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(quantity, item.product.stock) }
            : item,
        ),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
      };
    }

    case "TOGGLE_CART": {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }

    case "SET_CART_OPEN": {
      return {
        ...state,
        isOpen: action.payload,
      };
    }

    default:
      return state;
  }
}

// Context type
interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: "TOGGLE_CART" });
  }, []);

  const setCartOpen = useCallback((open: boolean) => {
    dispatch({ type: "SET_CART_OPEN", payload: open });
  }, []);

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = state.items.find((item) => item.product.id === productId);
      return item?.quantity ?? 0;
    },
    [state.items],
  );

  const isInCart = useCallback(
    (productId: string) => {
      return state.items.some((item) => item.product.id === productId);
    },
    [state.items],
  );

  const totalItems = useMemo(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const totalPrice = useMemo(() => {
    return state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      setCartOpen,
      getItemQuantity,
      isInCart,
    }),
    [
      state.items,
      state.isOpen,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      setCartOpen,
      getItemQuantity,
      isInCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook to use cart
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
