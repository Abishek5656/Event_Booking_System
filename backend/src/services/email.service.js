const nodemailer = require('nodemailer');
const logger = require('../core/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendEmail(to, subject, text) {
    try {
      // If credentials aren't provided, just mock the email (for local testing without creds)
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        logger.info(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
        return;
      }

      const info = await this.transporter.sendMail({
        from: `"Event Booking System" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        text,
      });
      logger.info(`Email sent: ${info.messageId}`);
    } catch (error) {
      logger.error('Error sending email', error);
      throw error; // Let BullMQ retry it
    }
  }

  async sendBookingConfirmation(user, event, booking) {
    const subject = `Booking Confirmation: ${event.title}`;
    const text = `Hi ${user.name},\n\nYour booking for ${event.title} is confirmed!\n\nDetails:\nEvent: ${event.title}\nVenue: ${event.venue}\nDate: ${event.eventDate}\nTickets: ${booking.ticketsCount}\n\nThank you for using our service!`;
    await this.sendEmail(user.email, subject, text);
  }

  async sendEventUpdateNotification(user, event) {
    const subject = `Event Update: ${event.title}`;
    const text = `Hi ${user.name},\n\nThere has been an update to an event you are attending.\n\nUpdated Details:\nEvent: ${event.title}\nVenue: ${event.venue}\nDate: ${event.eventDate}\n\nPlease check the portal for more information.`;
    await this.sendEmail(user.email, subject, text);
  }
}

module.exports = new EmailService();
