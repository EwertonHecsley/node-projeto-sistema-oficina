import { BadRequest } from '../../../shared/errors/custom/BadRequest';

export class CNPJ {
  private constructor(private readonly value: string) {}

  static create(value: string): CNPJ {
    const sanitized = value.replace(/\D/g, '');

    if (!this.validate(sanitized)) {
      throw new BadRequest('Invalid CNPJ format or number.');
    }

    return new CNPJ(sanitized);
  }

  private static validate(cnpj: string): boolean {
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    const calc = (base: string, factors: number[]) =>
      factors.reduce((acc, factor, i) => acc + Number(base[i]) * factor, 0);

    const firstFactors = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondFactors = [6, ...firstFactors];

    const base = cnpj.slice(0, 12);
    const firstDigit = calc(base, firstFactors) % 11 < 2 ? 0 : 11 - (calc(base, firstFactors) % 11);
    const secondDigit =
      calc(base + firstDigit, secondFactors) % 11 < 2
        ? 0
        : 11 - (calc(base + firstDigit, secondFactors) % 11);

    return `${firstDigit}${secondDigit}` === cnpj.slice(-2);
  }

  get valueCnpj(): string {
    return this.value;
  }
}
