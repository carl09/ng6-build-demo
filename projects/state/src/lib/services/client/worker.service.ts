import { Observable } from 'rxjs';
import { IWorkerAction, IWorkerMessage } from '../../models';

export abstract class WorkerService {
  public abstract start(script: string): void;
  public abstract listen(): Observable<IWorkerMessage>;
  public abstract send(message: IWorkerAction);
  public abstract stop();
}
