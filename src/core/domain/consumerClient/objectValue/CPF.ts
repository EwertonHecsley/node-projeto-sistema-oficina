import { BadRequest } from '../../../../shared/errors/custom/BadRequest';

export class CPF {
  private constructor(private readonly value: string) {}

  static create(value: string): CPF {
    const sanitized = value.replace(/\D/g, '');

    if (!this.validate(sanitized)) {
      throw new BadRequest('Invalid CPF format or number.');
    }

    return new CPF(sanitized);
  }

  private static validate(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    const calc = (factor: number) =>
      cpf
        .slice(0, factor - 1)
        .split('')
        .reduce((acc, digit, index) => acc + Number(digit) * (factor - index), 0);

    const firstDigit = ((calc(10) * 10) % 11) % 10;
    const secondDigit = ((calc(11) * 10) % 11) % 10;

    return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
  }

  get valueCpf(): string {
    return this.value;
  }
}
