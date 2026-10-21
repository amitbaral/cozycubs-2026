'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

// Module-level store so every component on the page shares the same pages and requests.
const store = { products: [], nextCursor: undefined, loading: false, error: null, done: false };
const listeners = new Set();
let snapshot = { ...store };
let inFlight = null;

function emit() {
  snapshot = { ...store };
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function loadNextPage() {
  if (store.done) return Promise.resolve();
  if (inFlight) return inFlight;

  store.loading = true;
  store.error = null;
  emit();

  const url = store.nextCursor ? `/api/square/products?cursor=${encodeURIComponent(store.nextCursor)}` : '/api/square/products';
  inFlight = fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success || !Array.isArray(data.products)) throw new Error(data.error || 'Could not load designs');
      const seen = new Set(store.products.map((p) => p.id));
      store.products = [...store.products, ...data.products.filter((p) => !seen.has(p.id))];
      store.nextCursor = data.nextCursor || null;
      store.done = !data.nextCursor;
    })
    .catch((err) => {
      store.error = err.message;
    })
    .finally(() => {
      store.loading = false;
      inFlight = null;
      emit();
    });
  return inFlight;
}

async function loadAllPages() {
  while (!store.done && !store.error) await loadNextPage();
}

const serverSnapshot = { ...store };

/** Square catalog products, fetched one page at a time on demand. */
export function useSquareProducts({ loadAll = false } = {}) {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot);

  useEffect(() => {
    if (store.products.length === 0 && !store.done) loadNextPage();
  }, []);

  useEffect(() => {
    if (loadAll) loadAllPages();
  }, [loadAll]);

  const loadMore = useCallback(() => loadNextPage(), []);

  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
    hasMore: !state.done,
    loadMore
  };
}

/** Calls onReach when the sentinel scrolls into view (inside rootRef if given, else the viewport). */
export function useInfiniteScroll(sentinelRef, onReach, { enabled = true, rootRef, rootMargin = '300px' } = {}) {
  useEffect(() => {
    const el = sentinelRef.current;
    if (!enabled || !el) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onReach();
      },
      { root: rootRef?.current || null, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinelRef, onReach, enabled, rootRef, rootMargin]);
}
