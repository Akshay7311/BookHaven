import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

/**
 * Send a professional HTML email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html
    });
    console.log(`[Email] Sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Email Error] Failed to send to ${to}:`, error);
    // Don't throw - we don't want to crash the whole order process if email fails
    return null;
  }
};

/**
 * Generate a professional Order Confirmation HTML
 */
export const generateOrderConfirmationHTML = (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background: #1a1a1a; color: white; padding: 40px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">BOOKHAVEN</h1>
        <p style="margin: 10px 0 0; opacity: 0.8;">Order Confirmation #${order.id.slice(0, 8).toUpperCase()}</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${order.user_name || 'Book Lover'},</h2>
        <p>Thank you for your order! We're getting your books ready for their new home. Below is a summary of your purchase.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
          <thead>
            <tr style="background: #f9f9f9;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">Book</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #eee;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 20px 12px 10px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 20px 12px 10px; text-align: right; font-weight: bold;">₹${Number(order.total_amount).toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 5px 12px; text-align: right; font-weight: bold; color: #10b981;">Shipping:</td>
              <td style="padding: 5px 12px; text-align: right; font-weight: bold; color: #10b981;">FREE</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px 12px 20px; text-align: right; font-size: 20px; font-weight: 900; color: #1a1a1a;">Total:</td>
              <td style="padding: 10px 12px 20px; text-align: right; font-size: 20px; font-weight: 900; color: #1a1a1a;">₹${Number(order.total_amount).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background: #f4f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 30px;">
          <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; color: #2563eb;">Shipping Address</h3>
          <p style="margin: 0; font-size: 14px;">
            ${order.shippingAddress?.fullName || order.user_name}<br>
            ${order.shippingAddress?.street || 'N/A'}<br>
            ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zipCode || ''}<br>
            Phone: ${order.shippingAddress?.phone || 'N/A'}
          </p>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 14px; margin-top: 40px;">
          Need help? Contact us at support@bookhaven.com<br>
          © 2026 BookHaven Bookstore. All rights reserved.
        </p>
      </div>
    </div>
  `;
};

/**
 * Generate an Order Status Update HTML
 */
export const generateStatusUpdateHTML = (order, newStatus) => {
  const statusColors = {
    shipped: '#2563eb',
    delivered: '#10b981',
    cancelled: '#ef4444'
  };

  const statusMessages = {
    shipped: 'Great news! Your books are on their way to you.',
    delivered: 'Your order has been delivered. Enjoy your new reads!',
    cancelled: 'Your order has been cancelled. If you have questions, please reach out.'
  };

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background: ${statusColors[newStatus] || '#1a1a1a'}; color: white; padding: 40px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; text-transform: uppercase;">Order ${newStatus}</h1>
        <p style="margin: 10px 0 0; opacity: 0.8;">Order #${order.id.slice(0, 8).toUpperCase()}</p>
      </div>
      
      <div style="padding: 30px; text-align: center;">
        <h2 style="color: #1a1a1a;">Update for ${order.user_name || 'Book Lover'},</h2>
        <p style="font-size: 18px; color: #444;">${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
        
        <div style="margin: 40px 0;">
          <a href="${process.env.CLIENT_URL}/orders" style="background: ${statusColors[newStatus] || '#1a1a1a'}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Track Your Order</a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 40px;">
          Thank you for choosing BookHaven!<br>
          © 2026 BookHaven Bookstore. All rights reserved.
        </p>
      </div>
    </div>
  `;
};
