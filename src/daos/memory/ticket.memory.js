export class TicketMemoryDAO {
    constructor(ticket = {}) {
        this.id = ticket._id || ticket.id || null;
        this.code = ticket.code || '';
        this.purchaseDate = ticket.purchase_datetime ? new Date(ticket.purchase_datetime).toLocaleString() : 'Unknown';
        this.amount = ticket.amount || 0;
        this.purchaser = ticket.purchaser || '';
        this.status = ticket.status || 'pending';
    }
}
