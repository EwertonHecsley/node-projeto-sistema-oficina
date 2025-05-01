import { ConsumerClient } from '../../../../core/domain/consumerClient/entity/ConsumerCLient';
import { DocumentClient } from '../../../../core/domain/consumerClient/objectValue/Document';
import { Email } from '../../../../core/domain/consumerClient/objectValue/Email';
import Identity from '../../../../core/generics/Identity';
import { consumerClient } from '../schema';
import { Vehicle } from '../../../../core/domain/vehicle/entity/Vehicle';

type InsertClient = typeof consumerClient.$inferInsert;
type SelectClient = typeof consumerClient.$inferSelect;

export class ConsumerClientMapper {
  static toPersistence(client: ConsumerClient): InsertClient {
    return {
      id: client.valueId.valueId,
      name: client.name,
      email: client.email.valueEmail,
      docType: client.docType.documentValue,
      city: client.city,
      phone: client.phone,
      juridicalPerson: client.juridicalPerson,
      createdAt: new Date(),
    };
  }

  static toDomain(raw: SelectClient, vehicles: Vehicle[] = []): ConsumerClient {
    const client = ConsumerClient.create(
      {
        name: raw.name,
        city: raw.city,
        email: Email.create(raw.email),
        docType: DocumentClient.create(raw.docType, raw.juridicalPerson),
        juridicalPerson: raw.juridicalPerson,
        phone: raw.phone,
      },
      new Identity(raw.id),
    );

    client.setVehicles(vehicles);
    return client;
  }
}
