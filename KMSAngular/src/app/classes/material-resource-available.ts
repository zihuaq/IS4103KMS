import { Tag } from './tag';
import { User } from './user';
import { MraType } from './mra-type.enum';

export class MaterialResourceAvailable {
  mraId: number;
  name: string;
  units: string;
  description: string;
  materialResourceAvailableOwner: User;
  tags: Tag[];
  latitude: string;
  longitude: string;
  price: number;
  type: MraType;

  constructor(
    mraId?: number,
    name?: string,
    units?: string,
    description?: string,
    materialResourceAvailableOwner?: User,
    tags?: Tag[],
    latitude?: string,
    longitude?: string,
    price?: number,
    type?: MraType
  ) {
    this.mraId = mraId;
    this.name = name;
    this.units = units;
    this.description = description;
    this.materialResourceAvailableOwner = materialResourceAvailableOwner;
    this.tags = tags;
    this.latitude = latitude;
    this.longitude = longitude;
    this.price = price;
    this.type = type;
  }
}
