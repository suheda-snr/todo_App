//import { pool } from '../helpers/db.js';
import { Router } from 'express';
//import { hash, compare } from 'bcrypt';
//import jwt from 'jsonwebtoken';
//const { sign } = jwt
import { postRegistration, postLogin } from '../controllers/userController.js';

const router = Router();

router.post("/register", postRegistration);
router.post("/login", postLogin);

export default router;