import { ComponentManager } from "../component/component_manager";
import { Entity } from "../entity/entity";
import EntityManager from "../entity/entity_manager";

export default class Universe {
  constructor() {
    this.entityManager = new EntityManager();
    this.componentManager = new ComponentManager();
  }

  public recreate(): void {
    // Initialize or reset the universe state
    this.entityManager = new EntityManager();
    this.componentManager = new ComponentManager();
  }

  public createEntity(): Entity {
    return this.entityManager.createEntity();
  }

  public destroyEntity(ent: Entity): boolean {
    return this.entityManager.deleteEntity(ent);
  }

  public isValidEntity(ent: Entity): boolean {
    return this.entityManager.isValidEntity(ent);
  }

  public tick(dt: number): void {}

  public attachComponent<ComponentType>(
    componentClass: { new (...args: any[]): ComponentType },
    ent: Entity,
    component: ComponentType
  ): void {
    this.componentManager.attachComponent(componentClass, ent, component);
  }

  public detachComponent<ComponentType>(
    componentClass: { new (...args: any[]): ComponentType },
    ent: Entity
  ): boolean {
    return this.componentManager.detachComponent(componentClass, ent);
  }

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
      storage.getComponentArray().forEach((component, ent) => {
        callback(component, ent);
      });
    }
  }

  /* Loop over each entityID in the universe, you can then get the components yourself */
  public eachEntity(callback: (ent: Entity) => void): void {
    this.entityManager.getEntities().forEach((ent) => {
      callback(ent);
    });
  }

  getEntityManager(): EntityManager {
    return this.entityManager;
  }

  getComponentManager(): ComponentManager {
    return this.componentManager;
  }

  private entityManager: EntityManager;
  private componentManager: ComponentManager;
}
