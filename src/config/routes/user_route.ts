import express from 'express';
const router = express.Router();
router.use(express.json());

import authJWT from '../util/authJWT';
import * as userController from '../controller/userController';

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/testtoken', authJWT, userController.test);
router.get('/deleteaccount', authJWT, userController.deleteAccount);
router.post('/checkpassword', authJWT, userController.checkPassword);
router.post('/resetpassword', authJWT, userController.resetPassword);

export default router;