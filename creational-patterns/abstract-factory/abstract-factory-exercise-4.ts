interface MessageSender {
    send(to: string, message: string): void;
}

// Fábrica abstracta
interface MessagingFactory {
    createSender(): MessageSender;
}

// Familia concreta
class EmailMessagingFactory implements MessagingFactory {
    createSender(): MessageSender {
        return {
            send(to: string, message: string) {
                console.log(`\nEmail to ${to}: ${message}\n`);
            }
        }
    }
}

class WhatsAppMessagingFactory implements MessagingFactory {
    createSender(): MessageSender {
        return {
            send(to, message) {
                console.log(`\nWhatsApp to ${to}: ${message}\n`);
            },
        }
    }
}

// Cliente
class NotificationDispatcher {
    constructor(private factory: MessagingFactory) { }

    dispatch(to: string, message: string): void {
        const sender = this.factory.createSender();
        sender.send(to, message);
    }
}

function main() {
    const emailMessagingChannel = new EmailMessagingFactory();
    const emailNotification = new NotificationDispatcher(emailMessagingChannel);
    emailNotification.dispatch("Cristian", "Every day is a new opportunity to improve :)");

    const whatsAppChannel = new WhatsAppMessagingFactory();
    const whatsAppNotification = new NotificationDispatcher(whatsAppChannel);
    whatsAppNotification.dispatch("Cristian", "Success is built on consistency, not luck.");
}

main();