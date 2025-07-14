import { Action } from "./action";

export class ActionQueue {
  /* The queue that holds the actions to be executed. These actions are various mutations to the ECS such as adding or removing components,
     this avoids situations where an entity is added by a system mid way through the loop with data that hasn't been initialised by another system. 
     This ensures it will always go through the correct system loop. */
  private queue: Action[] = [];

  /* Adds an action to the queue. */
  public addAction(action: Action): void {
    this.queue.push(action);
  }

  /* Returns the current queue of actions. */
  public executeActions(): void {
    while (this.queue.length > 0) {
      const action = this.queue.shift();
      if (action) {
        action.execute();
      }
    }
  }

  /* Returns the current queue of actions. */
  public clearQueue(): void {
    this.queue = [];
  }
}
