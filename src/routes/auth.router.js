import express from 'express';
import passport from 'passport';
import { register, login, logout, profile, current } from '../controllers/auth.controller.js';

export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/logout', logout);
authRouter.get('/profile', passport.authenticate('jwt', { session: false }), profile);
authRouter.get('/current', passport.authenticate('jwt', { session: false }), current);