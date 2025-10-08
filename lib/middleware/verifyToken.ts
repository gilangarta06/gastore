import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

export function verifyToken(req: Request): DecodedToken | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error("❌ Invalid token:", error);
    return null;
  }
}
