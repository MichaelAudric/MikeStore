// lib/authServer.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function isLoggedInServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}
