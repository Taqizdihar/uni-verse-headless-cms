// =============================================================
// Email Service — Nodemailer SMTP Wrapper (Port 465 / SSL)
// =============================================================
// Sends transactional email notifications using Gmail SMTP over
// implicit SSL/TLS (port 465) with forced IPv4 to avoid
// ENETUNREACH errors on Render's infrastructure.
//
// Credentials: process.env.EMAIL_USER + process.env.EMAIL_PASS
// (Gmail App Password — NOT your regular Google password)
// =============================================================

const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter (lazy-initialized)
let transporter = null;

/**
 * Build (or return cached) Nodemailer SMTP transporter.
 * Uses Port 465 with implicit SSL and forces IPv4 (family: 4).
 */
const getTransporter = () => {
    if (transporter) return transporter;

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT) || 465;
    // Primary: EMAIL_USER / EMAIL_PASS — Fallback: SMTP_USER / SMTP_PASS
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!user || !pass) {
        console.warn('[EMAIL] ⚠ SMTP not configured — check Render Environment Variables (EMAIL_USER and EMAIL_PASS).');
        return null;
    }

    // Reject placeholder credentials
    if (user === 'your-email@gmail.com' || pass === 'your-app-password') {
        console.warn('[EMAIL] ⚠ SMTP not configured — EMAIL_USER and EMAIL_PASS are still set to placeholder values. Update them in Render Environment Variables with a real Gmail + App Password.');
        return null;
    }

    console.log(`[EMAIL] Initializing SMTP transporter: host=${host}, port=${port}, secure=true, family=4, user=${user}`);

    transporter = nodemailer.createTransport({
        host,
        port,
        secure: true,   // Implicit SSL/TLS on port 465
        family: 4,       // Force IPv4 — prevents ENETUNREACH on Render (IPv6 not routable)
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 15000,  // 15s connection timeout
        greetingTimeout: 15000,    // 15s greeting timeout
        socketTimeout: 30000       // 30s socket timeout
    });

    // Verify connection on first use
    transporter.verify()
        .then(() => console.log('[EMAIL] ✓ SMTP connection verified (port 465, SSL, IPv4)'))
        .catch(err => {
            console.error('[EMAIL] ✗ SMTP verification failed:', err.message);
            console.error('[EMAIL] ✗ Full error:', JSON.stringify({
                code: err.code,
                command: err.command,
                responseCode: err.responseCode
            }, null, 2));
            // Reset transporter so next call retries
            transporter = null;
        });

    return transporter;
};

/**
 * Send an email with automatic retry (up to maxRetries attempts).
 * Resets the transporter between retries to force a fresh connection.
 *
 * @param {object} mailOptions  - Nodemailer mail options
 * @param {number} maxRetries   - Number of retry attempts (default: 2)
 * @returns {Promise<{success: boolean, messageId?: string, reason?: string}>}
 */
const sendWithRetry = async (mailOptions, maxRetries = 2) => {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const mailer = getTransporter();
        if (!mailer) {
            return { success: false, reason: 'SMTP not configured' };
        }

        try {
            const info = await mailer.sendMail(mailOptions);
            console.log(`[EMAIL] ✓ Sent to ${mailOptions.to} on attempt ${attempt} (ID: ${info.messageId})`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            lastError = error;
            console.error(`[EMAIL] ✗ Attempt ${attempt}/${maxRetries} failed for ${mailOptions.to}:`, error.message);

            // Reset transporter for a fresh connection on next attempt
            transporter = null;

            // If we have retries left, wait briefly before retrying
            if (attempt < maxRetries) {
                const delay = attempt * 2000; // 2s, 4s, ...
                console.log(`[EMAIL] ⏳ Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // All attempts exhausted
    console.error(`[EMAIL] ✗ All ${maxRetries} attempts failed for ${mailOptions.to}`);
    console.error(`[EMAIL] ✗ Last error details:`, JSON.stringify({
        code: lastError?.code,
        command: lastError?.command,
        responseCode: lastError?.responseCode,
        response: lastError?.response,
        stack: lastError?.stack?.split('\n').slice(0, 3).join(' | ')
    }, null, 2));

    return { success: false, reason: lastError?.message || 'All retry attempts failed' };
};

/**
 * Send an inquiry notification email to the tenant admin.
 *
 * @param {Object} options
 * @param {string} options.adminEmail  - Recipient email (tenant admin, fetched from DB)
 * @param {string} options.senderName  - Name of the person who submitted the inquiry
 * @param {string} options.senderEmail - Email of the sender (used as Reply-To)
 * @param {string} options.subject     - Inquiry subject (optional)
 * @param {string} options.message     - Inquiry message body
 * @param {string} options.siteName    - Tenant site name (for branding)
 * @param {string} options.cmsUrl      - URL to the CMS dashboard
 */
const sendInquiryNotification = async ({ adminEmail, senderName, senderEmail, subject, message, siteName, cmsUrl }) => {
    // Quick guard — if no transporter can be created, skip early
    const mailer = getTransporter();
    if (!mailer) {
        console.log('[EMAIL] Skipping notification — SMTP not configured.');
        return { success: false, reason: 'SMTP not configured' };
    }

    const fromName = process.env.SMTP_FROM_NAME || 'UNI-VERSE CMS';
    const fromEmail = process.env.EMAIL_USER || process.env.SMTP_USER;

    const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        replyTo: `"${senderName}" <${senderEmail}>`,
        to: adminEmail,
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
    };

    // Use retry mechanism (2 attempts with exponential backoff)
    return sendWithRetry(mailOptions, 2);
};

module.exports = { sendInquiryNotification };
