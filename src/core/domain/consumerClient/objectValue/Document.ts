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

  get documentValue(): string {
    if (this.value instanceof CPF) {
      return this.value.valueCpf;
    }

    if (this.value instanceof CNPJ) {
      return this.value.valueCnpj;
    }

    throw new Error('Invalid document type.');
  }
}
