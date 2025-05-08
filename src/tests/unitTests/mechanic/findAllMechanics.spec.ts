import { Mechanic } from '../../../core/domain/mechanic/entity/Mechanic';
import { CPF } from '../../../core/domain/mechanic/objectValue/CPF';
import { Email } from '../../../core/domain/mechanic/objectValue/Email';
import { MechanicRepository } from '../../../core/domain/mechanic/repository/MechanicRepository';
import { FindAllMechanicsUseCase } from '../../../core/domain/mechanic/useCase/FindAllMechanic';

const mockMechanicRepostory = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findByCpf: jest.fn(),
} as unknown as MechanicRepository;

describe('FindAllMechanicsUseCAse', () => {
  let findAllMechanicsUseCase: FindAllMechanicsUseCase;

  beforeEach(() => {
    jest.clearAllMocks(),
      (findAllMechanicsUseCase = new FindAllMechanicsUseCase(mockMechanicRepostory));
  });

  it('Deve listar todos os Mecanicos cadastrados.', async () => {
    const mechanicOne = Mechanic.create({
      name: 'Mecanico1',
      email: Email.create('mecanico1@email.com'),
      cpf: CPF.create('09253538414'),
      isAvaliable: true,
    });

    const mechanicTwo = Mechanic.create({
      name: 'Mecanico2',
      email: Email.create('mecanico2@email.com'),
      cpf: CPF.create('15524128493'),
      isAvaliable: true,
    });

    const listMechanics = [mechanicOne, mechanicTwo];
    mockMechanicRepostory.findAll = jest.fn().mockResolvedValue(listMechanics);

    const result = await findAllMechanicsUseCase.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(listMechanics);
    expect(mockMechanicRepostory.findAll).toHaveBeenCalled();
  });

  it('Deve retornar um array vazio se nao houver mecanicos.', async () => {
    mockMechanicRepostory.findAll = jest.fn().mockResolvedValue([]);

    const result = await findAllMechanicsUseCase.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual([]);
    expect(mockMechanicRepostory.findAll).toHaveBeenCalled();
  });
});
