import Entity from '../../../generics/Entity';
import Identity from '../../../generics/Identity';
import { Vehicle } from '../../vehicle/entity/Vehicle';
import { DocumentClient } from '../objectValue/Document';
import { Email } from '../objectValue/Email';

type ConsumerClientProps = {
  name: string;
  docType: DocumentClient;
  email: Email;
  phone: string;
  city: string;
  juridicalPerson: boolean;
  vehicles?: Vehicle[];
};

export class ConsumerClient extends Entity<ConsumerClientProps> {
  private constructor(props: ConsumerClientProps, id?: Identity) {
    super(props, id);
  }

  static create(props: ConsumerClientProps, id?: Identity): ConsumerClient {
    return new ConsumerClient({ ...props }, id);
  }

  get name(): string {
    return this.properties.name;
  }

  get docType(): DocumentClient {
    return this.properties.docType;
  }

  get email(): Email {
    return this.properties.email;
  }

  get phone(): string {
    return this.properties.phone;
  }

  get city(): string {
    return this.properties.city;
  }

  get juridicalPerson(): boolean {
    return this.properties.juridicalPerson;
  }

  get vehicles(): Vehicle[] {
    return this.properties.vehicles ?? [];
  }

  set name(name: string) {
    this.properties.name = name;
  }

  set docType(docType: DocumentClient) {
    this.properties.docType = docType;
  }

  set email(email: Email) {
    this.properties.email = email;
  }

  set phone(phone: string) {
    this.properties.phone = phone;
  }

  set city(city: string) {
    this.properties.city = city;
  }

  set juridicalPerson(juridicalPerson: boolean) {
    this.properties.juridicalPerson = juridicalPerson;
  }

  addVehicle(vehicle: Vehicle): void {
    if (!this.properties.vehicles) {
      this.properties.vehicles = [];
    }
    this.properties.vehicles.push(vehicle);
  }

  setVehicles(vehicles: Vehicle[]): void {
    this.properties.vehicles = vehicles;
  }
}
