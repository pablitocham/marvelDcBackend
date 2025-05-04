import express from 'express';
import { mockUsers, mockPets } from '../utils/mocks.js';
import { userModel } from '../models/user.models.js';
import { petsModel } from '../models/pets.model.js';

export const mocksRouter = express.Router();

mocksRouter.get('/mockingusers', async (req, res) => {

    try {
        const users = await mockUsers(50);
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar mockingUsers' });
    }
})

mocksRouter.post('/generateData', async (req, res) => {

    try {
        const { users = 0, pets = 0 } = req.body;
        const userData = await mockUsers(users);
        const createdUsers = await userModel.insertMany(userData);
        const petData = await mockPets(pets);
        const createdPets = await petsModel.insertMany(petData);
        res.status(200).json({ users: createdUsers, pets: createdPets });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar datos' });
    }
})