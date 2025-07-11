import Universe from "../core/universe";
import { System } from "./system";

export default class SystemManager {
  

    private universe: Universe;
    
    constructor(universe: Universe) {
        this.universe = universe;       
    }

    public registerSystem(system: System): void {
        system.setUniverse(this.universe);

        this.systems.push(system);
        system.init();
    }   

    public unregisterSystem(system: System): void {
        const index = this.systems.indexOf(system);     
        if (index !== -1) {
            system.destroy();
            this.systems.splice(index, 1);
        }       
    }

    public tick(dt: number): void {
        for (const system of this.systems) {

            system.tick(dt);
        }   
    }

    public getSystems(): System[] {
        return this.systems;
    }

    public getUniverse(): Universe {
        return this.universe;
    }

    public setUniverse(universe: Universe): void {
        this.universe = universe;
        for (const system of this.systems) {
            system.setUniverse(universe);
        }

    }

    public clear(): void {
        for (const system of this.systems) {
            system.destroy();
        }
        this.systems = [];
    }
    
    public recreate(): void {
        this.clear();
    }

    public getSystem<T extends System>(systemClass: { new (...args: any[]): T }): T | undefined {
        return this.systems.find(system => system instanceof systemClass) as T | undefined;
    }

    public hasSystem<T extends System>(systemClass: { new (...args: any[]): T }): boolean {
        return this.systems.some(system => system instanceof systemClass);

    }

    public eachSystem(callback: (system: System) => void): void {
        for (const system of this.systems) {
            callback(system);
        }
    }   

    public getSystemCount(): number {
        return this.systems.length;
    }

    private systems: System[] = [];   
}