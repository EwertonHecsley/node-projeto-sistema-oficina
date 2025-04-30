import Identity from './Identity';

export default class Entity<T> {
  private entityId: Identity;
  protected properties: T;

  protected constructor(properties: T, id?: Identity) {
    this.properties = properties;
    this.entityId = id ?? new Identity();
  }

  get valueId(): Identity {
    return this.entityId;
  }
}
