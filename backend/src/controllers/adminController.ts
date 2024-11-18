import { Request, Response } from 'express';
import { authenticateAdmin } from '../services/adminService';

class AdminController {
  static loginAdmin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      const token = await authenticateAdmin(email, password);

      if (token) {
        // Token'ı cookie olarak ekliyoruz
        res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 60 * 60 * 1000, // 1 saat geçerli
        });

        res.status(200).json({ message: 'Giriş başarılı!' });
        return;
      }
      res.status(401).json({ message: 'Geçersiz email veya şifre!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Bir hata oluştu!' });
    }
  };

  static logoutAdmin = (req: Request, res: Response): void => {
    try {
      // Cookie'yi temizliyoruz
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.status(200).json({ message: 'Başarıyla çıkış yapıldı.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Bir hata oluştu!' });
    }
  };
}

export default AdminController;
