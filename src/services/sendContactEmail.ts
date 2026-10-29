import "dotenv/config";

type ContactEmailData = {
  name: string;
  email: string;
  message: string;
};

// Escape user input before inserting it into HTML
const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char] ?? char;
  });

export const sendContactEmailService = async ({
  name,
  email,
  message,
}: ContactEmailData): Promise<void> => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

  if (!apiKey || !senderEmail || !receiverEmail) {
    throw new Error("Brevo email configuration is missing");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(
    /\r?\n/g,
    "<br />",
  );

  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        sender: {
          name:
            process.env.BREVO_SENDER_NAME || "Food Recipe",
          email: senderEmail,
        },

        // Your email address
        to: [{ email: receiverEmail }],

        // Visitor's email address
        replyTo: {
          name,
          email,
        },

        subject: "New Contact Message - Food Recipe",

        textContent: `
New message from Food Recipe Contact Form

Name: ${name}
Email: ${email}

Message:
${message}
        `.trim(),

        htmlContent: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport"
                content="width=device-width, initial-scale=1.0" />
              <title>New Contact Message</title>
            </head>

            <body style="
              margin: 0;
              padding: 0;
              background-color: #faf9f6;
              font-family: Arial, Helvetica, sans-serif;
              color: #292524;
            ">
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
                        max-width: 520px;
                        background-color: #ffffff;
                        border: 1px solid #e7e5e4;
                        border-radius: 16px;
                      "
                    >
                      <tr>
                        <td style="padding: 32px 32px 20px;">
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
                          ">
                            New Contact Message
                          </h1>

                          <p style="
                            margin: 0;
                            font-size: 14px;
                            line-height: 1.7;
                            color: #78716c;
                          ">
                            Someone sent you a message through
                            your Food Recipe website.
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
                              <td style="padding: 24px;">
                                <p style="
                                  margin: 0 0 8px;
                                  font-size: 12px;
                                  font-weight: 700;
                                  color: #9a3412;
                                ">
                                  SENDER NAME
                                </p>

                                <p style="
                                  margin: 0 0 20px;
                                  font-size: 16px;
                                ">
                                  ${safeName}
                                </p>

                                <p style="
                                  margin: 0 0 8px;
                                  font-size: 12px;
                                  font-weight: 700;
                                  color: #9a3412;
                                ">
                                  EMAIL ADDRESS
                                </p>

                                <p style="
                                  margin: 0 0 20px;
                                  font-size: 16px;
                                  overflow-wrap: anywhere;
                                ">
                                  ${safeEmail}
                                </p>

                                <p style="
                                  margin: 0 0 8px;
                                  font-size: 12px;
                                  font-weight: 700;
                                  color: #9a3412;
                                ">
                                  MESSAGE
                                </p>

                                <p style="
                                  margin: 0;
                                  font-size: 15px;
                                  line-height: 1.8;
                                  white-space: normal;
                                  overflow-wrap: anywhere;
                                ">
                                  ${safeMessage}
                                </p>
                              </td>
                            </tr>
                          </table>
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
                            color: #78716c;
                          ">
                            You can reply directly to this email
                            to contact the sender.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="
                      margin: 20px 0 0;
                      font-size: 12px;
                      color: #78716c;
                    ">
                      &copy; ${new Date().getFullYear()}
                      Food Recipe
                    </p>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }),
    },
  );

  if (!response.ok) {
    console.error(
      "Brevo contact email failed:",
      response.status,
      await response.text(),
    );

    throw new Error("Failed to send contact email");
  }

  const result = (await response.json()) as {
    messageId?: string;
  };

  console.log("Contact email accepted by Brevo:", result.messageId);
};