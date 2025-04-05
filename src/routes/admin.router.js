import express from 'express';
import passport from 'passport';
import { promoteToAdmin, demoteToUser, getAllUsers } from '../controllers/admin.controller.js';
import { isAdmin } from '../middleware/admin.middleware.js';

export const adminRouter = express.Router();

adminRouter.use(passport.authenticate('jwt', { session: false }));

adminRouter.use(isAdmin);

adminRouter.get('/users', getAllUsers);
adminRouter.put('/users/:userId/promote', promoteToAdmin);
adminRouter.put('/users/:userId/demote', demoteToUser);