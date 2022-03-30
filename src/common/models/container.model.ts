import { Bind } from '@common/models/bind.model';
import { Variable } from '@common/models/variable.model';

export interface Container {
  image: string;
  tag: string;
  ports: Bind<string>[];
  volumes: Bind<string>[];
  variables: Variable[];
}

export interface ContainerData {
  image: string;
  tag: string;
  ports: [string, string][];
  volumes: [string, string][];
  variables: [string, string][];
}
