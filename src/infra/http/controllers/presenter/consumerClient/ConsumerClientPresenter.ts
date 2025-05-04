import { ConsumerClient } from '../../../../../core/domain/consumerClient/entity/ConsumerCLient';

export class ConsumerClientPresenter {
  static toHTTP(entity: ConsumerClient) {
    return {
      id: entity.valueId.valueId,
      name: entity.name,
      email: entity.email.valueEmail,
      phone: entity.phone,
      docType: entity.docType.documentValue,
      city: entity.city,
      juridicalPerson: entity.juridicalPerson,
    };
  }
}
