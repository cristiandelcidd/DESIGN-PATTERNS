// Producto abstracto
interface Transport {
    deliver(): void;
    calculateCost(): number;
}

// Productos concretos
class Truck implements Transport {
    deliver(): void {
        console.log("Delivering by road 🚚");
    }

    calculateCost(): number {
        return 100;
    }
}

class Ship implements Transport {
    deliver(): void {
        console.log("Delivering by sea 🚢");
    }

    calculateCost(): number {
        return 300;
    }
}

class Airplane implements Transport {
    deliver(): void {
        console.log("Delivering by air ✈️");
    }

    calculateCost(): number {
        return 1000;
    }
}

// Creator abstracto
abstract class Logistics {
    // Factory Method
    abstract createTransport(): Transport;

    // Lógica principal
    startDelivery(): void {
        const transport = this.createTransport();

        const cost = transport.calculateCost();

        console.log(`Delivery cost: $${cost}`);

        transport.deliver();

        console.log("----------------------");
    }
}

// Creators concretos
class RoadLogistics extends Logistics {
    createTransport(): Transport {
        return new Truck();
    }
}

class SeaLogistics extends Logistics {
    createTransport(): Transport {
        return new Ship();
    }
}

class AirLogistics extends Logistics {
    createTransport(): Transport {
        return new Airplane();
    }
}

// Cliente
const roadLogistics = new RoadLogistics();
roadLogistics.startDelivery();

const seaLogistics = new SeaLogistics();
seaLogistics.startDelivery();

const airLogistics = new AirLogistics();
airLogistics.startDelivery();