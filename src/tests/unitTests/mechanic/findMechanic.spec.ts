import { Mechanic } from '../../../core/domain/mechanic/entity/Mechanic';
import { CPF } from '../../../core/domain/mechanic/objectValue/CPF';
import { Email } from '../../../core/domain/mechanic/objectValue/Email';
import { MechanicRepository } from '../../../core/domain/mechanic/repository/MechanicRepository';
import { FindMechanicUseCase } from '../../../core/domain/mechanic/useCase/FindMechanic';
import { NotFound } from '../../../shared/errors/custom/NotFound';

const mockMechanicRepository = {
  findById: jest.fn(),
} as unknown as MechanicRepository;

describe('FindMechanicUseCase', () => {
  let findMechanicUseCase: FindMechanicUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    findMechanicUseCase = new FindMechanicUseCase(mockMechanicRepository);
  });

  it('Deve retornar um Mecanico cadastrado.', async () => {
    const mechanicMock = Mechanic.create({
      name: 'Mecanico Teste',
      cpf: CPF.create('09253538414'),
      email: Email.create('email@email.com'),
      isAvaliable: true,
    });

    mockMechanicRepository.findById = jest.fn().mockResolvedValue(mechanicMock);

    const result = await findMechanicUseCase.execute({ id: mechanicMock.valueId.valueId });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(mechanicMock);
  });

  it('Deve retornar erro 404 NotFound ao passar um ID que nao existe.', async () => {
    mockMechanicRepository.findById = jest.fn().mockResolvedValue(null);
    const result = await findMechanicUseCase.execute({ id: '123-456' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFound);
    expect((result.value as NotFound).message).toBe('Mecanico nao encontrado.');
  });
});
