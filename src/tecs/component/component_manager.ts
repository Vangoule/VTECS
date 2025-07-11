import { Component } from "./component";
import { ComponentHandle } from "./component_handle";
import { ComponentStorage } from "./component_storage";

import { Entity } from "../entity/entity";

export class ComponentManager {
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

  attachComponent<ComponentType>(
    componentClass: { new (...args: any[]): ComponentType },
    ent: Entity,
    component: ComponentType
  ): ComponentHandle<ComponentType> | undefined {
    let storage = this.getComponentStorage<ComponentType>(componentClass);
    if (storage) {
      return storage.attach(ent, component);
    } else {
      this.registerComponentStorage<ComponentType>(componentClass).attach(
        ent,
        component
      );
    }
  }

  detachComponent<ComponentType>(
    componentClass: { new (...args: any[]): ComponentType },
    ent: Entity
  ): boolean {
    const storage = this.getComponentStorage<ComponentType>(componentClass);
    if (storage) {
      return storage.detach(ent);
    }
    return false;
  }

  getComponentStorage<ComponentType>(componentClass: {
    new (...args: any[]): ComponentType;
  }): ComponentStorage<ComponentType> | null {
    return (
      this.storageMap.get(componentClass) ??
      this.registerComponentStorage<ComponentType>(componentClass)
    );
  }

  registerComponentStorage<ComponentType>(componentClass: {
    new (...args: any[]): ComponentType;
  }): ComponentStorage<ComponentType> {
    let storage = new ComponentStorage<ComponentType>();
    this.storageMap.set(componentClass, storage);
    return storage;
  }

  private storageMap = new Map<Function, ComponentStorage<any>>();
}
