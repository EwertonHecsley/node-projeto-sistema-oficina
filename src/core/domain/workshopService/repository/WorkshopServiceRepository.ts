import { WorkshopService } from '../entity/WorkshopService';

export abstract class WorkshoServiceRepository {
  abstract create(entity: WorkshopService): Promise<WorkshopService>;
  abstract findById(id: string): Promise<WorkshopService | undefined>;
  abstract listAll(): Promise<WorkshopService[]>;
}
