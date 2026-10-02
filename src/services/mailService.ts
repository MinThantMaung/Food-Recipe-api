import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (
  email: string,
  otpCode: number,
): Promise<void> => {
  const result = await resend.emails.send({
    from: "Food Recipe <onboarding@resend.dev>",
    to: [email],
    subject: "Your Food Recipe verification code",
    text: `Your Food Recipe verification code is ${otpCode}. This code expires in 1 minute. If you didn’t request this code, you can ignore this email.`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your email</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f8fafc;
        font-family: Arial, Helvetica, sans-serif;
        color: #0f172a;
      ">
        <!-- Preview text shown in the email inbox -->
        <div style="
          display: none;
          max-height: 0;
          overflow: hidden;
          mso-hide: all;
        ">
          Your verification code is ${otpCode}. It expires in 1 minute.
        </div>

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="background-color: #f8fafc;"
        >
          <tr>
            <td align="center" style="padding: 40px 16px;">
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width: 480px;
                  background-color: #ffffff;
                  border: 1px solid #e2e8f0;
                  border-radius: 16px;
                "
              >
                <!-- Brand -->
                <tr>
                  <td style="padding: 32px 32px 24px;">
                    <p style="
                      margin: 0;
                      font-size: 20px;
                      font-weight: 700;
                      color: #ea580c;
                    ">
                      Food Recipe
                    </p>
                  </td>
                </tr>

                <!-- Heading and description -->
                <tr>
                  <td style="padding: 0 32px;">
                    <h1 style="
                      margin: 0 0 12px;
                      font-size: 26px;
                      line-height: 1.3;
                      font-weight: 700;
                    ">
                      Verify your email
                    </h1>

                    <p style="
                      margin: 0;
                      font-size: 15px;
                      line-height: 1.7;
                      color: #64748b;
                    ">
                      You're one step closer to discovering your next
                      favorite recipe. Enter the code below to continue
                      creating your account.
                    </p>
                  </td>
                </tr>

                <!-- Verification code -->
                <tr>
                  <td style="padding: 28px 32px;">
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #fff7ed;
                        border: 1px solid #fed7aa;
                        border-radius: 12px;
                      "
                    >
                      <tr>
                        <td align="center" style="padding: 22px 12px;">
                          <p style="
                            margin: 0 0 10px;
                            font-size: 11px;
                            font-weight: 700;
                            letter-spacing: 2px;
                            color: #9a3412;
                          ">
                            VERIFICATION CODE
                          </p>

                          <p style="
                            margin: 0;
                            font-family: 'Courier New', monospace;
                            font-size: 32px;
                            line-height: 1.2;
                            font-weight: 700;
                            letter-spacing: 6px;
                            color: #c2410c;
                          ">
                            ${otpCode}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Expiry and security -->
                <tr>
                  <td style="padding: 0 32px 32px;">
                    <p style="
                      margin: 0 0 12px;
                      font-size: 14px;
                      line-height: 1.6;
                      color: #475569;
                    ">
                      This code expires in <strong>3 minute</strong>.
                      Please don't share it with anyone.
                    </p>

                    <p style="
                      margin: 0;
                      font-size: 13px;
                      line-height: 1.7;
                      color: #64748b;
                    ">
                      If you didn't request this code, you can safely
                      ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="
                    padding: 20px 32px;
                    border-top: 1px solid #e2e8f0;
                  ">
                    <p style="
                      margin: 0;
                      font-size: 12px;
                      line-height: 1.6;
                      color: #94a3b8;
                    ">
                      Discover recipes. Save your favorites. Cook something good.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="
                margin: 20px 0 0;
                font-size: 12px;
                color: #94a3b8;
              ">
                &copy; ${new Date().getFullYear()} Food Recipe
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
  });

  if (result.error) {
    throw new Error(
      `Failed to send verification email: ${result.error.message}`,
    );
  }

  console.log("Email accepted by Resend:", result.data?.id);
};
