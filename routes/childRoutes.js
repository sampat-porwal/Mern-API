import express from 'express';
const router = express.Router();
import ChildController from '../controllers/childController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

// ROute Level Middleware - To Protect Route
router.use('/addchild', checkUserAuth)
router.use('/getChilds', checkUserAuth)
router.use('/getChild', checkUserAuth)
router.use('/deleteChild', checkUserAuth)
router.use('/updateChild', checkUserAuth)
router.use('/imageupload', checkUserAuth)
// router.use('/changeprofile', checkUserAuth)

router.post('/addchild', ChildController.CreateChild)
router.get('/getChilds', ChildController.getChilds)
router.get('/getChild/:id', ChildController.getChild)
router.patch('/deleteChild/:id', ChildController.softDeleteChild)
router.patch('/updateChild/:id', ChildController.updateChild)
//router.post('/imageupload', ChildController.imageupload)
router.patch('/imageupload/:id', ChildController.imageupload)
// router.post('/login', ParentController.parentLogin)

// // Protected Routes
// router.post('/changepassword', ParentController.changeParentPassword)
// router.post('/changeprofile', ParentController.changeParentProfile)

export default router