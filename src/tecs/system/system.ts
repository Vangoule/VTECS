import Universe from "../core/universe";

export abstract class System{
    constructor(universe?: Universe) {
        this.universe = universe;
    }   

    abstract init(): void;

    abstract destroy(): void;

    abstract tick(dt: number): void;

    public setUniverse(universe: Universe): void {
        this.universe = universe;
    }   
    
    protected universe?: Universe;

};