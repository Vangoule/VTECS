import { Component } from "./component";

/**
 * ComponentHandle is a wrapper for a component that allows a level of abstraction.
 */
export class ComponentHandle<ComponentType> {
  constructor(public component?: ComponentType) {}
}
