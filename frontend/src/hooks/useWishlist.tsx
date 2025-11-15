/**
 * Wishlist Hook for VastraVerse
 * Works with local storage - persists across sessions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
  
  // Actions
  addToWishlist: (product: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Omit<WishlistItem, 'addedAt'>) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      addToWishlist: (product) => {
        const { items } = get();
        
        // Check if already in wishlist
        if (items.some(item => item.productId === product.productId)) {
          toast.error('Already in wishlist!');
          return;
        }

        const newItem: WishlistItem = {
          ...product,
          addedAt: new Date().toISOString(),
        };

        const newItems = [...items, newItem];
        
        set({ 
          items: newItems, 
          totalItems: newItems.length 
        });

        toast.success('Added to wishlist!');
      },

      removeFromWishlist: (productId) => {
        const { items } = get();
        const newItems = items.filter(item => item.productId !== productId);
        
        set({ 
          items: newItems, 
          totalItems: newItems.length 
        });

        toast.success('Removed from wishlist');
      },

      clearWishlist: () => {
        set({ 
          items: [], 
          totalItems: 0 
        });
        toast.success('Wishlist cleared');
      },

      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => item.productId === productId);
      },

      toggleWishlist: (product) => {
        const { items, addToWishlist, removeFromWishlist } = get();
        const isInList = items.some(item => item.productId === product.productId);
        
        if (isInList) {
          removeFromWishlist(product.productId);
        } else {
          addToWishlist(product);
        }
      },
    }),
    {
      name: 'vastraverse-wishlist',
    }
  )
);
