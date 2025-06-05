import { userModel } from '../../models/user.models.js';
import { UserDTO } from '../../dto/user.dto.js';
import bcrypt from 'bcryptjs';

export class UserMongoDAO {
  async create(userData) {
    try {
      const newUser = await userModel.create(userData);
      return new UserDTO(newUser);
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const users = await userModel.find().lean();
      return users.map(user => new UserDTO(user));
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const user = await userModel.findById(id).lean();
      return user ? new UserDTO(user) : null;
    } catch (error) {
      throw new Error(`Error al obtener usuario por id: ${error.message}`);
    }
  }

  async getByEmail(email) {
    try {
      const user = await userModel.findOne({ email }).populate('cart').lean();
      return user ? new UserDTO(user) : null;
    } catch (error) {
      throw new Error(`Error al obtener usuario por email: ${error.message}`);
    }
  }

  async getRawByEmail(email) {

    try {
      return await userModel.findOne({ email }).populate('cart');
    } catch (error) {
      throw new Error(`Error al obtner procesar usuario por email: ${error.message}`);
    }
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async update(id, userData) {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(id, userData, { new: true }).lean();
      return updatedUser ? new UserDTO(updatedUser) : null;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await userModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
}
