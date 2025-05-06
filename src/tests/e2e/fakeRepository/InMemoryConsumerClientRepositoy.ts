import { ConsumerClient } from '../../../core/domain/consumerClient/entity/ConsumerCLient';
import { ClientRepositoy } from '../../../core/domain/consumerClient/repository/ClientRepository';
import { Vehicle } from '../../../core/domain/vehicle/entity/Vehicle';

export class InMemoryConsumerClientRepository implements ClientRepositoy {
  public consumersClients: ConsumerClient[] = [];

  async createClient(client: ConsumerClient): Promise<ConsumerClient> {
    const newConsumerClient = ConsumerClient.create(client);
    this.consumersClients.push(newConsumerClient);
    return newConsumerClient;
  }

  async deleteClient(id: string): Promise<void> {
    const index = this.consumersClients.findIndex((element) => element.valueId.valueId == id);
    this.consumersClients.splice(index, 1);
  }

  async getAllClients(): Promise<ConsumerClient[]> {
    return this.consumersClients;
  }

  async getClientByDocType(docType: string): Promise<ConsumerClient | null> {
    const consumerClient = this.consumersClients.find(
      (element) => element.docType.documentValue == docType,
    );
    if (!consumerClient) return null;
    return consumerClient;
  }

  async getClientByEmail(email: string): Promise<ConsumerClient | null> {
    const consumerClient = this.consumersClients.find(
      (element) => element.email.valueEmail == email,
    );
    if (!consumerClient) return null;
    return consumerClient;
  }

  async getClientById(id: string): Promise<ConsumerClient | null> {
    const consumerClient = this.consumersClients.find((element) => element.valueId.valueId == id);
    if (!consumerClient) return null;
    return consumerClient;
  }

  async updateClient(id: string, client: ConsumerClient): Promise<void> {
    const data = ConsumerClient.create(client);
    const index = this.consumersClients.findIndex((element) => element.valueId.valueId == id);
    this.consumersClients[index] = data;
  }

  async addaddVehicleToClient(vehicle: Vehicle, clientId: string): Promise<void> {
    const vehicleAdded = Vehicle.create(vehicle);
    const consumerClient = this.consumersClients.find(
      (element) => element.valueId.valueId == clientId,
    );
    consumerClient?.addVehicle(vehicleAdded);
  }
}
