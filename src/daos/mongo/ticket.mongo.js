import { ticketModel } from '../../models/ticket.model.js';
import { TicketDTO } from '../../dto/ticket.dto.js';
import { v4 as uuidv4 } from 'uuid';

export class TicketMongoDAO {
  async create(ticketData) {
    try {
      const newTicket = await ticketModel.create({
        code: ticketData.code || uuidv4(),
        amount: ticketData.amount,
        purchaser: ticketData.purchaser,
        purchase_datetime: new Date()
      });
      return new TicketDTO(newTicket);
    } catch (error) {
      throw new Error(`Error creating ticket: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const ticket = await ticketModel.findById(id).lean();
      return ticket ? new TicketDTO(ticket) : null;
    } catch (error) {
      throw new Error(`Error getting ticket by ID: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const tickets = await ticketModel.find().lean();
      return tickets.map(ticket => new TicketDTO(ticket));
    } catch (error) {
      throw new Error(`Error getting all tickets: ${error.message}`);
    }
  }
}