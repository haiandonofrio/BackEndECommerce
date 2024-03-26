import { SUCCESS, ERROR } from '../commons/errorMessages.js'

import { getDAOS } from "../models/DAO/indexDAO.js";

const { ticketsDao, productsDao, cartDao, usersDao } = getDAOS();

export default class ticketService {
  static async getTicket() {
    const Ticket = await ticketsDao.getTicket();
    return Ticket;
  }

  static async getTicketById(id) {
    if (!id) {
      throw new HttpError('Missing param', ERROR.SERVER_ERROR)
    }
    const Ticket = await ticketsDao.getTicketById(id);
    if (!Ticket) {
      throw new HttpError('Ticket not found', ERROR.CART_NOT_FOUND)
    }
    return Ticket;
  }

  static async createTicket(ticket) {
    const { code, purchaser, products } = ticket;

    if (!code) {
      throw new HttpError('Code not generated', ERROR.SERVER_ERROR);
    }
    const userDB = await usersDao.getUsersByEmail(purchaser);
    if (!userDB) {
      throw new HttpError('User not found', ERROR.SERVER_ERROR);
    }

    if (!products || !Array.isArray(products) || !products.length) {
      throw new HttpError('Products array not valid', ERROR.SERVER_ERROR);
    }

    const newTicket = await ticketsDao.createTicket(ticket);
    return newTicket;
  }

  static async resolveTicket(id, resolution) {
    if (!id || !resolution) {
      throw new HttpError('Missing param', ERROR.SERVER_ERROR);
    }

    if (resolution !== 'completed' && resolution !== 'rejected') {
      throw new HttpError('Wrong value for `resolution` param', ERROR.SERVER_ERROR);
    }

    const Ticket = await ticketsDao.getTicketById(id);
    if (!Ticket) {
      throw new HttpError('Ticket not found', ERROR.CART_NOT_FOUND);
    }

    Ticket.status = resolution;
    await ticketsDao.updateTicket(id, Ticket);
    return Ticket;
  }
}