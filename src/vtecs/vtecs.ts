import Universe from "./core/universe";
import { System } from "./system/system";
import SystemManager from "./system/system_manager";

export class ECS { 

    constructor() {
        this.universe = new Universe();
        this.systemManager = new SystemManager(this.universe);
    }

    public getUniverse(): Universe {
        return this.universe;
    }

    public setUniverse(universe: Universe): void {
        this.universe = universe;
    }

    public tick(dt: number): void {
        /* Tick the universe, this will be used to apply any mutations to entities or components */
        this.universe.tick(dt);

        /* Tick all systems*/
        this.systemManager.tick(dt);
    }   

    public registerSystem(system: System): void {
        this.systemManager.registerSystem(system);
    }      

    public unregisterSystem(system: System): void {
        this.systemManager.unregisterSystem(system);
    }   

    public getSystemManager(): SystemManager {
        return this.systemManager;
    }   
    
    universe: Universe;
    systemManager: SystemManager;;
};

