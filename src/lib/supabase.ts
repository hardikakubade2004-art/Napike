/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { User, Order } from '../types';

// Load Supabase configuration. It will prioritize VITE_ prefixed environment variables (for Netlify/Vite),
// and fall back to the provided credentials.
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://eruuhixuxmdvsuroihih.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cOg_C6Xkdt-RJMi1EJ19Pw_LcKrQwr_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

let onSchemaErrorCallback: (() => void) | null = null;

/**
 * Registers a callback for when database tables/schemas are missing
 */
export function onSchemaError(callback: () => void) {
  onSchemaErrorCallback = callback;
}

/**
 * Verifies if the Supabase connection is active and tables exist
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('napike_users')
      .select('uid')
      .limit(1);

    if (error) {
      console.warn('Supabase connection test returned an error:', error.message);
      // Code '42P01' is Undefined Table in PostgreSQL, which means connected but schema is missing
      if (error.code === '42P01') {
        console.warn('Database connected, but napike_users table is missing.');
        if (onSchemaErrorCallback) {
          onSchemaErrorCallback();
        }
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('Supabase connection failed completely:', err.message || err);
    return false;
  }
}

/**
 * Database to frontend models mapper helper functions
 */
function mapDbUserToUser(dbUser: any): User {
  return {
    uid: dbUser.uid,
    fullName: dbUser.full_name || dbUser.fullName || '',
    email: dbUser.email,
    phone: dbUser.phone || '',
    joinedDate: dbUser.joined_date || dbUser.joinedDate || '',
    photoUrl: dbUser.photo_url || dbUser.photoUrl || '',
    password: dbUser.password
  };
}

function mapUserToDbUser(user: User): any {
  return {
    uid: user.uid,
    full_name: user.fullName,
    email: user.email.toLowerCase(),
    phone: user.phone || '',
    joined_date: user.joinedDate || '',
    photo_url: user.photoUrl || '',
    password: user.password || ''
  };
}

function mapDbOrderToOrder(dbOrder: any): Order {
  let items = dbOrder.items;
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch (e) {
      items = [];
    }
  }
  return {
    id: dbOrder.id,
    date: dbOrder.date,
    items: items || [],
    subtotal: Number(dbOrder.subtotal),
    discount: Number(dbOrder.discount || 0),
    shipping: Number(dbOrder.shipping || 0),
    taxes: Number(dbOrder.taxes || 0),
    total: Number(dbOrder.total),
    status: dbOrder.status,
    deliveryAddress: dbOrder.delivery_address || dbOrder.deliveryAddress || '',
    city: dbOrder.city || '',
    state: dbOrder.state || '',
    postalCode: dbOrder.postal_code || dbOrder.postalCode || '',
    paymentMethod: dbOrder.payment_method || dbOrder.paymentMethod || '',
    userEmail: dbOrder.user_email || dbOrder.userEmail || ''
  };
}

function mapOrderToDbOrder(order: Order): any {
  return {
    id: order.id,
    date: order.date,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    taxes: order.taxes,
    total: order.total,
    status: order.status,
    delivery_address: order.deliveryAddress,
    city: order.city,
    state: order.state,
    postal_code: order.postalCode,
    payment_method: order.paymentMethod,
    user_email: order.userEmail.toLowerCase()
  };
}

/**
 * Saves or updates user profile details in Supabase
 */
export async function dbSaveUser(user: User): Promise<boolean> {
  try {
    const dbUser = mapUserToDbUser(user);
    const { error } = await supabase
      .from('napike_users')
      .upsert(dbUser);

    if (error) {
      console.error('Error saving user to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('Supabase error in dbSaveUser:', err.message || err);
    return false;
  }
}

/**
 * Fetches user profile from Supabase by email
 */
export async function dbGetUser(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('napike_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Error fetching user from Supabase:', error.message);
      return null;
    }

    if (data) {
      return mapDbUserToUser(data);
    }
    return null;
  } catch (err: any) {
    console.error('Supabase error in dbGetUser:', err.message || err);
    return null;
  }
}

/**
 * Saves a new or updated order to Supabase
 */
export async function dbSaveOrder(order: Order): Promise<boolean> {
  try {
    const dbOrder = mapOrderToDbOrder(order);
    const { error } = await supabase
      .from('napike_orders')
      .upsert(dbOrder);

    if (error) {
      console.error('Error saving order to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('Supabase error in dbSaveOrder:', err.message || err);
    return false;
  }
}

/**
 * Retrieves all order details for a customer from Supabase
 */
export async function dbGetOrders(email: string): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('napike_orders')
      .select('*')
      .eq('user_email', email.toLowerCase());

    if (error) {
      console.error('Error fetching orders from Supabase:', error.message);
      return null;
    }

    if (data) {
      return data.map(mapDbOrderToOrder);
    }
    return [];
  } catch (err: any) {
    console.error('Supabase error in dbGetOrders:', err.message || err);
    return null;
  }
}
