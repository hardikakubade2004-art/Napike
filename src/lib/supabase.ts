/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { User, Order } from '../types';

const SUPABASE_URL = 'https://eruuhixuxmdvsuroihih.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cOg_C6Xkdt-RJMi1EJ19Pw_LcKrQwr_';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Verification Helper: Checks if Supabase is connected
type SchemaErrorCallback = () => void;
let schemaErrorCallback: SchemaErrorCallback | null = null;

export function onSchemaError(callback: SchemaErrorCallback) {
  schemaErrorCallback = callback;
}

function triggerSchemaError(message: string) {
  console.warn('Supabase Schema Error Detected:', message);
  if (schemaErrorCallback) {
    schemaErrorCallback();
  }
}

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('napike_users').select('count', { count: 'exact', head: true });
    if (error) {
      console.warn('Supabase test connection warning (table might not exist yet):', error.message);
      if (error.message.includes('schema cache') || error.message.includes('does not exist')) {
        triggerSchemaError(error.message);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase test connection exception:', err);
    return false;
  }
}

// ==========================================
// DB OPERATIONS: USERS (napike_users table)
// ==========================================

export async function dbSaveUser(user: User): Promise<boolean> {
  try {
    // Attempt write to Supabase
    const { error } = await supabase
      .from('napike_users')
      .upsert({
        uid: user.uid,
        full_name: user.fullName,
        email: user.email.toLowerCase(),
        phone: user.phone,
        joined_date: user.joinedDate,
        photo_url: user.photoUrl,
        password: user.password || '' // Store hashed or plain for simple login demo
      });

    if (error) {
      console.error('Error saving user to Supabase:', error.message);
      if (error.message.includes('schema cache') || error.message.includes('does not exist')) {
        triggerSchemaError(error.message);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception saving user to Supabase:', err);
    return false;
  }
}

export async function dbGetUser(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('napike_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      if (error) {
        console.warn('Could not fetch user from Supabase:', error.message);
        if (error.message.includes('schema cache') || error.message.includes('does not exist')) {
          triggerSchemaError(error.message);
        }
      }
      return null;
    }

    return {
      uid: data.uid,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      joinedDate: data.joined_date,
      photoUrl: data.photo_url,
      password: data.password
    };
  } catch (err) {
    console.error('Exception fetching user from Supabase:', err);
    return null;
  }
}

// ==========================================
// DB OPERATIONS: ORDERS (napike_orders table)
// ==========================================

export async function dbSaveOrder(order: Order): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('napike_orders')
      .insert({
        id: order.id,
        date: order.date,
        items: JSON.stringify(order.items), // Store items as JSON string or jsonb
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
      });

    if (error) {
      console.error('Error saving order to Supabase:', error.message);
      if (error.message.includes('schema cache') || error.message.includes('does not exist')) {
        triggerSchemaError(error.message);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception saving order to Supabase:', err);
    return false;
  }
}

export async function dbGetOrders(email: string): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('napike_orders')
      .select('*')
      .eq('user_email', email.toLowerCase());

    if (error || !data) {
      if (error) {
        console.warn('Could not fetch orders from Supabase:', error.message);
        if (error.message.includes('schema cache') || error.message.includes('does not exist')) {
          triggerSchemaError(error.message);
        }
      }
      return null;
    }

    return data.map((d: any) => ({
      id: d.id,
      date: d.date,
      items: typeof d.items === 'string' ? JSON.parse(d.items) : d.items,
      subtotal: Number(d.subtotal),
      discount: Number(d.discount),
      shipping: Number(d.shipping),
      taxes: Number(d.taxes),
      total: Number(d.total),
      status: d.status,
      deliveryAddress: d.delivery_address,
      city: d.city,
      state: d.state,
      postalCode: d.postal_code,
      paymentMethod: d.payment_method,
      userEmail: d.user_email
    }));
  } catch (err) {
    console.error('Exception fetching orders from Supabase:', err);
    return null;
  }
}
