import { Request, Response } from 'express';
import { authenticateAdmin } from '../services/adminService';

class AdminController {
  static loginAdmin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      const token = authenticateAdmin(email, password);

      if (token) {
        // Cookie'ye token'ı ekle
        res.cookie('token', token, {
          httpOnly: true,
          secure: false, // Sadece production ortamında secure
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000, // 1 saat
        });
        // Başarılı giriş yanıtı gönderiliyor
        res.status(200).json({ message: 'Giriş başarılı!' });
        return; // Burada return, fonksiyonu bitirmek için kullanılıyor
      }

      // Eğer token null ise, 401 Unauthorized hatası döndür
      res.status(401).json({ message: 'Geçersiz email veya şifre!' });  
    } catch (error) {
      // Hata durumunda 500 yanıtı döndür
      console.error(error);
      res.status(500).json({ message: 'Bir hata oluştu!' });
    }
  };

  // `const` anahtar kelimesi kaldırıldı
  static logoutAdmin = (req: Request, res: Response): void => {
    try {
      res.clearCookie('token'); // Cookie'deki token'ı sil
      res.status(200).json({ message: 'Başarıyla çıkış yapıldı.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Bir hata oluştu!' });
    }
  };
}

export default AdminController;
