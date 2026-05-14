// Productos abstractos
interface Button {
    render(): void;
}

interface Checkbox {
    render(): void;
}

interface Modal {
    render(): void;
}

// Fábrica abstracta
interface UIFactory {
    createButton(): Button;
    createCheckbox(): Checkbox;
    createModal(): Modal;
}

// Implementaciones concretas
// Windows
class WindowsButton implements Button {
    render(): void {
        console.log("Rendering Windows Button");
    }
}
class WindowsCheckbox implements Checkbox {
    render(): void {
        console.log("Rendering Windows Checkbox");
    }
}
class WindowsModal implements Modal {
    render(): void {
        console.log("Rendering Windows Modal");
    }
}

// Mac
class MacButton implements Button {
    render(): void {
        console.log("Rendering Mac Button");
    }
}

class MacCheckbox implements Checkbox {
    render(): void {
        console.log("Rendering Mac Checkbox");
    }
}

class MacModal implements Modal {
    render(): void {
        console.log("Rendering Mac Modal");
    }
}

// Linux
class LinuxButton implements Button {
    render(): void {
        console.log("Rendering Linux Button");
    }
}

class LinuxCheckbox implements Checkbox {
    render(): void {
        console.log("Rendering Linux Checkbox");
    }
}

class LinuxModal implements Modal {
    render(): void {
        console.log("Rendering Linux Modal");
    }
}

// Fábricas concretas
class WindowsFactory implements UIFactory {
    createButton(): Button {
        return new WindowsButton();
    }

    createCheckbox(): Checkbox {
        return new WindowsCheckbox();
    }

    createModal(): Modal {
        return new WindowsModal();
    }
}

class MacFactory implements UIFactory {
    createButton(): Button {
        return new MacButton();
    }

    createCheckbox(): Checkbox {
        return new MacCheckbox();
    }

    createModal(): Modal {
        return new MacModal();
    }
}

class LinuxFactory implements UIFactory {
    createButton(): Button {
        return new LinuxButton();
    }

    createCheckbox(): Checkbox {
        return new LinuxCheckbox();
    }

    createModal(): Modal {
        return new LinuxModal();
    }
}

class Application {
    private button: Button;
    private checkbox: Checkbox;
    private modal: Modal;

    constructor(factory: UIFactory) {
        this.button = factory.createButton();
        this.checkbox = factory.createCheckbox();
        this.modal = factory.createModal();
    }

    public renderUI() {
        this.button.render();
        this.checkbox.render();
        this.modal.render();
    }
}

type SupportedOS = 'windows' | 'mac' | 'linux' | (string & {});

class FactoryProvider {
    static create(os: SupportedOS): UIFactory {
        switch (os) {
            case "windows":
                return new WindowsFactory();
            case "mac":
                return new MacFactory();
            case "linux":
                return new LinuxFactory();
            default:
                throw new Error("Unsupported OS");
        }
    }
}

const factory = FactoryProvider.create('windows');

const app = new Application(factory);
app.renderUI();