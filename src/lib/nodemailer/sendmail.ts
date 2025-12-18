import { transporter } from "./nodemailer";

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await transporter.sendMail({
    from: `"Bolts & Nuts" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
