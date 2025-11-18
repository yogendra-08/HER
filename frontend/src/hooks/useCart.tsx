/**
 * Simplified Cart Hook for VastraVerse
 * Works with local storage only - no backend API calls
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface ProductDetails {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  
  // Actions
  fetchCart: () => void;
  addToCart: (productDetails: ProductDetails, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,

      // Calculate totals from current items
      fetchCart: () => {
        const { items } = get();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        set({ 
          totalItems, 
          totalPrice,
          isLoading: false 
        });
      },

      addToCart: (productDetails: ProductDetails, quantity = 1) => {
        // Validate input
        const validQuantity = Number(quantity) || 1;
        const validPrice = Number(productDetails.price) || 0;
        const validId = Number(productDetails.id);
        
        if (!validId || validId <= 0) {
          toast.error('Invalid product ID');
          return;
        }
        
        if (validPrice <= 0) {
          toast.error('Invalid product price');
          return;
        }
        
        if (validQuantity <= 0 || validQuantity > 10) {
          toast.error('Invalid quantity (1-10 allowed)');
          return;
        }

        const { items } = get();
        const existingItem = items.find(item => item.productId === validId);

        let newItems;
        if (existingItem) {
          // Update existing item
          newItems = items.map(item =>
            item.productId === validId
              ? { ...item, quantity: (item.quantity || 0) + validQuantity }
              : item
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            id: Date.now(), // Simple ID generation
            productId: validId,
            quantity: validQuantity,
            price: validPrice,
            name: productDetails.name || 'Product',
            image: productDetails.image || '',
          };
          newItems = [...items, newItem];
        }

        const totalItems = newItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalPrice = newItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

        set({ 
          items: newItems, 
          totalItems, 
          totalPrice 
        });

        toast.success(`${productDetails.name || 'Product'} added to cart!`);
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const { items } = get();
        const newItems = items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );

        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        set({ 
          items: newItems, 
          totalItems, 
          totalPrice 
        });
      },

      removeFromCart: (productId: number) => {
        const { items } = get();
        const newItems = items.filter(item => item.productId !== productId);
        
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        set({ 
          items: newItems, 
          totalItems, 
          totalPrice 
        });

        toast.success('Item removed from cart');
      },

      clearCart: () => {
        set({ 
          items: [], 
          totalItems: 0, 
          totalPrice: 0 
        });
        toast.success('Cart cleared');
      },

      getItemQuantity: (productId: number) => {
        const { items } = get();
        const item = items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
      },

      isInCart: (productId: number) => {
        const { items } = get();
        return items.some(item => item.productId === productId);
      },
    }),
    {
      name: 'vastraverse-cart',
    }
  )
);
