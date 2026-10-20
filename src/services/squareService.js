export async function fetchSquareConfig() {
  const res = await fetch('/api/square/config');
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Checkout is temporarily unavailable.');
  return data;
}

export async function processSquareCheckout(payload) {
  let res;
  try {
    res = await fetch('/api/square/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    const err = new Error('Network error. Please check your connection and try again — you will not be charged twice.');
    err.retryable = true;
    throw err;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    const err = new Error(data.error || 'Payment failed. Please try again.');
    err.retryable = !!data.retryable;
    throw err;
  }
  return data;
}
