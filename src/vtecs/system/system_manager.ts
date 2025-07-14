import { Universe } from "../core/universe";
import { System } from "./system";

export class SystemManager {
    /* The universe that this system manager is associated with. This allows systems to access the universe's entities and components. */
    private universe: Universe;
    
    /* Constructor for the SystemManager. */
    constructor(universe: Universe) {
        this.universe = universe;       
    }

    /* Register a new system. This will set the universe for the system and initialize it. */
    public registerSystem(system: System): void {
        system.setUniverse(this.universe);

        this.systems.push(system);
        system.init();
    }   

    /* Unregister a system. This will destroy the system and remove it from the list of systems. */
    public unregisterSystem(system: System): void {
        const index = this.systems.indexOf(system);     
        if (index !== -1) {
            system.destroy();
            this.systems.splice(index, 1);
        }       
    }

    /* Ticks  all systems in the manager. This will call the tick method on each system, passing in the delta time. The order is FIFO.*/
    public tick(dt: number): void {
        this.eachSystem(system => {
            system.tick(dt);
        });
    }

    /* Returns the list of systems. */
    public getSystems(): System[] {
        return this.systems;
    }

    /* Returns the universe associated with this system manager. This allows systems to access the universe's entities and components. */
    public getUniverse(): Universe {
        return this.universe;
    }

    /* Sets the universe for this system manager. This allows systems to access the universe's entities and components. */
    public setUniverse(universe: Universe): void {
        this.universe = universe;
        for (const system of this.systems) {
            system.setUniverse(universe);
        }

    }

    /* Clears all systems in the manager. This will destroy each system and remove it from the list of systems. */
    public clear(): void {
        for (const system of this.systems) {
            system.destroy();
        }
        this.systems = [];
    }
    
    /* Recreates the system manager, clearing all systems and resetting the universe. */
    public recreate(): void {
        this.clear();
    }

    /* Get a specific system by its class type. If the system does not exist, it will return undefined. */
    public getSystem<T extends System>(systemClass: { new (...args: any[]): T }): T | undefined {
        return this.systems.find(system => system instanceof systemClass) as T | undefined;
    }

    /* Check if a specific system exists in the manager. */
    public hasSystem<T extends System>(systemClass: { new (...args: any[]): T }): boolean {
        return this.systems.some(system => system instanceof systemClass);

    }

    /* Iterate over each system and execute a callback function. This allows for custom operations on each system. */
    public eachSystem(callback: (system: System) => void): void {
        for (const system of this.systems) {
            callback(system);
        }
    }   

    /* Get the count of systems in the manager. This is useful for debugging or monitoring purposes. */
    public getSystemCount(): number {
        return this.systems.length;
    }

    private systems: System[] = [];   
}