import { Vehicle } from '../../vehicle/entity/Vehicle';
import { ConsumerClient } from '../entity/ConsumerCLient';

export abstract class ClientRepositoy {
  abstract getClientById(id: string): Promise<ConsumerClient | null>;
  abstract getClientByEmail(email: string): Promise<ConsumerClient | null>;
  abstract getClientByDocType(docType: string): Promise<ConsumerClient | null>;
  abstract getAllClients(): Promise<ConsumerClient[]>;
  abstract createClient(client: ConsumerClient): Promise<ConsumerClient>;
  abstract updateClient(id: string, client: ConsumerClient): Promise<void>;
  abstract deleteClient(id: string): Promise<void>;
  abstract addaddVehicleToClient(vehicle: Vehicle, clientId: string): Promise<void>;
}
