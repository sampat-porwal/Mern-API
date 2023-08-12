import express from 'express';
const router = express.Router();
import ParentController from '../controllers/parentController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

// ROute Level Middleware - To Protect Route
router.use('/changepassword', checkUserAuth)
router.use('/changeprofile', checkUserAuth)

router.post('/register', ParentController.ParentRegistration)
router.post('/login', ParentController.parentLogin)

// Protected Routes
router.post('/changepassword', ParentController.changeParentPassword)
router.post('/changeprofile', ParentController.changeParentProfile)

export default router