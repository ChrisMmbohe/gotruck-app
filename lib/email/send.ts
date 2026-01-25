/**
 * Email Sending Service
 * Handles sending emails via Resend API
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Send email using Resend
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'noreply@gotruck.app',
        to,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Email send error:', error);
      return false;
    }

    const data = await response.json();
    console.log('Email sent successfully:', data.id);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
