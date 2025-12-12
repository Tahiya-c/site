import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationId, status, name, email, date, time, guests, message } = body;

    if (status === 'confirmed') {
      // Send approved email
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your Reservation is Approved! - Club Grille',
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
              .reservation-box { background: #fff9f5; border: 2px solid #ff6b35; padding: 20px; margin: 20px 0; border-radius: 8px; }
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
                  <div class="success-badge">🎉 RESERVATION CONFIRMED</div>
                </div>
                
                <h2 style="color: #ff6b35; text-align: center;">Your Table is Reserved, ${name}!</h2>
                
                <p>Thank you for making a reservation with <strong>Club Grille</strong>! We're excited to welcome you.</p>
                
                <div class="reservation-box">
                  <h3 style="margin-top: 0; color: #ff6b35;">Reservation Details</h3>
                  <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
                    <p style="margin: 10px 0; display: flex; justify-content: space-between;">
                      <span><strong>Name:</strong></span>
                      <span>${name}</span>
                    </p>
                    <p style="margin: 10px 0; display: flex; justify-content: space-between;">
                      <span><strong>Date:</strong></span>
                      <span>${new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                    <p style="margin: 10px 0; display: flex; justify-content: space-between;">
                      <span><strong>Time:</strong></span>
                      <span>${time}</span>
                    </p>
                    <p style="margin: 10px 0; display: flex; justify-content: space-between;">
                      <span><strong>Guests:</strong></span>
                      <span>${guests} people</span>
                    </p>
                    ${message ? `
                      <p style="margin: 10px 0; display: flex; justify-content: space-between;">
                        <span><strong>Special Requests:</strong></span>
                        <span>${message}</span>
                      </p>
                    ` : ''}
                  </div>
                </div>

                <p style="margin-top: 25px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff6b35;">
                  ⚠️ <strong>Please note:</strong> Tables are held for 15 minutes past the reservation time. For any changes or cancellations, please call us at least 2 hours in advance.
                </p>

                <p style="margin-top: 25px;">
                  <strong>What to expect:</strong><br>
                  • Valet parking available<br>
                  • Dress code: Smart casual<br>
                  • Full bar and premium wine selection<br>
                  • Outdoor seating available (weather permitting)
                </p>

                <p style="margin-top: 25px;">
                  <strong>Location & Contact:</strong><br>
                  📍 Rahim's Plaza de CPDL, Chattogram, Bangladesh<br>
                  📞 +880 1234-567890<br>
                  📧 reservations@clubgrille.com
                </p>

                <p style="margin-top: 30px;">We look forward to serving you an unforgettable dining experience!</p>
                
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
    } else if (status === 'cancelled') {
      // Send rejected email
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
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
              .info-badge { background: #ef4444; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 20px 0; }
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
                  <div class="info-badge">⚠️ RESERVATION UPDATE</div>
                </div>
                
                <h2 style="color: #ff6b35; text-align: center;">Reservation Update</h2>
                
                <p>Dear ${name},</p>
                
                <p>We're sorry to inform you that we are unable to accommodate your reservation request for <strong>${new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${time}</strong>.</p>

                <p>This may be due to:</p>
                <ul style="line-height: 1.8; padding-left: 20px;">
                  <li>Full capacity for the requested time</li>
                  <li>Special events or private bookings</li>
                  <li>Maintenance or renovation work</li>
                </ul>

                <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                  <h4 style="margin-top: 0; color: #ff6b35;">Alternative Options</h4>
                  <p>We'd still love to have you dine with us! Please consider:</p>
                  <ul style="line-height: 1.8; padding-left: 20px;">
                    <li><strong>Different time:</strong> Try a slightly earlier or later reservation</li>
                    <li><strong>Different date:</strong> We have availability on other days</li>
                    <li><strong>Walk-in:</strong> We keep some tables available for walk-in guests</li>
                  </ul>
                </div>

                <p style="margin-top: 25px;">
                  <strong>Contact us to explore alternatives:</strong><br>
                  📞 +880 1234-567890<br>
                  📧 reservations@clubgrille.com<br>
                  📍 Rahim's Plaza de CPDL, Chattogram, Bangladesh
                </p>

                <p style="margin-top: 25px;">
                  We sincerely apologize for any inconvenience and hope to have the opportunity to serve you in the future.
                </p>

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
    }

    return NextResponse.json({ 
      success: true, 
      message: `Email sent successfully for ${status} reservation` 
    });
    
  } catch (error) {
    console.error('Error sending reservation email:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send email' 
    }, { status: 500 });
  }
}