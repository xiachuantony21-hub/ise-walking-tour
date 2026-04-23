import { SignJWT, jwtVerify } from "jose";

function secret() {
  return new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET ?? "dev-secret-change-in-production-32chars"
  );
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret());
    return true;
  } catch { return false; }
}
