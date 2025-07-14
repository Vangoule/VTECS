import { expect, test } from "vitest";

import { ECS } from "../core/vtecs";

import { ComponentHandle } from "../component/component_handle";
import { Universe } from "../core/universe";
import { System } from "../system/system";

import { ComponentAttached, ComponentDetached } from "../event/events";
import { EventManager } from "../event/event_manager";


const ecs = new ECS();
const universe = ecs.getUniverse();

class XYComponent {
  constructor(public x: number, public y: number) {}
}

class XYZComponent {
  constructor(public x: number, public y: number, public z: number) {}
}

class TestSystem extends System {
  init() {
    console.log("TestSystem initialized");
  }
  destroy() {
    console.log("TestSystem destroyed");
  }
  tick(dt: number) {
    this.universe?.eachComponent(XYComponent, (component, ent) => {
      console.log(
        `Entity ${ent} has XYComponent with values: x=${component.x}, y=${component.y}`
      );
      component.x += 1 * dt;
      component.y += 1 * dt;
    });

    console.log(`TestSystem tick with dt: ${dt}`);
  }
  setUniverse(universe: Universe): void {
    super.setUniverse(universe);
    console.log("TestSystem universe set");
  }
}

test("Systems and Events", () => {
  const systemManager = ecs.getSystemManager();

  let e1 = universe.createEntity();
  let e2 = universe.createEntity();

  const eventManager = ecs.getEventManager();
  eventManager.registerListener(ComponentAttached, (event) => { 
    console.log(`Component attached: ${event.entityId} has component ${event.handle.component?.constructor.name}`);
  });

   eventManager.registerListener(ComponentDetached, (event) => { 
    const attachedEvent = event as ComponentDetached<any>;
    console.log(`Component detached: ${attachedEvent.entityId} has component ${attachedEvent.componentClass?.constructor.name}`);
  });

  universe.attachComponent(e1, new XYComponent(5, 10));
  universe.attachComponent(e2, new XYComponent(5, 10));
  universe.attachComponent(e2, new XYZComponent(5, 10, 15));

  const testSystem = new TestSystem();

  ecs.registerSystem(testSystem);
  expect(systemManager.getSystems().length).toBe(1);

  ecs.tick(0.016); // Simulate a frame tick

  universe.eachComponent(XYComponent, (component, ent) => {
    console.log(
      `Entity ${ent} has XYComponent with values: x=${component.x}, y=${component.y}`
    );
    expect(component.x).toBe(5.016);
    expect(component.y).toBe(10.016);
  });

  let xyzComponent = universe
    .getComponentManager()
    .getHandleFromEntity(XYZComponent, e2)?.component;

  expect(xyzComponent).toEqual(new XYZComponent(5, 10, 15));

  ecs.unregisterSystem(testSystem);
  expect(systemManager.getSystems().length).toBe(0);

  universe.detachComponent(e1, XYComponent, true);
  expect(universe.hasComponent(XYComponent, e1)).toBe(false);

  universe.detachComponent(e2, XYZComponent, true);
  expect(universe.hasComponent(XYZComponent, e2)).toBe(false);

  expect(universe.hasComponent(XYComponent, e2)).toBe(true);
});
