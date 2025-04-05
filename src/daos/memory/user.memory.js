import { UserDTO } from '../../dto/user.dto.js';
import bcrypt from 'bcrypt';

export class UserMemoryDAO {
  constructor() {
    this.users = [];
    this.currentId = 1;
  }

  async create({ first_name, last_name, email, password, age, role = 'user', cart = null }) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = {
        id: this.currentId++,
        first_name,
        last_name,
        email,
        password: hashedPassword,
        age: Number(age),
        role,
        cart
      };

      this.users.push(newUser);
      return new UserDTO(newUser);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async createUser(userData) {
    return await this.create(userData);
  }

  async getAll() {
    return this.users.map(user => new UserDTO(user));
  }

  async getById(id) {
    const user = this.users.find(u => u.id === parseInt(id));
    return user ? new UserDTO(user) : null;
  }

  async getByEmail(email) {
    const user = this.users.find(u => u.email === email);
    return user ? new UserDTO(user) : null;
  }

  async getRawByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async update(id, userData) {
    const index = this.users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return null;

    const updatedUser = { ...this.users[index], ...userData };
    this.users[index] = updatedUser;
    return new UserDTO(updatedUser);
  }

  async delete(id) {
    const index = this.users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }

  async getAll() {
    return this.users.map(user => new UserDTO(user));
  }

  async getById(id) {
    const user = this.users.find(u => u.id === parseInt(id));
    return user ? new UserDTO(user) : null;
  }

  async getByEmail(email) {
    const user = this.users.find(u => u.email === email);
    return user ? new UserDTO(user) : null;
  }

  async getRawByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async update(id, userData) {
    const index = this.users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return null;

    const updatedUser = { ...this.users[index], ...userData };
    this.users[index] = updatedUser;
    return new UserDTO(updatedUser);
  }

  async delete(id) {
    const index = this.users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }
}