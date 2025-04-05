import { UserMongoDAO } from './user.mongo.js';
import { ProductMongoDAO } from './product.mongo.js';
import { CartMongoDAO } from './cart.mongo.js';
import { TicketMongoDAO } from './ticket.mongo.js';

export const UserDao = new UserMongoDAO();
export const ProductsDao = new ProductMongoDAO();
export const CartDao = new CartMongoDAO();
export const TicketDao = new TicketMongoDAO();
