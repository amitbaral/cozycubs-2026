'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'cozycubs_cart_v1';

const state = {
  items: [],
  isOpen: false,
  hydrated: false
};

const listeners = new Set();
let snapshot = { ...state };

function emit() {
  snapshot = { ...state };
  listeners.forEach((l) => l());
}

function saveToStorage() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch {
    // Ignore storage quota errors
  }
}

function hydrateFromStorage() {
  if (state.hydrated || typeof window === 'undefined') return;
  state.hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        state.items = parsed.filter((i) => i && i.variationId && typeof i.price === 'number');
        emit();
      }
    }
  } catch {
    // Ignore malformed storage
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverSnapshot = { items: [], isOpen: false, hydrated: false };

export function addCartItem(item, { openDrawer = true } = {}) {
  hydrateFromStorage();
  const entry = {
    ...item,
    id: item.id || `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  };
  state.items = [...state.items, entry];
  if (openDrawer) state.isOpen = true;
  saveToStorage();
  emit();
}

export function removeCartItem(itemId) {
  hydrateFromStorage();
  state.items = state.items.filter((i) => i.id !== itemId);
  saveToStorage();
  emit();
}

export function clearCartItems() {
  hydrateFromStorage();
  state.items = [];
  saveToStorage();
  emit();
}

export function setCartOpen(open) {
  state.isOpen = Boolean(open);
  emit();
}

export function useCart() {
  const current = useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot);

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const addItem = useCallback((item, opts) => addCartItem(item, opts), []);
  const removeItem = useCallback((id) => removeCartItem(id), []);
  const clearCart = useCallback(() => clearCartItems(), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const cartCount = current.items.length;
  const cartTotal = current.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return {
    cartItems: current.items,
    cartCount,
    cartTotal,
    isCartOpen: current.isOpen,
    addItem,
    removeItem,
    clearCart,
    openCart,
    closeCart
  };
}
