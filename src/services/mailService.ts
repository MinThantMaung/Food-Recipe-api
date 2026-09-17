import "dotenv/config";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (
  email: string,
  otpCode: number,
): Promise<void> => {

  const result = await resend.emails.send({
    from: "Food Recipe <onboarding@resend.dev>",
    to: [email],
    subject: "Your Food Recipe verification code",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Email verification</h2>
        <p>Your verification code is:</p>
        <p style="
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 6px;
        ">
          ${otpCode}
        </p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  });


  if (result.error) {
    throw new Error(
      `Failed to send verification email: ${result.error.message}`,
    );
  }

  console.log("Email accepted by Resend:", result.data?.id);
};