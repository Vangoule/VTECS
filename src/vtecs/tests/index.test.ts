import { expect, test } from "vitest";

import { ECS } from "../core/vtecs";

import { ComponentHandle } from "../component/component_handle";
import { Universe } from "../core/universe";
import { System } from "../system/system";

import { ComponentAttached, ComponentDetached } from "../event/events";
import { EventManager } from "../event/event_manager";
import { Component } from "../component/component";
import { Event } from "../event/event";
import { C } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";

const ecs = new ECS();
const universe = ecs.getUniverse();

class TransformComponent {
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
    this.universe?.eachComponent(TransformComponent, (component, ent) => {
      console.log(
        `Entity ${ent} has TransformComponent with values: x=${component.x}, y=${component.y}`
      );
      component.x += 1 * dt;
      component.y += 1 * dt;
    });

    console.log(`TestSystem tick with dt: ${dt}`);
  }
}

test("Systems and Events", () => {
  const systemManager = ecs.getSystemManager();

  let e1 = universe.createEntity();
  let e2 = universe.createEntity();

  const eventManager = ecs.getEventManager();
  eventManager.registerListener(ComponentAttached, (event) => {
    console.log(
      `Component attached: ${event.entityId} has component ${event.handle.component?.constructor.name}`
    );
  });

  eventManager.registerListener(ComponentDetached, (event) => {
    const attachedEvent = event as ComponentDetached<any>;
    console.log(
      `Component detached: ${attachedEvent.entityId} has component ${attachedEvent.componentClass?.constructor.name}`
    );
  });

  universe.attachComponent(e1, new TransformComponent(5, 10));
  universe.attachComponent(e2, new TransformComponent(5, 10));
  universe.attachComponent(e2, new XYZComponent(5, 10, 15));

  const testSystem = new TestSystem(universe);

  ecs.registerSystem(testSystem);
  expect(systemManager.getSystems().length).toBe(1);

  ecs.tick(0.016); // Simulate a frame tick

  universe.eachComponent(TransformComponent, (component, ent) => {
    console.log(
      `Entity ${ent} has TransformComponent with values: x=${component.x}, y=${component.y}`
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

  universe.detachComponent(e1, TransformComponent);
  universe.detachComponent(e2, TransformComponent);
  expect(universe.hasComponent(TransformComponent, e1)).toBe(false);

  universe.detachComponent(e2, XYZComponent);
  expect(universe.hasComponent(XYZComponent, e2)).toBe(false);

});

test("Custom Events", () => {
  const eventManager = ecs.getEventManager();

  class MouseClicked extends Event {
    constructor(
      public button: number,
      public position: { x: number; y: number }
    ) {
      super();
    }
  }

  eventManager.registerListener(MouseClicked, (event) => {
    console.log(
      `Mouse clicked: button=${event.button}, position=(${event.position.x}, ${event.position.y})`
    );
  });

  const mouseEvent = new MouseClicked(0, { x: 100, y: 200 });
  eventManager.emit(mouseEvent);

  expect(eventManager.hasListener(MouseClicked)).toBe(true);
  expect(eventManager.getListeners(MouseClicked).length).toBe(1);

});

test("Universe Component Access", () => {

  const e1 = universe.createEntity();
  const e2 = universe.createEntity();
  console.log("Entities created:", e1, e2);
  universe.attachComponent(e1, new TransformComponent(1, 2));
  universe.attachComponent(e2, new TransformComponent(3, 4));
  universe.attachComponent(e2, new XYZComponent(5, 6, 7));
  expect(universe.hasComponent(TransformComponent, e1)).toBe(true);
  expect(universe.hasComponent(TransformComponent, e2)).toBe(true);
  expect(universe.hasComponent(XYZComponent, e2)).toBe(true);
  
  universe.tick(0);

  universe.eachComponent(TransformComponent, (component, ent) => {
    console.log(
      `Entity ${ent} has TransformComponent with values: x=${component.x}, y=${component.y}`
    );
    if (ent === e1) {
      expect(component.x).toBe(1);
      expect(component.y).toBe(2);
    } else if (ent === e2) {
      expect(component.x).toBe(3);
      expect(component.y).toBe(4);
    }
  });

  universe.eachEntity((ent) => {});

  universe.eachEntityWithComponent( TransformComponent, (transform, ent) => {

  });

  //For each entity with both a TransformComponent and ScaleComponent
  universe.eachEntityWithComponents(
    [TransformComponent, XYZComponent],
    (transform, xyz, ent) => {    
      console.log(
        `Entity ${ent} has TransformComponent with values: x=${transform.x}, y=${transform.y} and XYZComponent with values: x=${xyz.x}, y=${xyz.y}, z=${xyz.z}`
      );
      if (ent === e2) {
        expect(transform.x).toBe(3);
        expect(transform.y).toBe(4);
        expect(xyz.x).toBe(5);
        expect(xyz.y).toBe(6);
        expect(xyz.z).toBe(7);
      };
    }
  );


});
