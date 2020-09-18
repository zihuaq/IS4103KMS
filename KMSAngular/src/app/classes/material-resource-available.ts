import { Tag } from './tag';
import { User } from './user';

export class MaterialResourceAvailable {
  mraId: number;
  name: string;
  quantity: number;
  description: string;
  startDate: Date;
  endDate: Date;
  materialResourceAvailableOwner: User;
  tags: Tag[];
  latitude: string;
  longitude: string;

  constructor(
    mraId?: number,
    name?: string,
    quantity?: number,
    description?: string,
    startDate?: Date,
    endDate?: Date,
    materialResourceAvailableOwner?: User,
    tags?: Tag[],
    latitude?: string,
    longitude?: string
  ) {
    this.mraId = mraId;
    this.name = name;
    this.quantity = quantity;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.materialResourceAvailableOwner = materialResourceAvailableOwner;
    this.tags = tags;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
