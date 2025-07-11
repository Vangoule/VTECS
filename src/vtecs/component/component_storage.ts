import { Entity, MaxEntities } from "../entity/entity";
import { Component } from "./component";
import { ComponentHandle } from "./component_handle";

export class ComponentArray<ComponentType> extends Array<ComponentType> {
  constructor(public readonly max: number) {
    super();
  }

  public push(value: ComponentType): number {
    if (super.length !== this.max) {
      return super.push(value);
    }
    throw new Error(
      "There are more instances of this component than there can be entities, something has gone wrong."
    );
  }
}

/* A component storage stores an array of components with map of components against entities. This allows for
	  quick lookup of specific components of a type as they will all be stored tohgether.*/
export class ComponentStorage<ComponentType> {
  public getFromEntity = (
    ent: Entity
  ): ComponentHandle<ComponentType> | undefined => {
    if (this.entityMap.has(ent)) {
      //Attempt to find the component from the entity.
      let index = this.entityMap.get(ent);
      if (index === undefined) return undefined;

      //Return the component
      return new ComponentHandle<ComponentType>(this.components[index]);
    }

    //Return undefined as we didn't find a component
    return undefined;
  };

  public hasComponent = (ent: Entity): Boolean => {
    if (this.entityMap.has(ent)) {
      return true;
    }
    return false;
  };

  public attach = (
    ent: Entity,
    component: ComponentType
  ): ComponentHandle<ComponentType> | undefined => {
    if (this.hasComponent(ent)) {
      //Return an undefined as we aren't adding a component.
      return undefined;
    }

    //Add the component to the array
    let nextComponentSlot = this.numComponents;
    this.components[nextComponentSlot] = component;

    //Update the entity map to map to the component
    this.entityMap.set(ent, nextComponentSlot);

    //Update the component to map it to the entity.
    this.componentMap.set(nextComponentSlot, ent);

    this.numComponents++;

    //Return a handle to this entry in the component array
    return new ComponentHandle<ComponentType>(
      this.components[nextComponentSlot]
    );
  };

  public detach(ent: Entity): boolean {
    if (!this.hasComponent(ent)) {
      //Return an empty handle as we aren't adding a component.
      return false;
    }

    //Get the component that belongs to this entity
    let componentIndex = this.entityMap.get(ent);

    if (componentIndex === undefined) return false;

    let lastComponent = this.numComponents - 1;

    //Replace this component with the final component in the array
    this.components[componentIndex] = this.components[lastComponent];

    //Update the maps to move the old last component to point to the new location.
    let lastComponentsEntity = this.componentMap.get(lastComponent);
    if (lastComponentsEntity === undefined) return false;
    this.entityMap.set(lastComponentsEntity, componentIndex);
    this.componentMap.set(componentIndex, lastComponentsEntity);

    //Remove the values from the map
    this.entityMap.delete(ent);
    this.componentMap.delete(lastComponentsEntity);

    this.numComponents--;

    //Return whether
    return true;
  }

  public clear(): void {
    this.components = new ComponentArray<ComponentType>(MaxEntities);
    this.componentMap.clear();
    this.entityMap.clear();
    this.numComponents = 0;
  }

  public getComponentCount(): number {
    return this.numComponents;
  }

  public getComponentArray(): ComponentArray<ComponentType> {
    return this.components;
  }

  //Used to keep track of all the in use entities
  private componentMap = new Map<number, Entity>();

  //Used to get the component that belongs to an entity
  private entityMap = new Map<Entity, number>();

  /*Create an array to hold all components of this type. This does NOT create a block of contiguous memory like in C, 
    the only thing contiguous here is the array of references itself. */
  private components = new ComponentArray<ComponentType>(MaxEntities);

  //The current number of components
  private numComponents = 0;
}
