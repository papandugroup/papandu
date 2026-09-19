import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';

interface OrderItem {
  title: string;
  size: string;
  quantity: number;
  price: number;
  colorway?: string;
  image?: string;
}

export interface OrderConfirmationData {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryAddress?: string;
  totalFormatted: string;
  items: OrderItem[];
}

// Resend instance initialized dynamically to safely handle missing keys
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

export async function sendOrderConfirmationEmail(order: OrderConfirmationData) {
  const {
    reference,
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    totalFormatted,
    items,
  } = order;

  // 1. Data Preservation Layer (Local backup log)
  try {
    const backupDir = path.join(process.cwd(), 'data/orders');
    await fs.mkdir(backupDir, { recursive: true });
    await fs.appendFile(
      path.join(backupDir, 'orders.log'),
      JSON.stringify({ timestamp: new Date().toISOString(), ...order }) + '\n'
    );
  } catch (backupError) {
    console.warn('Local order backup write skipped:', backupError);
  }

  // 2. Check Resend Client
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      '⚠️ RESEND_API_KEY is not set. Order confirmation email was skipped. Set RESEND_API_KEY in .env.local to enable live delivery.'
    );
    return {
      success: true,
      simulated: true,
      message: 'Email skipped (RESEND_API_KEY not configured)',
    };
  }

  // 3. Sender configuration
  // Use custom verified domain if set (e.g. orders@papandu.store), otherwise default to onboarding@resend.dev for test
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'PAPANDU <onboarding@resend.dev>';

  // 4. Build Plain Text version for spam deliverability
  const itemsText = items
    .map(
      (item) =>
        `- ${item.title} (${item.colorway ? item.colorway + ', ' : ''}Size: ${item.size}) x${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}`
    )
    .join('\n');

  const textContent = `
PAPANDU — TRIBE OF ONE
ORDER CONFIRMATION: #${reference}

Greetings ${customerName},

Your order has been confirmed and is now being tailored for dispatch from our Lagos atelier.

ORDER DETAILS:
Reference: ${reference}
Recipient: ${customerName}
Phone: ${customerPhone || 'Not provided'}
Delivery Address: ${deliveryAddress || 'Standard Pickup / Lagos'}

ITEMS:
${itemsText}

TOTAL: ${totalFormatted}

DISPATCH & TIMELINE:
- Lagos Express: 24–48 hours doorstep delivery.
- Nationwide Nigeria: 3–5 business days.
- International: 5–7 business days via DHL Express.

Questions or sizing inquiries?
WhatsApp: +234 811 121 0706 (https://wa.me/2348111210706)
Instagram: @papandu.star

BE YOU.
PAPANDU Streetwear · Victoria Island, Lagos, Nigeria
`;

  // 5. Build High-Aesthetics HTML Template
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #222226;">
          <strong style="color: #FFFFFF; font-size: 15px; display: block; letter-spacing: 0.02em;">${item.title}</strong>
          <span style="color: #A29D94; font-size: 13px; font-family: monospace;">
            ${item.colorway ? item.colorway + ' · ' : ''}SIZE: ${item.size} · QTY: ${item.quantity}
          </span>
        </td>
        <td style="padding: 16px 0; border-bottom: 1px solid #222226; text-align: right; color: #FBDC6A; font-family: monospace; font-size: 14px; font-weight: bold; vertical-align: top;">
          ₦${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your PAPANDU Order #${reference}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07080A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ECE8E1;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07080A; padding: 40px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0F1014; border: 1px solid #26272E; border-radius: 4px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #760504; padding: 36px 32px; text-align: center;">
              <div style="font-family: monospace; font-size: 11px; letter-spacing: 0.22em; color: #FBDC6A; margin-bottom: 8px; text-transform: uppercase;">
                ★ TRIBE OF ONE · ORDER CONFIRMED ★
              </div>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 32px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 900;">
                PAPANDU
              </h1>
              <div style="font-family: monospace; font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 6px;">
                ORDER #${reference}
              </div>
            </td>
          </tr>

          <!-- Greeting Body -->
          <tr>
            <td style="padding: 36px 32px 24px;">
              <h2 style="margin: 0 0 14px; font-size: 20px; color: #FFFFFF; font-weight: 600;">
                Welcome to the Tribe, ${customerName}.
              </h2>
              <p style="margin: 0 0 24px; color: #A29D94; font-size: 14px; line-height: 1.65;">
                Your piece has been secured from the <strong style="color: #FFFFFF;">"For The Stars"</strong> release. Our Lagos atelier is now preparing your garments with the utmost attention to craftsmanship and detail.
              </p>

              <!-- Delivery Summary Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #16171D; border: 1px solid #24252D; border-radius: 4px; padding: 18px 20px; margin-bottom: 28px;">
                <tr>
                  <td>
                    <div style="font-family: monospace; font-size: 11px; color: #FBDC6A; letter-spacing: 0.12em; margin-bottom: 6px; text-transform: uppercase;">
                      DISPATCH DESTINATION
                    </div>
                    <div style="color: #FFFFFF; font-size: 14px; font-weight: 500;">
                      ${deliveryAddress || 'Standard Delivery / Lagos'}
                    </div>
                    ${customerPhone ? `<div style="color: #8E8A82; font-size: 12px; font-family: monospace; margin-top: 4px;">Phone: ${customerPhone}</div>` : ''}
                  </td>
                </tr>
              </table>

              <!-- Order Items Table -->
              <div style="font-family: monospace; font-size: 11px; color: #8E8A82; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px solid #222226; padding-bottom: 8px;">
                YOUR SELECTED PIECES
              </div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                ${itemsHtml}
              </table>

              <!-- Total Row -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #16171D; border-top: 1px solid #26272E; padding: 16px 20px; border-radius: 4px; margin-bottom: 32px;">
                <tr>
                  <td style="font-family: monospace; font-size: 13px; color: #A29D94; text-transform: uppercase; letter-spacing: 0.08em;">
                    TOTAL PAID (PAYSTACK)
                  </td>
                  <td style="text-align: right; font-family: monospace; font-size: 18px; color: #FBDC6A; font-weight: 900;">
                    ${totalFormatted}
                  </td>
                </tr>
              </table>

              <!-- Timeline & Next Steps -->
              <div style="background-color: #121318; border-left: 3px solid #760504; padding: 16px 20px; margin-bottom: 32px;">
                <div style="font-family: monospace; font-size: 11px; color: #FFFFFF; letter-spacing: 0.12em; margin-bottom: 6px; text-transform: uppercase;">
                  ESTIMATED DELIVERY TIMELINE
                </div>
                <div style="color: #A29D94; font-size: 13px; line-height: 1.55;">
                  • <strong>Lagos Express:</strong> 24–48 hours doorstep arrival.<br>
                  • <strong>Nationwide Nigeria:</strong> 3–5 business days.<br>
                  • <strong>UK & USA:</strong> 5–7 business days via DHL Express.
                </div>
              </div>

              <!-- Action CTA -->
              <div style="text-align: center; margin-bottom: 16px;">
                <a href="https://wa.me/2348111210706?text=Hello%20Papandu,%20inquiring%20about%20order%20${reference}" style="display: inline-block; background-color: #FBDC6A; color: #090A0E; font-family: monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 2px;">
                  TRACK ORDER VIA WHATSAPP →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #07080A; border-top: 1px solid #1C1D24; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6B6760; font-size: 12px; font-family: monospace;">
                PAPANDU STREETWEAR · VICTORIA ISLAND, LAGOS, NIGERIA
              </p>
              <p style="margin: 0; color: #4A4742; font-size: 11px; font-family: monospace;">
                Questions? WhatsApp: +234 811 121 0706 · Instagram: @papandu.star
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const response = await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: `Order Confirmed #${reference} — PAPANDU`,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      id: response.data?.id,
    };
  } catch (sendError: any) {
    console.error('Failed to send confirmation email via Resend:', sendError);
    return {
      success: false,
      error: sendError?.message || 'Email sending failed',
    };
  }
}
