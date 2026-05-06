import os
import aiosmtplib
from email.message import EmailMessage

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")  # или другой хост из .env
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM_EMAIL", "no-reply@supermood.com")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "SUPER MOOD")

async def send_reset_code_email(to_email: str, code: str):
    subject = "Код восстановления пароля — SUPER MOOD"
    
    body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7F1D1D;">Восстановление пароля</h2>
        <p>Вы запросили сброс пароля для вашего аккаунта в SUPER MOOD.</p>
        <p>Ваш код для восстановления пароля:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; border-radius: 12px;">
            {code}
        </div>
        <p>Код действителен в течение 10 минут.</p>
        <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">С заботой о вашем настроении, команда SUPER MOOD</p>
    </body>
    </html>
    """
    
    message = EmailMessage()
    message["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM}>"
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body, subtype="html")
    
    try:
        await aiosmtplib.send(
            message,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASSWORD,
            use_tls=False,
            start_tls=True,
        )
        print(f"✅ Код отправлен на {to_email}")
        return True
    except Exception as e:
        print(f"❌ Ошибка отправки: {e}")
        return False