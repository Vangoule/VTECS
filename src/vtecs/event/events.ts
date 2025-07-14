import { Entity } from "../entity/entity";
import { Event }  from "./event";
import { ComponentHandle } from "../component/component_handle";

export class EntityCreated extends Event {
  constructor(public entityId: Entity) {
    super();
  }
}

export class EntityRemoved extends Event {
  constructor(public entityId: Entity) {
    super();
  }
}

export class ComponentAttached<ComponentType> extends Event {
  constructor(
    public entityId: Entity,
    public handle: ComponentHandle<ComponentType>
  ) {
    super();
  }
}

export class ComponentDetached<ComponentType> extends Event {
  constructor(
    public entityId: Entity, 
    public componentClass: { new (...args: any[]): ComponentType }
  ) {
    super();
  }
}
