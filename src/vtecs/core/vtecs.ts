import { Universe } from "./universe";
import { System } from "../system/system";
import { SystemManager } from "../system/system_manager";
import { EventManager } from "../event/event_manager";

export class ECS { 

    constructor() {
        this.eventManger = new EventManager();
        this.universe = new Universe(this.eventManger);
        this.systemManager = new SystemManager(this.universe);   
    }

    /* Get the universe, this is used to get the current state of the universe */
    public getUniverse(): Universe {
        return this.universe;
    }

    /* Set the universe, this is used to set the universe for the ECS */
    public setUniverse(universe: Universe): void {
        this.universe = universe;
    }

    /* Tick the universe and all systems */
    public tick(dt: number): void {
        /* Tick the universe, this will be used to apply any mutations to entities or components */
        this.universe.tick(dt);

        /* Tick all systems*/
        this.systemManager.tick(dt);
    }   

    /* Create a new entity */
    public registerSystem(system: System): void {
        this.systemManager.registerSystem(system);
    }      

    /* Unregister a system */
    public unregisterSystem(system: System): void {
        this.systemManager.unregisterSystem(system);
    }   

    /* Get the system manager, this is mostly for debug and testing. */   
    public getSystemManager(): SystemManager {
        return this.systemManager;
    }   

    /*  Get the event manager, this will be used to register and emit events */
    public getEventManager(): EventManager {
        return this.eventManger;
    }
    
    private universe: Universe;
    private systemManager: SystemManager;
    private eventManger: EventManager;
};

