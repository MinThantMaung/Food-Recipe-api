import "dotenv/config";

export const sendOtpEmail = async (
  email: string,
  otpCode: number,
  expiryMinutes = 3,
): Promise<void> => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    throw new Error("Brevo email configuration is missing");
  }

  const expiryText =
    `${expiryMinutes} ${expiryMinutes === 1 ? "minute" : "minutes"}`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_SENDER_NAME || "Food Recipe",
        email: senderEmail,
      },
      to: [{ email }],
      subject: "Your Food Recipe verification code",
      textContent:
        `Your Food Recipe verification code is ${otpCode}. ` +
        `This code expires in ${expiryText}. ` +
        "If you didn’t request this code, you can ignore this email.",

      htmlContent: `
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
            background-color: #faf9f6;
            font-family: Arial, Helvetica, sans-serif;
            color: #292524;
          ">
            <div style="
              display: none;
              max-height: 0;
              overflow: hidden;
              mso-hide: all;
            ">
              Your verification code is ${otpCode}.
              It expires in ${expiryText}.
            </div>

            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              style="background-color: #faf9f6;"
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
                      border: 1px solid #e7e5e4;
                      border-radius: 16px;
                    "
                  >
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
                          color: #78716c;
                        ">
                          Enter the code below to continue with your
                          Food Recipe request.
                        </p>
                      </td>
                    </tr>

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

                    <tr>
                      <td style="padding: 0 32px 32px;">
                        <p style="
                          margin: 0 0 12px;
                          font-size: 14px;
                          line-height: 1.6;
                          color: #57534e;
                        ">
                          This code expires in <strong>${expiryText}</strong>.
                          Please don't share it with anyone.
                        </p>

                        <p style="
                          margin: 0;
                          font-size: 13px;
                          line-height: 1.7;
                          color: #78716c;
                        ">
                          If you didn't request this code, you can safely
                          ignore this email.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="
                        padding: 20px 32px;
                        border-top: 1px solid #e7e5e4;
                      ">
                        <p style="
                          margin: 0;
                          font-size: 12px;
                          line-height: 1.6;
                          color: #78716c;
                        ">
                          Discover recipes. Save your favorites.
                          Cook something good.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="
                    margin: 20px 0 0;
                    font-size: 12px;
                    color: #78716c;
                  ">
                    &copy; ${new Date().getFullYear()} Food Recipe
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    }),
  });

  if (!response.ok) {
    // Log provider details on the backend only.
    console.error(
      "Brevo email request failed:",
      response.status,
      await response.text(),
    );

    throw new Error("Failed to send verification email");
  }

  const result = (await response.json()) as { messageId?: string };

  console.log("Email accepted by Brevo:", result.messageId);
};