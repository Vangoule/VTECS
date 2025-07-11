import { Entity, MaxEntities } from "./entity";

export default class EntityManager {
    public createEntity(): Entity {
        if (this.nextEntityId >= MaxEntities) {
            return -1; // No more entities can be created
        }           
        const newEntity = this.nextEntityId++;
        this.entities.add(newEntity);
        return newEntity;
    }

    public deleteEntity(ent: Entity): boolean {
        if (this.hasEntity(ent)) {
            this.entities.delete(ent);  
            return true;
        } else {
            return false;
        }       
    }

    public hasEntity(ent: Entity): boolean {
        return this.entities.has(ent);
    }

    public getEntities(): Entity[] {
        return Array.from(this.entities);
    }

    public isValidEntity(ent: Entity): boolean {
        return ent < this.nextEntityId;
    }

    public clear(): void {
        this.entities.clear();
        this.nextEntityId = 0;
    }

    public getNextEntityId(): Entity {
        return this.nextEntityId;
    }

    public getEntityCount(): number {
        return this.entities.size;
    }


    private entities: Set<Entity> = new Set();
    private nextEntityId: Entity = 0;

};