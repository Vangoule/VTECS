import { Entity, MaxEntities } from "./entity";

export class EntityManager {
    /* Create a new entity and return its ID. If the maximum number of entities has been reached, it returns -1. */
  public createEntity(): Entity {
    if (this.nextEntityId >= MaxEntities) {
      return -1; // No more entities can be created
    }
    const newEntity = this.nextEntityId++;
    this.entities.add(newEntity);
    return newEntity;
  }

  /* Delete an entity by its ID. Returns true if the entity was successfully deleted, false if it did not exist. */
  public deleteEntity(ent: Entity): boolean {
    if (this.hasEntity(ent)) {
      this.entities.delete(ent);
      return true;
    } else {
      return false;
    }
  }

  /* Check if an entity exists by its ID. */
  public hasEntity(ent: Entity): boolean {
    return this.entities.has(ent);
  }

  /* Get all entities managed by this EntityManager. */
  public getEntities(): Entity[] {
    return Array.from(this.entities);
  }

  /* Check if an entity ID is valid (i.e., it exists and is within the range of created entities). */
  public isValidEntity(ent: Entity): boolean {
    return ent < this.nextEntityId;
  }

  /* Clear all entities, resetting the EntityManager. */
  public clear(): void {
    this.entities.clear();
    this.nextEntityId = 0;
  }

  /* Get the next entity ID that will be assigned. */
  public getNextEntityId(): Entity {
    return this.nextEntityId;
  }

  /* Get the total number of entities currently managed by this EntityManager. */
  public getEntityCount(): number {
    return this.entities.size;
  }

  private entities: Set<Entity> = new Set();
  private nextEntityId: Entity = 0;
}
