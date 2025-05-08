import { Mechanic } from '../../../core/domain/mechanic/entity/Mechanic';
import { CPF } from '../../../core/domain/mechanic/objectValue/CPF';
import { Email } from '../../../core/domain/mechanic/objectValue/Email';
import { MechanicRepository } from '../../../core/domain/mechanic/repository/MechanicRepository';
import { CreateMechanicUseCase } from '../../../core/domain/mechanic/useCase/CreateMechanic';
import { BadRequest } from '../../../shared/errors/custom/BadRequest';

const mockMechanicRepostory = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findByCpf: jest.fn(),
} as unknown as MechanicRepository;

describe('CreateMechanicUseCase', () => {
    let createMechanicUSeCase: CreateMechanicUseCase;

    beforeEach(() => {
        jest.clearAllMocks(),
            (createMechanicUSeCase = new CreateMechanicUseCase(mockMechanicRepostory));
    });

    it('Deve criar um novo Mecanico com sucesso.', async () => {
        const mechanic = Mechanic.create({
            name: 'Mecanico Teste',
            cpf: CPF.create('09253538414'),
            email: Email.create('email@email.com'),
            isAvaliable: true,
        });

        mockMechanicRepostory.findByCpf = jest.fn().mockResolvedValue(null);
        mockMechanicRepostory.findByEmail = jest.fn().mockReturnValue(null);

        mockMechanicRepostory.create = jest.fn().mockImplementation(async (mechanic) => mechanic);

        const result = await createMechanicUSeCase.execute({
            name: mechanic.name,
            email: mechanic.email.valueEmail,
            cpf: mechanic.cpf.valueCpf,
            isAvaliable: mechanic.isAvaliable ?? true,
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toBeInstanceOf(Mechanic);
        expect(mockMechanicRepostory.create).toHaveBeenCalled();
    });

    it('Deve dar erro BadRequest ao tentar criar novo mecanico com email duplicado', async () => {
        const mechanic = Mechanic.create({
            name: 'Mecanico Teste',
            cpf: CPF.create('09253538414'),
            email: Email.create('email@email.com'),
            isAvaliable: true,
        });

        mockMechanicRepostory.findByEmail = jest.fn().mockResolvedValue(mechanic);

        const newMechanic = Mechanic.create({
            name: 'Teste Mecanico 2',
            cpf: CPF.create('15524128493'),
            email: Email.create('email@email.com'),
            isAvaliable: true,
        });

        const result = await createMechanicUSeCase.execute({
            name: newMechanic.name,
            email: newMechanic.email.valueEmail,
            cpf: newMechanic.cpf.valueCpf,
            isAvaliable: newMechanic.isAvaliable,
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(BadRequest);
        expect((result.value as BadRequest).statusCode).toEqual(400);
        expect((result.value as BadRequest).message).toBe('Email ja cadastrado.');
        expect(mockMechanicRepostory.findByEmail).toHaveBeenCalledWith(mechanic.email.valueEmail);
    });

    it('Deve dar erro BadRequest ao tentar criar novo mecanico com cpf duplicado', async () => {
        const mechanic = Mechanic.create({
            name: 'Mecanico Teste',
            cpf: CPF.create('09253538414'),
            email: Email.create('email@email.com'),
            isAvaliable: true,
        });

        mockMechanicRepostory.findByCpf = jest.fn().mockResolvedValue(mechanic);

        const newMechanic = Mechanic.create({
            name: 'Teste Mecanico 2',
            cpf: CPF.create('09253538414'),
            email: Email.create('email3@email.com'),
            isAvaliable: true,
        });

        const result = await createMechanicUSeCase.execute({
            name: newMechanic.name,
            email: newMechanic.email.valueEmail,
            cpf: newMechanic.cpf.valueCpf,
            isAvaliable: newMechanic.isAvaliable,
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(BadRequest);
        expect((result.value as BadRequest).statusCode).toEqual(400);
    });
});
