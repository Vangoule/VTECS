
/* The action system is a core part of the VTECS framework, allowing for mutations to the ECS to happen at a specific time, rather than immediately. */
export class Action {

    /* Creates an action with the given action function. */
    constructor(actionFunction: (...args: any[]) => void) {
        this.actionFunction = actionFunction;
        this.actionTime = Date.now();
    }

    /* Executes the action by calling the action function. */
    public execute(): void {
        this.actionFunction();
    }

    /* Sets the time when the action was created. */
    public setTime(time: number): void {
        this.actionTime = time;
    }

    /* Returns the time when the action was created. */
    public getTime(): number {
        return this.actionTime;
    }   

    /*    * The function that will be executed when the action is called. */
    public actionFunction: (...args: any[]) => void;

    /* The time when the action was created. */
    public actionTime: number;

    

}

