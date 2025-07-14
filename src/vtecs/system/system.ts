import { Universe } from "../core/universe";

export abstract class System{
    /* The universe that this system is associated with. This allows the system to access the universe's entities and components. */
    constructor(universe?: Universe) {
        this.universe = universe;
    }   

    /* Initializes the system, setting up any necessary state or resources. */
    abstract init(): void;

    /* Destroys the system, cleaning up any resources or references. */
    abstract destroy(): void;

    /* Ticks the system, allowing it to perform its logic. */
    abstract tick(dt: number): void;

    /* Sets the universe for this system. This allows the system to access the universe's entities and components. */
    public setUniverse(universe: Universe): void {
        this.universe = universe;
    }   
    
    protected universe?: Universe;

};