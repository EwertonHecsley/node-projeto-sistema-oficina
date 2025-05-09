import { Mechanic } from '../../../core/domain/mechanic/entity/Mechanic';
import { CPF } from '../../../core/domain/mechanic/objectValue/CPF';
import { Email } from '../../../core/domain/mechanic/objectValue/Email';
import { MechanicRepository } from '../../../core/domain/mechanic/repository/MechanicRepository';
import { DeleteMechanicUseCase } from '../../../core/domain/mechanic/useCase/DeleteMechanic';
import { BadRequest } from '../../../shared/errors/custom/BadRequest';
import { NotFound } from '../../../shared/errors/custom/NotFound';

describe('DeleteMechanicUseCase', () => {
  const mockMechanicRepository = {
    findById: jest.fn(),
    delete: jest.fn(),
  } as unknown as MechanicRepository;

  let deleteMechanicUseCase: DeleteMechanicUseCase;

  beforeEach(() => {
    jest.clearAllMocks(),
      (deleteMechanicUseCase = new DeleteMechanicUseCase(mockMechanicRepository));
  });

  it('Deve deletar um mecanico', async () => {
    const mechanic = Mechanic.create({
      name: 'Mecanico Teste',
      cpf: CPF.create('09253538414'),
      email: Email.create('email@email.com'),
      isAvaliable: true,
    });

    mockMechanicRepository.findById = jest.fn().mockResolvedValue(mechanic);
    const result = await deleteMechanicUseCase.execute({ id: mechanic.valueId.valueId });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
  });

  it('Deve retornar um erro NotFound ao passar um id invalido', async () => {
    mockMechanicRepository.findById = jest.fn().mockResolvedValue(null);

    const result = await deleteMechanicUseCase.execute({ id: 'invalid-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFound);
    expect((result.value as NotFound).message).toBe('Mecanico nao encontrado.');
  });

  it('Deve retornar um erro BadRequest ao tentar deletar um mecanico que com servico ativo', async () => {
    const mechanic = Mechanic.create({
      name: 'Mecanico Teste',
      cpf: CPF.create('09253538414'),
      email: Email.create('email@email.com'),
      isAvaliable: false,
    });

    mockMechanicRepository.findById = jest.fn().mockResolvedValue(mechanic);
    const result = await deleteMechanicUseCase.execute({ id: mechanic.valueId.valueId });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequest);
    expect((result.value as BadRequest).message).toBe('Erro ao deletar mecanico em servico.');
  });
});
