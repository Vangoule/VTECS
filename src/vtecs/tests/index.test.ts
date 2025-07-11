import { expect, test } from "vitest";

import { TECS } from "../vtecs";

import { Component } from "../component/component";

import { ComponentStorage } from "../component/component_storage";
import { ComponentHandle } from "../component/component_handle";

import {ComponentManager} from "../component/component_manager";
import Universe from "../core/universe";
import { System } from "../system/system";


const manager = new ComponentManager();

class XYZComponent extends Component {
  constructor(public x : number, public y : number, public z : number) {
    super();
  }
}

class XYComponent extends Component {
  constructor(public x : number, public y : number) {
    super();
  }
}

let myXYComponent = new XYComponent(1, 2);
let myXYZComponent = new XYZComponent(2, 3, 1);

test("Components", () => {
  manager.attachComponent(XYComponent, 0, myXYComponent);
  manager.attachComponent(XYZComponent, 0, myXYZComponent);

  const XYStorage = manager.getComponentStorage(XYComponent);
  const XYZStorage = manager.getComponentStorage(XYZComponent);

  expect(XYStorage?.getFromEntity(0)).toStrictEqual(new ComponentHandle<XYComponent>(myXYComponent));
  expect(XYZStorage?.getFromEntity(0)).toStrictEqual(new ComponentHandle<XYZComponent>(myXYZComponent));

  expect(manager.getHandleFromEntity(XYComponent, 0)).toStrictEqual(new ComponentHandle<XYComponent>(myXYComponent));
  expect(manager.getHandleFromEntity(XYZComponent, 0)).toStrictEqual(new ComponentHandle<XYZComponent>(myXYZComponent));

  manager.detachComponent(XYComponent, 0);

  expect(manager.getHandleFromEntity(XYComponent, 0)).toBeUndefined();
});

test("Universe", () => {
  const tecs = new TECS();
  const universe = tecs.getUniverse();

  let e1 = universe.createEntity();
  let e2 = universe.createEntity();

  expect(universe.getEntityManager().getEntityCount()).toBe(2);

  universe.attachComponent(XYComponent, e1, new XYComponent(5, 10));
  universe.attachComponent(XYZComponent, e2, new XYZComponent(1, 2, 3));

  expect(universe.hasComponent(XYComponent, e1)).toBe(true);
  expect(universe.hasComponent(XYZComponent, e1)).toBe(false);

  expect(universe.hasComponent(XYComponent, e2)).toBe(false);
  expect(universe.hasComponent(XYZComponent, e2)).toBe(true);
});

  class TestSystem extends System {
    init() {
      console.log("TestSystem initialized");
    };  
    destroy() {
      console.log("TestSystem destroyed");
    };
    tick(dt: number) {

      this.universe?.eachComponent(XYComponent, (component, ent) => {
        console.log(`Entity ${ent} has XYComponent with values: x=${component.x}, y=${component.y}`);
        component.x += 1*dt;
        component.y += 1*dt;
      });

      console.log(`TestSystem tick with dt: ${dt}`);
      
    };
    setUniverse(universe: Universe): void {
      super.setUniverse(universe);
      console.log("TestSystem universe set");
    }
  }


test("Systems", () => {
  const tecs = new TECS();
  const systemManager = tecs.getSystemManager();

  const universe = tecs.getUniverse();

  let e1 = universe.createEntity();
  let e2 = universe.createEntity();

  universe.attachComponent(XYComponent, e1, new XYComponent(5, 10));
  universe.attachComponent(XYComponent, e2, new XYComponent(5, 10));
  universe.attachComponent(XYZComponent, e2, new XYZComponent(5, 10, 15));

  const testSystem = new TestSystem();

  tecs.registerSystem(testSystem);
  expect(systemManager.getSystems().length).toBe(1);

  systemManager.tick(0.016); // Simulate a frame tick

  universe.eachComponent(XYComponent, (component, ent) => {
    console.log(`Entity ${ent} has XYComponent with values: x=${component.x}, y=${component.y}`);
    expect(component.x).toBe(5.016);
    expect(component.y).toBe(10.016);
  });

  let xyzComponent = universe.getComponentManager().getHandleFromEntity(XYZComponent, e2)?.component;

  expect(xyzComponent).toEqual(new XYZComponent(5, 10, 15));


  tecs.unregisterSystem(testSystem);
  expect(systemManager.getSystems().length).toBe(0);
}
);
