// =============================================================
// Email Service — Resend API Integration
// =============================================================
// Sends transactional email notifications using the Resend HTTP API.
// This completely bypasses Render's SMTP firewall limitations.
//
// Credentials: process.env.RESEND_API_KEY
// =============================================================

const { Resend } = require('resend');
require('dotenv').config();

// Create Resend instance (lazy-initialized)
let resendClient = null;

const getResendClient = () => {
    if (resendClient) return resendClient;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.warn('[EMAIL] ⚠ RESEND_API_KEY not configured in environment variables.');
        return null;
    }

    if (apiKey === 're_123456789_placeholder') {
        console.warn('[EMAIL] ⚠ RESEND_API_KEY is set to a placeholder value. Please provide a real API key from resend.com.');
        return null;
    }

    resendClient = new Resend(apiKey);
    console.log('[EMAIL] ✓ Resend client initialized.');
    
    return resendClient;
};

/**
 * Send an inquiry notification email to the tenant admin using Resend.
 *
 * @param {Object} options
 * @param {string} options.adminEmail  - Recipient email (tenant admin)
 * @param {string} options.senderName  - Name of the person who submitted the inquiry
 * @param {string} options.senderEmail - Email of the sender
 * @param {string} options.subject     - Inquiry subject (optional)
 * @param {string} options.message     - Inquiry message body
 * @param {string} options.siteName    - Tenant site name (for branding)
 * @param {string} options.cmsUrl      - URL to the CMS dashboard
 */
const sendInquiryNotification = async ({ adminEmail, senderName, senderEmail, subject, message, siteName, cmsUrl }) => {
    const resend = getResendClient();
    
    if (!resend) {
        console.log('[EMAIL] Skipping notification — Resend not configured.');
        return { success: false, reason: 'Resend not configured' };
    }

    // Default sender domain provided by Resend for testing, 
    // ideally you should verify a custom domain on Resend.
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'UNI-VERSE <onboarding@resend.dev>';

    try {
        const { data, error } = await resend.emails.send({
            from: fromAddress,
            to: adminEmail,
            reply_to: senderEmail,
            subject: `[UNI-VERSE] Pesan Baru dari ${senderName}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7;">
                    <div style="background: #18181b; padding: 24px 32px;">
                        <h1 style="color: #fbbf24; font-size: 18px; margin: 0; letter-spacing: 0.05em;">UNI-VERSE CMS</h1>
                        <p style="color: #a1a1aa; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 0.1em;">Notifikasi Pesan Masuk</p>
                    </div>
                    <div style="padding: 32px;">
                        <p style="color: #3f3f46; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                            Hai Admin <strong>${siteName || 'Website'}</strong>,<br/>
                            Anda menerima pesan baru dari form kontak website Anda.
                        </p>
                        
                        <div style="background: white; border: 1px solid #e4e4e7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 0; font-weight: 700;">Nama</td>
                                    <td style="color: #18181b; font-size: 14px; padding: 6px 0; font-weight: 600;">${senderName}</td>
                                </tr>
                                <tr>
                                    <td style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 0; font-weight: 700;">Email</td>
                                    <td style="color: #18181b; font-size: 14px; padding: 6px 0;">${senderEmail}</td>
                                </tr>
                                ${subject ? `
                                <tr>
                                    <td style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 0; font-weight: 700;">Subjek</td>
                                    <td style="color: #18181b; font-size: 14px; padding: 6px 0;">${subject}</td>
                                </tr>
                                ` : ''}
                            </table>
                        </div>

                        <div style="background: #fffbeb; border-left: 4px solid #fbbf24; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                            <p style="color: #92400e; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin: 0 0 8px 0;">Pesan</p>
                            <p style="color: #3f3f46; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message.length > 300 ? message.substring(0, 300) + '...' : message}</p>
                        </div>

                        <a href="${cmsUrl || 'https://uni-verse-headless-cms.onrender.com'}/inquiries" 
                           style="display: inline-block; background: #18181b; color: #fbbf24; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.05em;">
                            Buka Dashboard CMS →
                        </a>
                    </div>
                    <div style="background: #f4f4f5; padding: 16px 32px; border-top: 1px solid #e4e4e7;">
                        <p style="color: #a1a1aa; font-size: 11px; margin: 0; text-align: center;">
                            Email ini dikirim otomatis oleh UNI-VERSE CMS. Jangan membalas email ini.
                        </p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error(`[EMAIL] ✗ Failed to send via Resend API to ${adminEmail}:`, error.message);
            return { success: false, reason: error.message };
        }

        console.log(`[EMAIL] ✓ Sent via Resend API to: ${adminEmail} (ID: ${data.id})`);
        return { success: true, messageId: data.id };

    } catch (err) {
        console.error(`[EMAIL] ✗ Exception sending via Resend API to ${adminEmail}:`, err.message);
        return { success: false, reason: err.message };
    }
};

module.exports = { sendInquiryNotification };
