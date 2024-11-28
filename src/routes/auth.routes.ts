import { Router } from 'express';
import { getCurrentUserController, loginController, signUpController } from '../controllers/auth.controller';
import { validateSignUpLogin, validateRequest } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router
    .post('/signup', validateSignUpLogin, validateRequest, signUpController)
    .post('/login', validateSignUpLogin, validateRequest, loginController)
    .get('/me', protect, getCurrentUserController);


export default router;