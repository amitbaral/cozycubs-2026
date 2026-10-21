import { Resend } from 'resend';

const FROM = process.env.EMAIL_FROM || 'Cozy Cubs Australia <info@cozycubs.au>';
export const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'info@cozycubs.au';

let resend;
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const money = (n) => `$${Number(n).toFixed(2)}`;

function layout(title, body) {
  return `<!doctype html><html><body style="margin:0;background:#F7F4F7;font-family:Arial,Helvetica,sans-serif;color:#445374">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden">
<tr><td style="background:#002169;padding:22px 28px;color:#FFFFFF;font-size:22px;font-weight:bold">Cozy Cubs Australia</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px;color:#002169">${escapeHtml(title)}</h1>
${body}
</td></tr>
<tr><td style="background:#F7F4F7;padding:18px 28px;font-size:12px;color:#6B7590">Cozy Cubs Australia · info@cozycubs.au · 02 7239 5211</td></tr>
</table></td></tr></table></body></html>`;
}

// Never throws: a mail outage must not fail a payment that already went through.
export async function sendEmail({ to, subject, html, replyTo }) {
  const client = getResend();
  if (!client) {
    console.error('Email not sent: RESEND_API_KEY is not configured', { subject });
    return { ok: false, error: 'not_configured' };
  }
  try {
    const { error } = await client.emails.send({ from: FROM, to, subject, html, replyTo });
    if (error) {
      console.error('Resend error:', error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error('Resend request failed:', err);
    return { ok: false, error: err.message };
  }
}

function itemRows(items) {
  return items.map((item) => {
    const details = [
      `${escapeHtml(item.size)} · ${escapeHtml(item.fabric)}`,
      item.backingColor && `Backing: ${escapeHtml(item.backingColor)}`,
      item.customText && `Name: “${escapeHtml(item.customText)}”${item.font ? ` (${escapeHtml(item.font)})` : ''}${item.textPlacement ? ` – ${escapeHtml(item.textPlacement)}` : ''}`
    ].filter(Boolean).join('<br>');
    return `<tr>
<td style="padding:10px 0;border-bottom:1px solid #E6E1EA"><strong style="color:#002169">${escapeHtml(item.patternName)}</strong><br><span style="font-size:13px">${details}</span></td>
<td style="padding:10px 0;border-bottom:1px solid #E6E1EA;text-align:right;vertical-align:top;white-space:nowrap">${money(item.price)}</td>
</tr>`;
  }).join('');
}

function totalsRows(totals) {
  const row = (label, value, strong) =>
    `<tr><td style="padding:4px 0;${strong ? 'font-weight:bold;color:#002169' : ''}">${label}</td><td style="padding:4px 0;text-align:right;${strong ? 'font-weight:bold;color:#002169' : ''}">${value}</td></tr>`;
  return [
    row('Subtotal', money(totals.subtotal)),
    totals.discountAmount > 0 && row(`Discount (${totals.discountPercent}%)`, `-${money(totals.discountAmount)}`),
    row('Tracked shipping', totals.shippingCost === 0 ? 'Free' : money(totals.shippingCost)),
    row('Total paid (AUD)', money(totals.total), true)
  ].filter(Boolean).join('');
}

function addressBlock(buyer) {
  return [buyer.name, buyer.address, `${buyer.city} ${buyer.state} ${buyer.postcode}`, 'Australia']
    .map(escapeHtml).join('<br>');
}

export function orderCustomerEmail({ buyer, items, totals, orderId, receiptUrl }) {
  const body = `
<p>Hi ${escapeHtml(buyer.name.split(' ')[0])},</p>
<p>Thanks for your order! We've received your payment and your custom bedding is now in the queue to be made.
Please allow <strong>3–3.5 weeks</strong> for delivery. We'll email your tracking number as soon as it ships.</p>
<p style="font-size:13px;color:#6B7590">Order reference: <strong>${escapeHtml(orderId)}</strong></p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">${itemRows(items)}</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${totalsRows(totals)}</table>
<h2 style="font-size:16px;color:#002169;margin:24px 0 6px">Shipping to</h2>
<p style="margin:0">${addressBlock(buyer)}</p>
${receiptUrl ? `<p style="margin:24px 0"><a href="${escapeHtml(receiptUrl)}" style="background:#894B8D;color:#FFFFFF;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold">View your receipt</a></p>` : ''}
<p>Questions about your order? Just reply to this email.</p>`;
  return layout('Your order is confirmed', body);
}

export function orderBusinessEmail({ buyer, items, totals, orderId, paymentId }) {
  const artwork = items
    .filter((i) => i.artworkUrl)
    .map((i, n) => `<li><a href="${escapeHtml(i.artworkUrl)}">Customer artwork ${n + 1}</a> (${escapeHtml(i.patternName)}, ${escapeHtml(i.size)})</li>`)
    .join('');
  const body = `
<p><strong>New paid order</strong> – ${money(totals.total)} AUD</p>
<p style="font-size:13px">Square order: <strong>${escapeHtml(orderId)}</strong><br>Square payment: ${escapeHtml(paymentId)}</p>
<h2 style="font-size:16px;color:#002169;margin:20px 0 6px">Customer</h2>
<p style="margin:0">${addressBlock(buyer)}<br>${escapeHtml(buyer.email)}${buyer.phone ? `<br>${escapeHtml(buyer.phone)}` : ''}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">${itemRows(items)}</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${totalsRows(totals)}</table>
${artwork ? `<h2 style="font-size:16px;color:#002169;margin:20px 0 6px">Print files</h2><ul>${artwork}</ul>` : ''}
<p>Manage this order in Square Dashboard → Orders.</p>`;
  return layout('New order received', body);
}

export function simpleEmail(title, paragraphs) {
  return layout(title, paragraphs.map((p) => `<p>${p}</p>`).join(''));
}
