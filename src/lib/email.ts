import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || '');

// ============================================
// TYPES
// ============================================
export interface ReservationData {
  name: string;
  email: string;
  date: Date;
  time: string;
  guests: number;
  message?: string | null;
}

export interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

export interface OrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  paymentMethod?: string;
  bkashNumber?: string;
  bkashTransactionId?: string;
  bkashAmount?: number;
}

// ============================================
// ORDER CONFIRMATION EMAIL
// ============================================
export async function sendOrderConfirmationEmail(order: OrderData) {
  const isBkashPayment = order.paymentMethod === 'bkash';
  
  try {
    await resend.emails.send({
      from: 'Club Grille <onboarding@resend.dev>',
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
            .payment-box { background: #f0f9ff; border: 2px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .bkash-box { background: #fdf2f8; border: 2px solid #ec4899; padding: 20px; margin: 20px 0; border-radius: 8px; }
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
                    <div class="item-price">BDT ${item.price}</div>
                  </div>
                `).join('')}
                <div class="total-row">
                  <span>Total:</span>
                  <span style="color: #ff6b35;">BDT ${order.total}</span>
                </div>
              </div>

              ${isBkashPayment ? `
                <div class="bkash-box">
                  <h3 style="margin-top: 0; color: #ec4899; display: flex; align-items: center; gap: 8px;">
                    <span>📱</span> bKash Payment Details
                  </h3>
                  <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
                    <p style="margin: 8px 0;">
                      <strong>Payment Method:</strong> 
                      <span style="color: #ec4899; font-weight: 600;">bKash</span>
                    </p>
                    <p style="margin: 8px 0;">
                      <strong>Customer bKash Number:</strong> 
                      <span style="font-family: monospace;">${order.bkashNumber || 'N/A'}</span>
                    </p>
                    <p style="margin: 8px 0;">
                      <strong>Transaction ID:</strong> 
                      <span style="font-family: monospace; color: #059669;">${order.bkashTransactionId || 'N/A'}</span>
                    </p>
                    <p style="margin: 8px 0;">
                      <strong>Amount Paid:</strong> 
                      <span style="color: #059669; font-weight: 600;">BDT ${order.bkashAmount?.toFixed(2) || '0.00'}</span>
                    </p>
                  </div>
                  <p style="margin-top: 15px; font-size: 14px; color: #be185d;">
                    ✅ Your payment has been received and is being verified.
                  </p>
                </div>
              ` : `
                <div class="payment-box">
                  <h3 style="margin-top: 0; color: #3b82f6;">💵 Payment Method</h3>
                  <p style="margin: 0;">
                    <strong>Cash on Delivery</strong><br>
                    <span style="font-size: 14px; color: #64748b;">Please keep exact change ready: BDT ${order.total}</span>
                  </p>
                </div>
              `}

              <p style="margin-top: 25px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff6b35;">
                ⏱️ <strong>Estimated preparation time:</strong> 20–30 minutes
              </p>

              <p><strong>What happens next?</strong></p>
              <ul style="line-height: 1.8;">
                <li>Our chefs are preparing your order with the finest ingredients</li>
                <li>You will receive an update when your order is ready for pickup/delivery</li>
                <li>Need help? Call us at +880 1234-567890</li>
              </ul>

              <p style="margin-top: 25px;"><strong>Delivery Address:</strong><br>${order.deliveryAddress}</p>

              <p style="margin-top: 25px;">
                <strong>Contact Information:</strong><br>
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
              <p style="margin: 5px 0;">Mon–Thu: 12PM – 11PM | Fri–Sun: 12PM – 12AM</p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">© 2024 Club Grille. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error };
  }
}

// ============================================
// ORDER COMPLETION EMAIL
// ============================================
export async function sendOrderCompletionEmail(order: OrderData) {
  const ratingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/rate-order/${order.id}`;
  
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: order.customerEmail,
      subject: '🎉 Your Order is Complete - Thank You!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0;
              padding: 0;
              background-color: #f8f9fa;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white;
            }
            .header { 
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
            }
            .logo { 
              font-size: 28px; 
              font-weight: bold; 
              color: #ff6b35; 
              margin-bottom: 10px;
            }
            .content { 
              padding: 40px 30px; 
            }
            .success-badge { 
              background: #4CAF50; 
              color: white; 
              padding: 12px 25px; 
              border-radius: 25px; 
              display: inline-block; 
              margin: 0 auto 25px;
              font-weight: bold;
              text-align: center;
            }
            .order-box { 
              background: #fff9f5; 
              border: 2px solid #ff6b35; 
              padding: 25px; 
              margin: 25px 0; 
              border-radius: 10px;
              max-width: 500px;
              margin-left: auto;
              margin-right: auto;
            }
            .order-item { 
              display: flex; 
              justify-content: space-between; 
              padding: 12px 0; 
              border-bottom: 1px solid #f0f0f0; 
            }
            .order-item:last-child { 
              border-bottom: none; 
            }
            .item-name { 
              font-weight: 500; 
              color: #333; 
            }
            .item-qty { 
              color: #666; 
              font-size: 14px; 
            }
            .item-price { 
              font-weight: bold; 
              color: #ff6b35; 
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 20px 0 0 0; 
              margin-top: 15px; 
              border-top: 2px solid #ff6b35; 
              font-size: 18px; 
              font-weight: bold; 
            }
            .rating-box { 
              background: #fff3e0; 
              border: 2px solid #ff6b35; 
              padding: 30px; 
              margin: 30px auto; 
              border-radius: 10px; 
              text-align: center;
              max-width: 500px;
            }
            .stars-container {
              margin: 25px 0;
              display: flex;
              justify-content: center;
              gap: 10px;
            }
            .star-link {
              font-size: 48px;
              text-decoration: none;
              color: #ddd;
              transition: all 0.3s ease;
              display: inline-block;
            }
            .star-link:hover {
              color: #ff6b35;
              transform: scale(1.2);
            }
            .rating-btn { 
              display: inline-block; 
              background: #ff6b35; 
              color: white; 
              text-decoration: none; 
              padding: 14px 30px; 
              border-radius: 8px; 
              font-weight: bold; 
              margin: 10px;
              border: none;
              cursor: pointer;
              font-size: 16px;
            }
            .cta-btn { 
              display: inline-block; 
              background: #4CAF50; 
              color: white; 
              text-decoration: none; 
              padding: 16px 35px; 
              border-radius: 8px; 
              font-weight: bold; 
              margin-top: 20px;
              border: none;
              cursor: pointer;
              font-size: 16px;
            }
            .footer { 
              background: #1a1a1a; 
              padding: 25px; 
              text-align: center; 
              font-size: 14px; 
              color: #999;
            }
            .centered {
              text-align: center;
              margin: 0 auto;
            }
            h2, h3 {
              text-align: center;
            }
            .highlight {
              color: #ff6b35;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔥 CLUB GRILLE</div>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Where Steaks Meet Style</p>
            </div>
            
            <div class="content">
              <div class="centered">
                <div class="success-badge">🎉 ORDER COMPLETE</div>
              </div>
              
              <h2 style="color: #ff6b35; margin-bottom: 20px;">Thank You, <span class="highlight">${order.customerName}</span>!</h2>
              
              <p class="centered" style="font-size: 16px; max-width: 500px; margin: 0 auto 30px;">
                Your order has been successfully completed and delivered. 
                We hope you enjoyed your meal from <strong>Club Grille</strong>!
              </p>
              
              <div class="order-box">
                <h3 style="margin-top: 0; color: #ff6b35; margin-bottom: 20px;">📦 Order Summary</h3>
                ${order.items.map(item => `
                  <div class="order-item">
                    <div>
                      <div class="item-name">${item.name}</div>
                      <div class="item-qty">Quantity: ${item.qty}</div>
                    </div>
                    <div class="item-price">BDT ${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                `).join('')}
                <div class="total-row">
                  <span>Total:</span>
                  <span style="color: #ff6b35;">BDT ${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div class="rating-box">
                <h3 style="color: #ff6b35; margin-top: 0; margin-bottom: 15px;">⭐ How was your experience?</h3>
                <p style="margin-bottom: 20px; color: #666; font-size: 16px;">
                  Rate your order with one click:
                </p>
                
                <div class="stars-container">
                  <a href="${ratingUrl}?rating=5" class="star-link" data-rating="5">★</a>
                  <a href="${ratingUrl}?rating=4" class="star-link" data-rating="4">★</a>
                  <a href="${ratingUrl}?rating=3" class="star-link" data-rating="3">★</a>
                  <a href="${ratingUrl}?rating=2" class="star-link" data-rating="2">★</a>
                  <a href="${ratingUrl}?rating=1" class="star-link" data-rating="1">★</a>
                </div>
                
                <div style="margin-top: 20px;">
                  <form action="/api/ratings" method="POST" id="rating-form">
                    <input type="hidden" name="orderId" value="${order.id}">
                    <input type="hidden" name="rating" id="rating-value" value="">
                    <input type="hidden" name="feedback" value="">
                    <button type="submit" class="rating-btn">Submit Rating</button>
                  </form>
                </div>
                
                <p style="font-size: 13px; color: #888; margin-top: 20px;">
                  Click a star to rate (5 = Excellent, 1 = Needs improvement)
                </p>
              </div>

              <div class="centered" style="margin: 40px 0;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hungry again? We'd love to serve you!</p>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" class="cta-btn">🍽️ Order Again</a>
              </div>

              <div class="centered" style="max-width: 500px; margin: 40px auto 0; padding-top: 30px; border-top: 1px solid #eee;">
                <p style="margin: 0 0 10px 0;"><strong>📞 Contact Information</strong></p>
                <p style="margin: 5px 0; font-size: 14px;">Phone: +880 1234-567890</p>
                <p style="margin: 5px 0; font-size: 14px;">Email: info@clubgrille.com</p>
                <p style="margin: 5px 0; font-size: 14px;">Location: Rahim's Plaza de CPDL, Chattogram, Bangladesh</p>
              </div>

              <p class="centered" style="margin-top: 40px; font-size: 16px;">
                Thank you for choosing Club Grille. We hope to serve you again soon!<br>
                <strong>The Club Grille Team</strong>
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0 0 10px 0;"><strong>🕒 Opening Hours</strong></p>
              <p style="margin: 5px 0; font-size: 13px;">Mon–Thu: 12PM – 11PM | Fri–Sun: 12PM – 12AM</p>
              <p style="margin-top: 20px; font-size: 12px; color: #777;">© ${new Date().getFullYear()} Club Grille. All rights reserved.</p>
            </div>
          </div>

          <script>
            // Add JavaScript to handle star clicks
            document.addEventListener('DOMContentLoaded', function() {
              const stars = document.querySelectorAll('.star-link');
              const ratingInput = document.getElementById('rating-value');
              const form = document.getElementById('rating-form');
              
              stars.forEach(star => {
                star.addEventListener('click', function(e) {
                  e.preventDefault();
                  const rating = this.getAttribute('data-rating');
                  
                  // Update hidden input
                  ratingInput.value = rating;
                  
                  // Highlight selected stars
                  stars.forEach(s => {
                    s.style.color = s.getAttribute('data-rating') <= rating ? '#ff6b35' : '#ddd';
                  });
                  
                  // Auto-submit form after 1 second
                  setTimeout(() => {
                    form.submit();
                  }, 1000);
                });
              });
            });
          </script>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending completion email:", error);
    return { success: false, error };
  }
}

// ============================================
// RESERVATION APPROVED EMAIL
// ============================================
export async function sendApprovedEmail(reservation: ReservationData) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: reservation.email,
      subject: 'Your Reservation is Approved! - Club Grille',
      html: `
        <h2>Reservation Approved 🎉</h2>
        <p>Hi ${reservation.name},</p>
        <p>Your reservation has been <strong>approved</strong>.</p>

        <p>
          <strong>Date:</strong> ${reservation.date.toDateString()}<br/>
          <strong>Time:</strong> ${reservation.time}<br/>
          <strong>Guests:</strong> ${reservation.guests}
        </p>

        <p>We look forward to serving you!</p>
        <p><strong>— The Club Grille Team</strong></p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending approved email:", error);
    return { success: false, error };
  }
}

// ============================================
// RESERVATION REJECTED EMAIL
// ============================================
export async function sendRejectedEmail(reservation: ReservationData) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: reservation.email,
      subject: 'Reservation Update - Club Grille',
      html: `
        <h2>Reservation Update</h2>
        <p>Hi ${reservation.name},</p>
        <p>We're sorry to inform you that your reservation request could <strong>not be approved</strong>.</p>

        <p>Please contact us if you'd like to choose another time.</p>

        <p><strong>— The Club Grille Team</strong></p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending rejection email:", error);
    return { success: false, error };
  }
}

// ============================================
// ADD THESE EXPORTS IF THEY'RE MISSING
// ============================================
export default {
  sendOrderConfirmationEmail,
  sendOrderCompletionEmail,
  sendApprovedEmail,
  sendRejectedEmail
};