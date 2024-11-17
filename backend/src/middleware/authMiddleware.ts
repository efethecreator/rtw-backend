import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Request arayüzünü genişletiyoruz
interface AuthenticatedRequest extends Request {
  user?: JwtPayload; // 'user' özelliği ekliyoruz
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  
  // Cookie'den token'ı alıyoruz
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  

  try {
    
    // Token doğrulama
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // E-posta ortam değişkeni ile eşleşiyor mu?
    if (decoded.email === process.env.MASTER_ADMIN_EMAIL) {
      req.user = decoded; // Doğrulama başarılıysa kullanıcıyı isteğe ekliyoruz
      next(); // Middleware geçişi, kullanıcı doğrulandı
    } else {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Authentication error:", error.message); // Hata mesajını loglayın
    } else {
      console.error("Non-standard error type:", error);
    }
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

export default authMiddleware;
