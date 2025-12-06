import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReservationData {
  name: string;
  email: string;
  date: Date;
  time: string;
  guests: number;
  message?: string | null;
}

interface OrderItem {
  name: string;
  price: number;
  qty: number; // ← Using 'qty' to match your database
}

interface OrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  deliveryAddress: string;
}

// ============================================
// ORDER CONFIRMATION EMAIL (NEW - PREMIUM STYLE)
// ============================================
export async function sendOrderConfirmationEmail(order: OrderData) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: order.customerEmail,
      subject: 'Order Confirmed! - Club Grille',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 24px; font-weight: bold; color: #ff6b35; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .success-badge { background: #4CAF50; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 20px 0; }
            .order-box { background: #fff9f5; border: 2px solid #ff6b35; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .order-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
            .order-item:last-child { border-bottom: none; }
            .item-name { font-weight: 500; color: #333; }
            .item-qty { color: #666; font-size: 14px; }
            .item-price { font-weight: bold; color: #ff6b35; }
            .total-row { display: flex; justify-content: space-between; padding: 20px 0 0 0; margin-top: 15px; border-top: 2px solid #ff6b35; font-size: 18px; font-weight: bold; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔥 CLUB GRILLE</div>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Where Steaks Meet Style</p>
            </div>
            
            <div class="content">
              <div style="text-align: center;">
                <div class="success-badge">✓ ORDER CONFIRMED</div>
              </div>
              
              <h2 style="color: #ff6b35; text-align: center;">Your Order is Being Prepared!</h2>
              
              <p>Dear ${order.customerName},</p>
              
              <p>Thank you for placing your order with <strong>Club Grille</strong>! We're excited to prepare your delicious meal.</p>
              
              <div class="order-box">
                <h3 style="margin-top: 0; color: #ff6b35;">Order Summary</h3>
                ${order.items.map(item => `
                  <div class="order-item">
                    <div>
                      <div class="item-name">${item.name}</div>
                      <div class="item-qty">Quantity: ${item.qty}</div>
                    </div>
                    <div class="item-price">$${item.price}</div>
                  </div>
                `).join('')}
                
                <div class="total-row">
                  <span>Total:</span>
                  <span style="color: #ff6b35;">$${order.total}</span>
                </div>
              </div>
              
              <p style="margin-top: 25px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff6b35;">
                ⏱️ <strong>Estimated preparation time:</strong> 20-30 minutes
              </p>
              
              <p><strong>What happens next?</strong></p>
              <ul style="line-height: 1.8;">
                <li>Our chefs are preparing your order with the finest ingredients</li>
                <li>You'll receive an update when your order is ready for pickup/delivery</li>
                <li>Need to modify your order? Call us ASAP at +880 1234-567890</li>
              </ul>
              
              <p style="margin-top: 25px;"><strong>Contact Information:</strong></p>
              <p style="margin: 5px 0;">
                📞 +880 1234-567890<br>
                📧 info@clubgrille.com<br>
                📍 Rahim's Plaza de CPDL, Chattogram, Bangladesh
              </p>
              
              <p style="margin-top: 30px;">We appreciate your business and can't wait to serve you!</p>
              
              <p style="margin-top: 20px;">
                Best regards,<br>
                <strong>The Club Grille Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Opening Hours</strong></p>
              <p style="margin: 5px 0;">Mon - Thu: 12PM - 11PM | Fri - Sun: 12PM - 12AM</p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">© 2024 Club Grille. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

// ============================================
// RESERVATION EMAILS (UNCHANGED)
// ============================================
export async function sendPendingEmail(reservation: ReservationData) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: reservation.email,
      subject: 'Reservation Request Received - Club Grille',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 24px; font-weight: bold; color: #ff6b35; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
            .highlight { color: #ff6b35; font-weight: bold; }
            .info-box { background: #fff9f5; border-left: 4px solid #ff6b35; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔥 CLUB GRILLE</div>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Where Steaks Meet Style</p>
            </div>
            
            <div class="content">
              <h2 style="color: #ff6b35; margin-top: 0;">Reservation Request Received</h2>
              
              <p>Dear ${reservation.name},</p>
              
              <p>Thank you for choosing <strong>Club Grille</strong> for your dining experience. We have received your reservation request and our team is currently reviewing availability.</p>
              
              <div class="info-box">
                <p style="margin: 0;"><strong>📧 What happens next?</strong></p>
                <p style="margin: 10px 0 0 0;">You will receive a confirmation email at <span class="highlight">${reservation.email}</span> within the next few hours with your reservation status.</p>
              </div>
              
              <p>If you have any questions or need immediate assistance, please don't hesitate to contact us:</p>
              
              <p style="margin: 5px 0;">
                📞 <strong>Phone:</strong> +880 1234-567890<br>
                📧 <strong>Email:</strong> info@clubgrille.com<br>
                📍 <strong>Location:</strong> Rahim's Plaza de CPDL, Chattogram, Bangladesh
              </p>
              
              <p style="margin-top: 30px;">
                Warm regards,<br>
                <strong>The Club Grille Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Opening Hours</strong></p>
              <p style="margin: 5px 0;">Mon - Thu: 12PM - 11PM | Fri - Sun: 12PM - 12AM</p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">© 2024 Club Grille. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending pending email:', error);
    return { success: false, error };
  }
}

export async function sendApprovedEmail(reservation: ReservationData) {
  const formattedDate = new Date(reservation.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: reservation.email,
      subject: 'Reservation Confirmed! - Club Grille',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 24px; font-weight: bold; color: #ff6b35; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .success-badge { background: #4CAF50; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 20px 0; }
            .details-box { background: #fff9f5; border: 2px solid #ff6b35; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔥 CLUB GRILLE</div>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Where Steaks Meet Style</p>
            </div>
            
            <div class="content">
              <div style="text-align: center;">
                <div class="success-badge">✓ RESERVATION CONFIRMED</div>
              </div>
              
              <h2 style="color: #ff6b35; text-align: center;">Your Table is Reserved!</h2>
              
              <p>Dear ${reservation.name},</p>
              
              <p>Excellent news! Your reservation at <strong>Club Grille</strong> has been confirmed. We're delighted to welcome you for an exceptional dining experience.</p>
              
              <div class="details-box">
                <h3 style="margin-top: 0; color: #ff6b35;">Reservation Details</h3>
                <p style="margin: 8px 0;">📅 <strong>Date:</strong> ${formattedDate}</p>
                <p style="margin: 8px 0;">🕐 <strong>Time:</strong> ${reservation.time}</p>
                <p style="margin: 8px 0;">👥 <strong>Guests:</strong> ${reservation.guests} ${reservation.guests === 1 ? 'person' : 'people'}</p>
              </div>
              
              <p><strong>Important Information:</strong></p>
              <ul style="line-height: 1.8;">
                <li>Please arrive 10 minutes before your reservation time</li>
                <li>If you need to modify or cancel, please contact us at least 2 hours in advance</li>
                <li>For parties over 8 guests, please call us directly</li>
              </ul>
              
              <p style="margin-top: 25px;"><strong>Contact Information:</strong></p>
              <p style="margin: 5px 0;">
                📞 +880 1234-567890<br>
                📧 info@clubgrille.com<br>
                📍 Rahim's Plaza de CPDL, Chattogram, Bangladesh
              </p>
              
              <p style="margin-top: 30px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff6b35;">
                💡 <strong>Tip:</strong> Don't forget to check out our chef's special menu when you arrive!
              </p>
              
              <p style="margin-top: 25px;">We're looking forward to serving you an unforgettable meal.</p>
              
              <p style="margin-top: 20px;">
                Best regards,<br>
                <strong>The Club Grille Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Opening Hours</strong></p>
              <p style="margin: 5px 0;">Mon - Thu: 12PM - 11PM | Fri - Sun: 12PM - 12AM</p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">© 2024 Club Grille. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending approved email:', error);
    return { success: false, error };
  }
}

export async function sendRejectedEmail(reservation: ReservationData) {
  const formattedDate = new Date(reservation.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: reservation.email,
      subject: 'Reservation Update - Club Grille',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 24px; font-weight: bold; color: #ff6b35; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .alert-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔥 CLUB GRILLE</div>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Where Steaks Meet Style</p>
            </div>
            
            <div class="content">
              <h2 style="color: #ff6b35;">Regarding Your Reservation Request</h2>
              
              <p>Dear ${reservation.name},</p>
              
              <p>Thank you for your interest in dining at <strong>Club Grille</strong>.</p>
              
              <div class="alert-box">
                <p style="margin: 0;"><strong>⚠️ Reservation Status</strong></p>
                <p style="margin: 10px 0 0 0;">Unfortunately, we are fully booked for your requested date and time:</p>
                <p style="margin: 10px 0 0 0;">📅 ${formattedDate} at ${reservation.time}</p>
              </div>
              
              <p>We sincerely apologize for any inconvenience this may cause. We would love to accommodate you at an alternative time.</p>
              
              <p><strong>Here's what you can do:</strong></p>
              <ul style="line-height: 1.8;">
                <li><strong>Call us directly</strong> at <span style="color: #ff6b35; font-weight: bold;">+880 1234-567890</span></li>
                <li><strong>Visit our website</strong> to check availability</li>
                <li><strong>Email us</strong> at info@clubgrille.com</li>
              </ul>
              
              <p style="margin-top: 30px;"><strong>Contact Us:</strong></p>
              <p style="margin: 5px 0;">
                📞 +880 1234-567890<br>
                📧 info@clubgrille.com<br>
                📍 Rahim's Plaza de CPDL, Chattogram, Bangladesh
              </p>
              
              <p style="margin-top: 25px;">We look forward to welcoming you soon!</p>
              
              <p style="margin-top: 20px;">
                Warm regards,<br>
                <strong>The Club Grille Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Opening Hours</strong></p>
              <p style="margin: 5px 0;">Mon - Thu: 12PM - 11PM | Fri - Sun: 12PM - 12AM</p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">© 2024 Club Grille. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending rejected email:', error);
    return { success: false, error };
  }
}