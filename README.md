# VTECS
Vangoule's TypeScript Entity Component System is a TypeScript library which implements an ECS paradigm in the TypeScript language. It was built to mirror my C++ VECS library https://github.com/Vangoule/VECS and follows the same design choices that were implmeneted in that project. There is heavy usage of RTTI to make usage easy and simple but it does come with some performance costs. 

## What is an ECS and what is the purpose of this ECS?
Wikipedia: https://en.wikipedia.org/wiki/Entity_component_system

For most, the purpose of the Entity Component System is to decouple functionality from data and allow efficient storage of entities data. When data is used, it should also be used as such so instead of calling each entity to do something with a component, the components themselves can be iterated over and used. The development of this ECS has kept this in mind and after researching the available options a static templated storage type was created to ensure all components of a certain type are stored together, this allows any particular system interacting with the data to have less cache misses and therefore theoretically will run faster.

## Basic Usage:
This shows how to create the ECS, get the universe and add a TestSystem, create an Entity and attach a few components. Then the ECS is ticked which calls the System tick. This system can then be used to add logic to your game and interact with entities and components as seen below.
```
class TestSystem extends System {
  init() {
    console.log("TestSystem initialized");
  }
  destroy() {
    console.log("TestSystem destroyed");
  }
  tick(dt: number) {
    console.log(`TestSystem tick with dt: ${dt}`);
  }
}

class TransformComponent extends Component
{
  constructor(public x: number, public y: number, public z: number) { super()};
};

class ScaleComponent extends Component
{
	constructor(public x: number, public y: number, public z: number) { super()};
};

function run() {
	/*Create universe*/
	const ecs = new ECS();
	const universe = ecs.getUniverse();

	/*Add a system*/
	const testSystem = new TestSystem(universe);
	ecs.registerSystem(testSystem);

	/*Create an entity*/
	const ent = universe.createEntity();
	let comp1 = new TransformComponent(5, 5, 5);
	let comp2 = new ScaleComponent(1, 1, 1);
	universe.attachComponent(ent, comp1);
	universe.attachComponent(ent, comp2);

  let isRunning = true;
  let dt = 0.016; // This should be calculated based on your game loop timing

	while (isRunning)
	{
		/*Tick all entity events, and systems.*/
		ecs.tick(dt);
	}

}
```

## Creating and handling events:
Here is how to create a custom event, there are also default events available to systems such as ComponentAttached and ComponentDetached which can be useful for maintaining local stores of components for speed.
```
/*Create a new event*/
  class MouseClicked extends Event {
    constructor(
      public button: number,
      public position: { x: number; y: number }
    ) {
      super();
    }
  }

/*Create an event handler for the new event */
  eventManager.registerListener(MouseClicked, (event) => {
    console.log(
      `Mouse clicked: button=${event.button}, position=(${event.position.x}, ${event.position.y})`
    );
  });

/* Emit an event*/
  const mouseEvent = new MouseClicked(0, { x: 100, y: 200 });
  eventManager.emit(mouseEvent);

/*Remove an event handler by ID*/
m_eventManager->removeEventListener(eventHandler);

```
## Accessing entities from a system
There are multiple ways to access entities, the most efficient way would be to keep a local store of components the system is interested in by requesting the list on init from the universe and updating it whenever a ComponentAttached event happens. If you want quick access to components without keeping a store there are several functions available:
```
/*For each transform component, run a function on the component. 
  This is the most efficient method as it simply itterates over each component in a storage*/
  universe.eachComponent(TransformComponent, (component, ent) => {

  });

/*For each entity with a single component run a function. This takes longer as it itterates over each entity,
  then checks if it has the component, gets a handle to the component and then calls the function*/
  universe.eachEntityWithComponent( TransformComponent, (transform, ent) => {

  });

/*For each entity run a function. */
  universe.eachEntity((ent) => {

  });

/*For each entity with both a TransformComponent and ScaleComponent*/
  universe.eachEntityWithComponents(
    [TransformComponent, ScaleComponent],
    (transform, scale, ent) => {    

    }
  );

```
