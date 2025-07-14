import { Event } from "./event";

/* The EventManager handles the registration and emission of events within the universe.
   It allows systems to listen for specific events and react accordingly. */
export class EventManager {
  private listeners: Map<Function, Set<(event: Event) => void>> = new Map();

  /* Register a listener for a specific event type. */
  public registerListener<EventType extends Event>(
    eventClass: { new (...args: any[]): EventType },
    listener: (event: EventType) => void
  ): void {
    if (!this.listeners.has(eventClass)) {
      this.listeners.set(eventClass, new Set());
    }
    this.listeners.get(eventClass)?.add(listener as (event: Event) => void);
  }

  /* Unregister a listener for a specific event type. */
  public unregisterListener<EventType extends Event>(
    eventClass: { new (...args: any[]): EventType },
    listener: (event: EventType) => void
  ): void {
    if (this.listeners.has(eventClass)) {
      this.listeners.get(eventClass)?.delete(listener as (event: Event) => void);
      if (this.listeners.get(eventClass)?.size === 0) {
        this.listeners.delete(eventClass);
      }
    }
  }

  /* Emit an event to all registered listeners for that event type. */
  public emit<EventType extends Event>(event: EventType): void {
    const eventClass = (event as any).constructor;
    if (this.listeners.has(eventClass)) {
      this.listeners.get(eventClass)?.forEach((listener) => {
        listener(event);
      });
    }
  }

  /* Clear all listeners for a specific event type or all listeners if no event type is provided. */
  public clearListeners<EventType extends Event>(
    eventClass: { new (...args: any[]): EventType }
  ): void {
    if (eventClass) {
      this.listeners.delete(eventClass);
    } else {
      this.listeners.clear();
    }
  }
}