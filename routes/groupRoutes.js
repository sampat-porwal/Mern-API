import express from 'express';
const router = express.Router();
import groupController from '../controllers/groupController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

// ROute Level Middleware - To Protect Route
router.use('/creategroup', checkUserAuth)
router.use('/sendmsg', checkUserAuth)
router.use('/getMsgGroup', checkUserAuth)


router.post('/creategroup', groupController.CreateGroup)
router.post('/sendmsg/:id', groupController.sendMsgGroup)
router.get('/getMsgGroup/:id', groupController.getMsgGroup)


export default router