import { Router } from 'express';
import { createInterviewController, getInterviewController, getInterviewsController, deleteInterviewController, GetInterviewQuestions } from '../controllers/interviewController';

const router = Router();

// Interview sorularını getirmek için yeni GET route
router.get('/:id/questions', GetInterviewQuestions); // Interview ID ile ilgili soruları getirir

// Mevcut diğer rotalar
router.post('/create', createInterviewController);
router.get('/:id', getInterviewController);
router.get('/', getInterviewsController);
router.delete('/delete/:id', deleteInterviewController);

export default router;