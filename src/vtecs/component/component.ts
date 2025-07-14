export abstract class Component {
    /* A component stores data for an entity. This is a base class that should be extended to create specific components. 
       Ideally it should only contain data and not functions, however, as this is TypeScript and not C this isn't so important as the memory won't be stored in a contiguous array anyway.
       Only systems should act on components. */
};
