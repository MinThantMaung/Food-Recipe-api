import { OAuth2Client } from "google-auth-library";
import { prismaClient } from "../lib/prisma";

const clientId = process.env.GOOGLE_CLIENT_ID;

type GoogleUser = Awaited<ReturnType<typeof verifyGoogleCredential>>;

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

export const linkedAccount = async (googleUser: any) => {
  return await prismaClient.socialMediaAccount.findFirst({
    where: {
      provider: "GOOGLE",
      providerAccountId: googleUser.googleId,
    },
    include: {
      user: true,
    },
  });
};

export const createGoogleUserWithAccount = async (googleUser: GoogleUser) => {
  return prismaClient.user.create({
    data: {
      email: googleUser.email,
      firstName: googleUser.firstName ?? null,
      lastName: googleUser.lastName ?? null,
      image: googleUser.image ?? null,
      password: null,
      verifiedAt: new Date(),

      socialMediaAccounts: {
        create: {
          provider: "GOOGLE",
          providerAccountId: googleUser.googleId,
        },
      },
    },
  });
};
