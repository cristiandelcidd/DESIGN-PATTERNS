// ─── Productos abstractos ────────────────────────────────────────────────────

interface AppNotification {
    send(message: string): void;
}

interface NotificationFormatter {
    format(message: string): string;
}

// ─── Fábrica abstracta ───────────────────────────────────────────────────────

interface NotificationFactory {
    createNotification(): AppNotification;
    createFormatter(): NotificationFormatter;
}

// ─── Familia Email ────────────────────────────────────────────────────────────

class EmailFormatter implements NotificationFormatter {
    format(message: string): string {
        return [
            `Subject: System Alert`,
            `─────────────────────`,
            message,
            `─────────────────────`,
            `Sent by NotificationSystem v1.0`,
        ].join("\n");
    }
}

class EmailNotification implements AppNotification {
    send(message: string): void {
        console.log(`📧 [EMAIL] Sending to user@example.com:\n${message}\n`);
    }
}

class EmailFactory implements NotificationFactory {
    createNotification(): AppNotification { return new EmailNotification(); }
    createFormatter(): NotificationFormatter { return new EmailFormatter(); }
}

// ─── Familia Push ─────────────────────────────────────────────────────────────

class PushFormatter implements NotificationFormatter {
    format(message: string): string {
        const truncated = message.length > 100
            ? message.slice(0, 97) + "..."
            : message;
        return `🔔 ${truncated}`;
    }
}

class PushNotification implements AppNotification {
    send(message: string): void {
        console.log(`📱 [PUSH] Sending to device token abc123:\n${message}\n`);
    }
}

class PushFactory implements NotificationFactory {
    createNotification(): AppNotification { return new PushNotification(); }
    createFormatter(): NotificationFormatter { return new PushFormatter(); }
}

// ─── Familia SMS (Bonus) ──────────────────────────────────────────────────────

class SMSFormatter implements NotificationFormatter {
    format(message: string): string {
        // SMS tiene límite de 160 chars
        const truncated = message.length > 160
            ? message.slice(0, 157) + "..."
            : message;
        return `[SMS] ${truncated}`;
    }
}

class SMSNotification implements AppNotification {
    send(message: string): void {
        console.log(`💬 [SMS] Sending to +1-555-0100:\n${message}\n`);
    }
}

class SMSFactory implements NotificationFactory {
    createNotification(): AppNotification { return new SMSNotification(); }
    createFormatter(): NotificationFormatter { return new SMSFormatter(); }
}

// ─── Cliente ──────────────────────────────────────────────────────────────────
// No sabe nada de Email, Push ni SMS. Solo habla con las interfaces.

function sendAlert(factory: NotificationFactory, rawMessage: string): void {
    const formatter = factory.createFormatter();
    const notification = factory.createNotification();

    const formatted = formatter.format(rawMessage);
    notification.send(formatted);
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const message = "Your account login was detected from a new device in San Pedro Sula, HN.";

const factories: NotificationFactory[] = [
    new EmailFactory(),
    new PushFactory(),
    new SMSFactory(),
];

for (const factory of factories) {
    sendAlert(factory, message);
}