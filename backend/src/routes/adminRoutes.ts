import express from 'express';
import AdminController from '../controllers/adminController'; // Yeni controller yolu

const router = express.Router();

// Giriş Route'u
router.post('/login', AdminController.loginAdmin);

router.post('/logout', AdminController.logoutAdmin);


export default router;
