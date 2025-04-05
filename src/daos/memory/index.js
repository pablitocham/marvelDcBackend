import { UserMemoryDAO } from './user.memory.js';
import { ProductMemoryDAO } from './product.memory.js';
import { CartMemoryDAO } from './cart.memory.js';
import { TicketMemoryDAO } from './ticket.memory.js';

export const UserDao = new UserMemoryDAO();
export const ProductsDao = new ProductMemoryDAO();
export const CartDao = new CartMemoryDAO();
export const TicketDao = new TicketMemoryDAO();
