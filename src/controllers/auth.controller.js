import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.models.js';
import { JWT_SECRET } from '../config/passport.js';
import { cartsModel } from '../models/carts.model.js';
import { mailService } from '../services/mail.service.js';
import { EMAIL_TYPES } from '../common/constants/email-types.js';

export const register = async (req, res) => {
    try {
        const { first_name, last_name, age, email, password } = req.body;
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const newCart = new cartsModel();
        await newCart.save();
        const newUser = new userModel({ first_name, last_name, age, email, password, cart: newCart._id });
        await newUser.save();
        await mailService.sendEmail({ to: email, subject: '¡Bienvenido a Marvel-DC Funkos!', type: EMAIL_TYPES.WELCOME, });
        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ message: 'Error de servidor, no se pudo registrar' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).populate('cart');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        if (!user.cart) {
            console.log("Creando nuevo carrito para usuario:", user.email);
            const newCart = new cartsModel({ products: [], totalPrice: 0 });
            await newCart.save();
            user.cart = newCart._id;
            await user.save();
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            cart: user.cart._id
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, { httpOnly: true }).redirect('/home');
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: 'Error de servidor', error: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token').redirect('/login');
};
export const profile = (req, res) => {
    res.json(req.user);
};

export const current = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    res.json({
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            cart: req.user.cart
        }
    });
};