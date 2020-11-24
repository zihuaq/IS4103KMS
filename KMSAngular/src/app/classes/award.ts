import { User } from './user';
import { Project } from './project';

export class Award {
  awardId: number;
  name: string;
  description: string;
  country: string;
  awardPicture: string | ArrayBuffer;
  usersReceived: User[];
  project: Project;

  constructor(
    awardId?: number,
    name?: string,
    description?: string,
    awardPicture?: string | ArrayBuffer,
    usersReceived?: User[],
    project?: Project
  ) {
    this.awardId = awardId;
    this.name = name;
    this.description = description;
    this.awardPicture = awardPicture;
    this.usersReceived = usersReceived;
    this.project = project;
  }
}
