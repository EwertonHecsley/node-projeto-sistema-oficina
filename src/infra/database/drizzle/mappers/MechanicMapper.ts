import { Mechanic } from '../../../../core/domain/mechanic/entity/Mechanic';
import { CPF } from '../../../../core/domain/mechanic/objectValue/CPF';
import { Email } from '../../../../core/domain/mechanic/objectValue/Email';
import Identity from '../../../../core/generics/Identity';
import { mechanic } from '../schema/mechanicSchema';

type InsertMechanic = typeof mechanic.$inferInsert;
type SelectMechanic = typeof mechanic.$inferSelect;

export class MechanicMapper {
  static toPersistence(mechanic: Mechanic): InsertMechanic {
    return {
      id: mechanic.valueId.valueId,
      name: mechanic.name,
      cpf: mechanic.cpf.valueCpf,
      email: mechanic.email.valueEmail,
    };
  }

  static toDomain(raw: SelectMechanic): Mechanic {
    return Mechanic.create(
      {
        name: raw.name,
        email: Email.create(raw.email),
        cpf: CPF.create(raw.cpf),
        isAvaliable: raw.isAvaliable!,
      },
      new Identity(raw.id),
    );
  }
}
