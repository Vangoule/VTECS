import { ComponentHandle } from "./component_handle";
import { ComponentStorage } from "./component_storage";

import { Entity } from "../entity/entity";

import {ComponentAttached, ComponentDetached} from "../event/events";
import { EventManager } from "../event/event_manager";

export class ComponentManager {
  eventManager: EventManager;


  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
  }

  /* Get a handle to a component of a specific type from an entity. If the entity does not have the component, it will return undefined. */
  getHandleFromEntity<ComponentType>(
    componentClass: { new (...args: any[]): ComponentType },
    ent: Entity
  ): ComponentHandle<ComponentType> | undefined {
    const storage = this.getComponentStorage<ComponentType>(componentClass);
    if (storage) {
      return storage.getFromEntity(ent);
    }
    return undefined;
  }

  /* Check if an entity has a component of a specific type. */
  attachComponent<ComponentType extends object>(
    ent: Entity,
    component: ComponentType
  ): ComponentHandle<ComponentType> | undefined {
    const componentClass = component.constructor as {
      new (...args: any[]): ComponentType;
    };
    let storage = this.getComponentStorage<ComponentType>(componentClass);
    
    let handle: ComponentHandle<ComponentType> | undefined;

    if (storage) {
      handle = storage.attach(ent, component);
    } else {
      handle = this.registerComponentStorage<ComponentType>(
        componentClass
      ).attach(ent, component);
    }

    if(handle != undefined) {
      let e = new ComponentAttached<ComponentType>(ent, handle);
      this.eventManager.emit(e);
    }
    

    return handle;
  }

  /* Detach a component from an entity. If the entity does not have the component, it will return false. */
  detachComponent<ComponentType extends object>(
    ent: Entity,
    componentClass: { new (...args: any[]): ComponentType }
  ): boolean {
    const storage = this.getComponentStorage<ComponentType>(componentClass);

    if (storage) {
      let handle = storage.detach(ent);

    if(handle != false) {
      let e = new ComponentDetached<ComponentType>(ent, componentClass);
      this.eventManager.emit(e);
    }

      return handle;
    }
    return false;
  }

  /* Get the component storage for a specific component type. If it does not exist, it will create a new one. */
  getComponentStorage<ComponentType>(componentClass: {
    new (...args: any[]): ComponentType;
  }): ComponentStorage<ComponentType> | null {
    return (
      this.storageMap.get(componentClass) ??
      this.registerComponentStorage<ComponentType>(componentClass)
    );
  }

  /* Register a new component storage for a specific component type. This will create a new storage and return it. */
  registerComponentStorage<ComponentType>(componentClass: {
    new (...args: any[]): ComponentType;
  }): ComponentStorage<ComponentType> {
    let storage = new ComponentStorage<ComponentType>();
    this.storageMap.set(componentClass, storage);
    return storage;
  }

  /* Stores a map of component storages against their component classes. This allows for quick lookup of component storages. The function being passed in is the constructor of the component class. */
  private storageMap = new Map<Function, ComponentStorage<any>>();
  
}
