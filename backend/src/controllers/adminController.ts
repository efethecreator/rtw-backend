import { Request, Response } from 'express';
import { authenticateAdmin } from '../services/adminService';

class AdminController {
  static loginAdmin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      const token = await authenticateAdmin(email, password);

      if (token) {
        // Token'ı HTTP Header olarak gönderiyoruz
        res.setHeader('Authorization', `Bearer ${token}`);
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
      // Token'ı silmek için client'a talimat veriyoruz
      res.setHeader('Authorization', '');
      res.status(200).json({ message: 'Başarıyla çıkış yapıldı.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Bir hata oluştu!' });
    }
  };
}

export default AdminController;
