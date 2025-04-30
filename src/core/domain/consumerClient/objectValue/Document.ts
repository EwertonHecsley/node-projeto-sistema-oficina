import { CPF } from './CPF';
import { CNPJ } from './CNPJ';

export class DocumentClient {
  private value: CPF | CNPJ;

  private constructor(value: CPF | CNPJ) {
    this.value = value;
  }

  static create(value: string, juridicalPerson: boolean): DocumentClient {
    if (juridicalPerson) {
      return new DocumentClient(CNPJ.create(value));
    } else {
      return new DocumentClient(CPF.create(value));
    }
  }

  get documentValue(): CPF | CNPJ {
    return this.value;
  }
}
