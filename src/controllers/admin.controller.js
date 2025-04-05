import { userModel } from '../models/user.models.js';
export const promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.role = "admin";
        await user.save();

        res.status(200).json({
            message: 'Usuario promovido a administrador exitosamente',
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error al promover usuario:", error);
        res.status(500).json({ message: 'Error de servidor', error: error.message });
    }
};

export const demoteToUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        user.role = "user";
        await user.save();

        res.status(200).json({
            message: 'Administrador degradado a usuario exitosamente',
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error al degradar administrador:", error);
        res.status(500).json({ message: 'Error de servidor', error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name last_name email role');
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: 'Error de servidor', error: error.message });
    }
};