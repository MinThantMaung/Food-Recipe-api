import { OAuth2Client } from "google-auth-library";

const clientId = process.env.GOOGLE_CLIENT_ID;

if (!clientId) {
  throw new Error("GOOGLE_CLIENT_ID is required");
}

const googleClient = new OAuth2Client(clientId);

export async function verifyGoogleCredential(credential: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || !payload.email_verified) {
    throw new Error("Invalid Google identity");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    firstName: payload.given_name,
    lastName: payload.family_name,
    image: payload.picture,
  };
}