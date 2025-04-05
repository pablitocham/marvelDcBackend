export class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id || ticket.id;
        this.code = ticket.code;
        this.purchaseDate = new Date(ticket.purchase_datetime).toLocaleString();
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.status = ticket.status;
    }
}