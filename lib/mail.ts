import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendMail({ to, subject, html, attachments }: { to: string; subject: string; html: string; attachments?: any[] }) {
  try {
    const info = await transporter.sendMail({
      from: `"MeetOff" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

import path from "path";
import fs from "fs";

export async function sendPasswordResetEmail(email: string, code: string) {
  const logoPath = path.join(process.cwd(), "public", "logo-meet-off.svg");
  const logoExists = fs.existsSync(logoPath);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 600px;
          margin: 0 auto;
        }
        .card {
          background-color: #ffffff;
          border-radius: 32px;
          padding: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          text-align: center;
          border: 1px solid #eeeeee;
        }
        .logo {
          width: 180px;
          height: auto;
          margin-bottom: 40px;
        }
        .title {
          color: #000000;
          font-size: 28px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -1px;
          margin-bottom: 16px;
          line-height: 1.1;
        }
        .highlight {
          color: #FF1D55;
        }
        .description {
          color: #666666;
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 40px;
          line-height: 1.5;
        }
        .code-container {
          background-color: #f4f4f4;
          padding: 32px;
          border-radius: 24px;
          border: 2px dashed #0A4742;
          margin-bottom: 40px;
        }
        .code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 30px;
          font-weight: 900;
          color: #0A4742;
          letter-spacing: 12px;
          margin: 0;
        }
        .footer {
          margin-top: 40px;
          color: #999999;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .expiry {
          color: #FF1D55;
          font-weight: 800;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          ${logoExists ? '<img src="cid:logo" alt="MeetOff" class="logo">' : '<h1 style="color: #0A4742; margin-bottom: 40px;">MeetOff</h1>'}
          
          <h1 class="title">Recuperar <span class="highlight">Acesso</span></h1>
          
          <p class="description">
            Olá!<br>
            Você solicitou a recuperação de sua senha.<br>
            Use o código abaixo para validar sua identidade.
          </p>
          
          <div class="code-container">
            <h2 style="font-size: 10px; text-transform: uppercase; color: #999; margin-bottom: 12px; letter-spacing: 2px;">Seu Código de Verificação</h2>
            <div class="code">${code}</div>
          </div>
          
          <p style="font-size: 14px; color: #888;">
            Este código é válido por <span class="expiry">30 minutos</span>.<br>
            Se você não solicitou esta alteração, por favor ignore este e-mail.
          </p>
          
          <div class="footer">
            © MeetOff
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const attachments = [];
  if (logoExists) {
    attachments.push({
      filename: "logo-meet-off.svg",
      path: logoPath,
      cid: "logo",
    });
  }

  return sendMail({
    to: email,
    subject: `Recuperar Acesso - MeetOff`,
    html,
    attachments,
  });
}
