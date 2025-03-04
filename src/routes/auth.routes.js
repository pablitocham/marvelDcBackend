import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.models.js';
import { JWT_SECRET } from '../config/passport.js';
import { cartsModel } from '../models/carts.model.js';

export const routerUser = express.Router();
routerUser.post('/register', async (req, res) => {
    console.log(req.body);
    try {
        const { first_name, last_name, age, email, password } = req.body;
        const userExists = await userModel.findOne({ email });
        if (userExists) { return res.status(400).json({ message: 'El usuario ya existe' }); }

        const newCart = new cartsModel()
        await newCart.save();

        const newUser = new userModel({ first_name, last_name, age, email, password, cart: newCart._id });
        await newUser.save();
        res.redirect('/login')
    } catch (error) {
        res.status(500).json({ message: 'Error de servidor, no se pudo registrar' });
    }
})

routerUser.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).populate('cart');
        if (!user) { return res.status(404).json({ message: 'Usuario no encontrado' }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(401).json({ message: 'Contraseña incorrecta' }); }

        const cart = await cartsModel.findById(user.cart._id)
        if (!cart) {
            const newCart = await cartsModel.create({ products: [], totalPrice: 0 });
            user.cart = newCart._id;
            await user.save();
        };
        const payload = { id: user._id, email: user.email, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, { httpOnly: true }).redirect('/home');
    } catch (error) {
        res.status(500).json({ message: 'Error de servidor' });
    }
})

routerUser.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/login');
})

routerUser.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
})

routerUser.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'No autorizado' });
    res.json(req.user);
})


