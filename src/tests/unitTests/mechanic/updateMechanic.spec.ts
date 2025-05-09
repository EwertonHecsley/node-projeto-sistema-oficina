import { boolean } from 'drizzle-orm/gel-core';
import { Mechanic } from '../../../core/domain/mechanic/entity/Mechanic';
import { CPF } from '../../../core/domain/mechanic/objectValue/CPF';
import { Email } from '../../../core/domain/mechanic/objectValue/Email';
import { MechanicRepository } from '../../../core/domain/mechanic/repository/MechanicRepository';
import { UpdateMechanicUseCase } from '../../../core/domain/mechanic/useCase/UpdateMechanic';
import { left } from '../../../shared/utils/either';
import { BadRequest } from '../../../shared/errors/custom/BadRequest';

const mockMechanicRepository = {
  findById: jest.fn(),
  update: jest.fn(),
  findByEmail: jest.fn(),
  findByCpf: jest.fn(),
} as unknown as jest.Mocked<MechanicRepository>;

describe('UpdateMechanicUseCase', () => {
  let updateMechanicUseCase: UpdateMechanicUseCase;

  beforeEach(() => {
    jest.clearAllMocks(),
      (updateMechanicUseCase = new UpdateMechanicUseCase(mockMechanicRepository));
  });

  it('Deve atualizar um mecanico', async () => {
    const fakeMechanic = Mechanic.create({
      name: 'Mecanico Teste',
      email: Email.create('email@email.com'),
      cpf: CPF.create('09253538414'),
      isAvaliable: true,
    });

    mockMechanicRepository.findById = jest.fn().mockResolvedValue(fakeMechanic);
    mockMechanicRepository.findByCpf = jest.fn().mockResolvedValue(null);
    mockMechanicRepository.findByEmail = jest.fn().mockResolvedValue(null);

    const result = await updateMechanicUseCase.execute({
      id: 'cleinte-123',
      email: 'novo-email@email.com',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeTruthy();
  });

  it('Deve dar erro BadRequest ao atualizar um mecanico com email existente.', async () => {
    const mechanicToUpdate = Mechanic.create({
      name: 'Mecanico Teste',
      email: Email.create('atual@email.com'),
      cpf: CPF.create('09253538414'),
      isAvaliable: true,
    });

    const existingMechanicWithEmail = Mechanic.create({
      name: 'Outro Mecanico',
      email: Email.create('email@email.com'),
      cpf: CPF.create('01000661431'),
      isAvaliable: true,
    });

    mockMechanicRepository.findById = jest.fn().mockResolvedValue(mechanicToUpdate);
    mockMechanicRepository.findByEmail = jest.fn().mockResolvedValue(existingMechanicWithEmail);

    const result = await updateMechanicUseCase.execute({
      id: 'cleinte-123',
      email: 'email@email.com',
    });

    expect(result).toEqual(left(new BadRequest('Email ja cadastrado para outro mecanico.')));
  });

  it('Deve dar erro BadRequest ao atualizar um mecanico com CPF existente.', async () => {
    const mechanicToUpdate = Mechanic.create({
      name: 'Mecanico Teste',
      email: Email.create('atual@email.com'),
      cpf: CPF.create('15524128493'),
      isAvaliable: true,
    });

    const existingMechanicWithCpf = Mechanic.create({
      name: 'Outro Mecanico',
      email: Email.create('outro@email.com'),
      cpf: CPF.create('01000661431'),
      isAvaliable: true,
    });

    mockMechanicRepository.findById = jest.fn().mockResolvedValue(mechanicToUpdate);
    mockMechanicRepository.findByCpf = jest.fn().mockResolvedValue(existingMechanicWithCpf);

    const result = await updateMechanicUseCase.execute({
      id: 'mechanic-123',
      cpf: '09253538414',
    });

    expect(result).toEqual(left(new BadRequest('CPF ja cadastrado para outro mecanico.')));
  });
});
