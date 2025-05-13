import Entity from '../../../generics/Entity';
import Identity from '../../../generics/Identity';
import { StatusServico } from '../enum/status';

type WorkshopServiceProps = {
  description: string;
  cost: number;
  estimatedTimeMinutes: number;
  openDate: Date;
  closeDate: Date | null;
  status: StatusServico;
  mechanicId: string;
  vehicleId: string;
};

export class WorkshopService extends Entity<WorkshopServiceProps> {
  private constructor(props: WorkshopServiceProps, id?: Identity) {
    super(props, id);
  }

  static create(props: WorkshopServiceProps, id?: Identity): WorkshopService {
    return new WorkshopService({ ...props }, id);
  }

  get description(): string {
    return this.properties.description;
  }

  get cost(): number {
    return this.properties.cost;
  }

  get estimatedTimeMinutes(): number {
    return this.properties.estimatedTimeMinutes;
  }

  get openDate(): Date {
    return this.properties.openDate;
  }

  get closeDate(): Date | null {
    return this.properties.closeDate;
  }

  get status(): StatusServico {
    return this.properties.status;
  }

  get mechanicId(): string {
    return this.properties.mechanicId;
  }

  get vehicleId(): string {
    return this.properties.vehicleId;
  }

  setDescription(description: string): void {
    this.properties.description = description;
  }

  setCost(cost: number): void {
    if (cost < 0) throw new Error('O custo não pode ser negativo.');
    this.properties.cost = cost;
  }

  setEstimatedTime(minutes: number): void {
    if (minutes <= 0) throw new Error('Tempo estimado deve ser maior que zero.');
    this.properties.estimatedTimeMinutes = minutes;
  }

  assignMechanic(mechanicId: string): void {
    this.properties.mechanicId = mechanicId;
  }

  assignVehicle(vehicleId: string): void {
    this.properties.vehicleId = vehicleId;
  }

  changeStatus(status: StatusServico): void {
    this.properties.status = status;
    if (status === StatusServico.FINALIZADO) {
      this.properties.closeDate = new Date();
    }
  }

  reopenService(): void {
    this.properties.status = StatusServico.ABERTO;
    this.properties.closeDate = null;
  }
}
