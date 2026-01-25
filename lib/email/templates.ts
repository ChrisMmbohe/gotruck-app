/**
 * Email Templates for GoTruck Platform
 * Welcome emails, verification, notifications
 */

import { UserRole } from "@/lib/auth/roles";

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Welcome email for new users
 */
export function getWelcomeEmail(
  name: string,
  role: UserRole | string,
  dashboardUrl: string
): EmailTemplate {
  const roleInfo = {
    [UserRole.DRIVER]: {
      title: "Welcome Driver!",
      description: "You're all set to start accepting shipments and tracking your deliveries.",
      features: [
        "Real-time GPS tracking",
        "Shipment management",
        "Route optimization",
        "Earnings dashboard",
      ],
    },
    [UserRole.SHIPPER]: {
      title: "Welcome Shipper!",
      description: "You're ready to start shipping across East Africa with confidence.",
      features: [
        "Post shipments instantly",
        "Track deliveries in real-time",
        "Manage your fleet",
        "Analytics & reporting",
      ],
    },
    [UserRole.ADMIN]: {
      title: "Welcome Administrator!",
      description: "Your admin access has been configured.",
      features: [
        "User management",
        "Advanced analytics",
        "System configuration",
        "Compliance monitoring",
      ],
    },
  };

  // Normalize role to uppercase to match UserRole enum
  const normalizedRole = (role as string).toUpperCase() as UserRole;
  const info = roleInfo[normalizedRole] || roleInfo[UserRole.SHIPPER]; // Default to shipper if role not found

  return {
    subject: `Welcome to GoTruck - ${info.title}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #f9fafb;
      padding: 40px 20px;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .features {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .feature-item {
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .feature-item:last-child {
      border-bottom: none;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚛 GoTruck</h1>
    <h2>${info.title}</h2>
  </div>
  
  <div class="content">
    <h2>Welcome, ${name}!</h2>
    <p>${info.description}</p>
    
    <div class="features">
      <h3>What you can do:</h3>
      ${info.features.map(feature => `
        <div class="feature-item">✓ ${feature}</div>
      `).join('')}
    </div>
    
    <center>
      <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
    </center>
    
    <p>If you have any questions, our support team is here to help at <a href="mailto:support@gotruck.app">support@gotruck.app</a>.</p>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} GoTruck - EAC Freight Logistics Platform</p>
    <p>East African Community</p>
  </div>
</body>
</html>
    `,
    text: `
Welcome to GoTruck, ${name}!

${info.description}

What you can do:
${info.features.map(feature => `- ${feature}`).join('\n')}

Get started: ${dashboardUrl}

Questions? Contact us at support@gotruck.app

© ${new Date().getFullYear()} GoTruck - EAC Freight Logistics Platform
    `,
  };
}

/**
 * Document verification notification
 */
export function getDocumentVerificationEmail(
  name: string,
  documentType: string,
  status: 'approved' | 'rejected',
  reason?: string
): EmailTemplate {
  const isApproved = status === 'approved';

  return {
    subject: `Document ${isApproved ? 'Approved' : 'Rejected'} - ${documentType}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Hi ${name},</h2>
  
  <p>Your ${documentType} has been ${status}.</p>
  
  ${!isApproved ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
  
  ${!isApproved ? '<p>Please upload a corrected document in your dashboard.</p>' : ''}
  
  <p>Best regards,<br>GoTruck Team</p>
</body>
</html>
    `,
    text: `
Hi ${name},

Your ${documentType} has been ${status}.

${!isApproved ? `Reason: ${reason}\n\nPlease upload a corrected document in your dashboard.` : ''}

Best regards,
GoTruck Team
    `,
  };
}
