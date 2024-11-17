import { Router } from 'express';
import { createUserController , getUserByIdController } from '../controllers/userController';

const router = Router();

// Define route for creating a user
router.post('/create', createUserController);

router.get('/:userId', getUserByIdController);

export default router;
