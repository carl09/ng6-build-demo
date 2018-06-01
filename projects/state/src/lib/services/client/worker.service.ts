import { Observable } from 'rxjs';
import { IWorkerAction, IWorkerMessage } from '../../models';
import { WorkerActions } from '../../models/worker-action.model';

export abstract class WorkerService {
  public abstract start(script: string): void;
  public abstract listen(): Observable<IWorkerMessage>;
  public abstract send(message: WorkerActions);
  public abstract stop();
}
