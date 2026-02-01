import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
    // If credentials are provided in env, use real email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || '"3dprint" <noreply@3dprint.pl>',
                to,
                subject,
                html,
            });
            console.log(`✅ Email sent to ${to}`);
            return;
        } catch (error) {
            console.error("❌ Email sending failed:", error);
            // Fallback to console log if fails
        }
    }

    // Fallback or Dev mode
    console.log("---------------------------------------------------");
    console.log(`📧 SENDING EMAIL (Simulated - Configure SMTP in .env to send real)`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CONTENT:`);
    console.log(html);
    console.log("---------------------------------------------------");

    // Simulation of delay
    await new Promise(resolve => setTimeout(resolve, 500));
}

export async function sendOrderConfirmation(order: any) {
    const adminEmail = "maslana2121@gmail.com";
    
    // Email to Client
    await sendEmail(
        order.email,
        `Potwierdzenie zamówienia #${order.id.slice(-8)}`,
        `<p>Dziękujemy za zamówienie w 3dprint!</p>
         <p>Twoje zamówienie o wartości ${Number(order.total).toFixed(2)} zł zostało przyjęte.</p>
         <p>Status: <strong>${order.status}</strong></p>
         ${order.paymentMethod === 'BLIK' && order.status === 'PENDING' ? 
            '<p>Prosimy o wykonanie przelewu BLIK na numer telefonu: <strong>+48 515 083 675</strong> (Michał Kaleta). W tytule wpisz numer zamówienia.</p>' : ''}
        `
    );

    // Email to Admin
    await sendEmail(
        adminEmail,
        `Nowe zamówienie #${order.id.slice(-8)} (${order.paymentMethod})`,
        `<p>Nowe zamówienie od ${order.fullName}</p>
         <p>Kwota: ${Number(order.total).toFixed(2)} zł</p>
         <p>Status: ${order.status}</p>
         <p>Metoda płatności: ${order.paymentMethod}</p>
        `
    );
}

export async function sendPaymentConfirmation(order: any) {
    const adminEmail = "maslana2121@gmail.com";

    // Email to Client
    await sendEmail(
        order.email,
        `Płatność przyjęta - zamówienie #${order.id.slice(-8)}`,
        `<p>Twoja płatność została zaksięgowana.</p>
         <p>Zamówienie przekazane do realizacji.</p>
        `
    );
}
