// ─── Productos abstractos ────────────────────────────────────────────────────

interface Button {
    render(): string;
}

interface Input {
    render(): string;
}

// ─── Fábrica abstracta ───────────────────────────────────────────────────────

interface UIFactory {
    createButton(): Button;
    createInput(): Input;
}

// ─── Familia Light Theme ──────────────────────────────────────────────────────

class LightButton implements Button {
    render() {
        return `<button style="background:#fff; color:#000">Click</button>`;
    }
}

class LightInput implements Input {
    render() {
        return `<input style="border:1px solid #ccc; background:#fff" />`;
    }
}

class LightThemeFactory implements UIFactory {
    createButton(): Button { return new LightButton(); }
    createInput(): Input { return new LightInput(); }
}

// ─── Familia Dark Theme ───────────────────────────────────────────────────────

class DarkButton implements Button {
    render() {
        return `<button style="background:#1a1a1a; color:#fff">Click</button>`;
    }
}

class DarkInput implements Input {
    render() {
        return `<input style="border:1px solid #555; background:#2a2a2a" />`;
    }
}

class DarkThemeFactory implements UIFactory {
    createButton(): Button { return new DarkButton(); }
    createInput(): Input { return new DarkInput(); }
}

// ─── Cliente ──────────────────────────────────────────────────────────────────
// El cliente no sabe NI le importa qué familia usa. Solo habla con la interfaz.

function buildForm(factory: UIFactory): void {
    const button = factory.createButton();
    const input = factory.createInput();

    console.log("Form components:");
    console.log(input.render());
    console.log(button.render());
}

// Swap de fábrica sin tocar el cliente
const theme: UIFactory = Math.random() > 0.5
    ? new LightThemeFactory()
    : new DarkThemeFactory();

buildForm(theme);