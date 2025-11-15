/**
 * Product Model for VastraVerse
 * Handles product-related database operations with Supabase
 */

import { supabase } from '../config/db';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  sizes: string[];
  created_at?: string;
  updated_at?: string;
}

export class ProductModel {
  // Get all products
  static async findAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching all products:', error);
        throw error;
      }
      
      return data as Product[];
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  }

  // Get products by category
  static async findByCategory(category: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products by category:', error);
        throw error;
      }
      
      return data as Product[];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  // Get product by ID
  static async findById(id: number): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows found
        }
        console.error('Error fetching product by ID:', error);
        throw error;
      }
      
      return data as Product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  // Create a new product
  static async create(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    try {
      const { name, description, price, category, image, stock, rating, sizes } = productData;
      const { data, error } = await supabase
        .from('products')
        .insert({
          name,
          description,
          price,
          category,
          image,
          stock,
          rating,
          sizes
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      
      return data as Product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  static async update(id: number, updateData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      return data as Product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  static async delete(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Search products
  static async search(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error searching products:', error);
        throw error;
      }
      
      return data as Product[];
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Update stock
  static async updateStock(id: number, quantity: number): Promise<boolean> {
    try {
      // First check if there's enough stock
      const product = await ProductModel.findById(id);
      if (!product || product.stock < quantity) {
        return false;
      }
      
      const { error } = await supabase
        .from('products')
        .update({ stock: product.stock - quantity })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating stock:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // Delete all products
  static async deleteAll(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', 0); // Delete all rows (using neq with impossible condition)
      
      if (error) {
        console.error('Error deleting all products:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting all products:', error);
      throw error;
    }
  }
}
