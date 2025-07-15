import { ComponentManager } from "../component/component_manager";
import { Entity } from "../entity/entity";
import { EntityManager } from "../entity/entity_manager";
import { EventManager } from "../event/event_manager";
import { ActionQueue } from "../actions/action_queue";
import { Action } from "../actions/action";

/* The universe holds all the entities and components and gives you the tools to create and destroy them. */
export class Universe {
  constructor(eventManager: EventManager) {
    this.entityManager = new EntityManager();
    this.actionQueue = new ActionQueue();

    this.eventManager = eventManager;
    this.componentManager = new ComponentManager(eventManager);
  }

  /*  Recreates the universe */
  public recreate(): void {
    // Initialize or reset the universe state
    this.entityManager = new EntityManager();
    this.actionQueue = new ActionQueue();
    this.componentManager = new ComponentManager(this.eventManager);
    this.eventManager = new EventManager();
  }

  /* Create a new entity, returning an unused number */
  public createEntity(): Entity {
    return this.entityManager.createEntity();
  }

  /* Destroy an entity, returning a success flag */
  public destroyEntity(ent: Entity): boolean {
    return this.entityManager.deleteEntity(ent);
  }

  /* Check an entity is valid by checking it's within realistic bounds */
  public isValidEntity(ent: Entity): boolean {
    return this.entityManager.isValidEntity(ent);
  }

  /* Ticks the universe */
  public tick(dt: number): void {
    // Process any queued actions
    this.actionQueue.executeActions();
  }

  /* Attach a component to an entity */
  public attachComponent<ComponentType extends object>(
    ent: Entity,
    component: ComponentType,
    immediate: boolean = this.immediate
  ): void {
    if (this.isValidEntity(ent)) {
      if (!immediate) {
        this.actionQueue.addAction(
          new Action(() => {
            this.componentManager.attachComponent(ent, component);
          })
        );
      } else {
        this.componentManager.attachComponent(ent, component);
      }
    }
  }

  /* Detach a component from an entity */
  public detachComponent<ComponentType extends object>(
    ent: Entity,
    componentClass: { new (...args: any[]): ComponentType },
    immediate: boolean = this.immediate
  ): boolean {
    if (this.isValidEntity(ent)) {
      if (!immediate) {
        this.actionQueue.addAction(
          new Action(() => {
            this.componentManager.detachComponent(ent, componentClass);
          })
        );
        return true;
      } else {
        return this.componentManager.detachComponent(ent, componentClass);
      }
    }
    return false;
  }

  /* Check if an entity has a specific component type */
  public hasComponent<ComponentType>(
    componentClass: { new (...args: any[]): ComponentType },
    ent: Entity
  ): boolean {
    const handle = this.componentManager.getHandleFromEntity(
      componentClass,
      ent
    );
    return handle !== undefined;
  }

  /*Loop over each component in a storage*/
  public eachComponent<ComponentType>(
    componentClass: { new (...args: any[]): ComponentType },
    callback: (component: ComponentType, ent: Entity) => void
  ): void {
    const storage =
      this.componentManager.getComponentStorage<ComponentType>(componentClass);
    if (storage) {
      storage.forEachComponent(callback);
    }
  }

  /* Loop over each entityID in the universe, you can then get the components yourself */
  public eachEntity(callback: (ent: Entity) => void): void {
    this.entityManager.getEntities().forEach((ent) => {
      callback(ent);
    });
  }

  public eachEntityWithComponent<ComponentType>(
    componentClass: { new (...args: any[]): ComponentType },
    callback: (component: ComponentType, ent: Entity) => void
  ): void {
    const storage =
      this.componentManager.getComponentStorage<ComponentType>(componentClass);
    if (storage) {
      storage.forEachComponent(callback);
    }
  }

  public eachEntityWithComponents<T extends any[]>(
    componentClasses: { [K in keyof T]: new (...args: any[]) => T[K] },
    callback: (...args: [...components: T, ent: Entity]) => void
  ): boolean {
    let found = false;
    this.eachEntity((ent) => {
      const components = componentClasses.map(
        (componentClass) => this.componentManager.getHandleFromEntity(componentClass, ent)?.component
      );
      if (components.every((c) => c !== undefined)) {
        callback(...(components as T), ent);
        found = true;
      }
    });
    return found;
  }

  /* Returns the Entity Manager */
  getEntityManager(): EntityManager {
    return this.entityManager;
  }

  /* Returns the Component Manager */
  getComponentManager(): ComponentManager {
    return this.componentManager;
  }

  private entityManager: EntityManager;
  private componentManager: ComponentManager;
  private eventManager: EventManager;
  private actionQueue: ActionQueue;

  public immediate = true;
}
