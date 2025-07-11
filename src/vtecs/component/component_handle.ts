import { Component } from "./component";

export class ComponentHandle<ComponentType> {
  constructor(public component?: ComponentType) {}
}
