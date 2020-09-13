import {Tag} from './tag'
import {User} from './user'

export class MaterialResourceAvailable {
    mraId: number;
    name: string;
    quantity: number;
    description: string;
    startDate: Date;
    endDate: Date;
    mraOwner: User;
    tags: Tag[];
    country: string;

    constructor(mraId?: number, name?: string, quantity?:number, description?:string, 
        startDate?: Date, endDate?:Date, mraOwner?:User, tags?:Tag[], country?:string){
        this.mraId = mraId;
        this.name = name;
        this.quantity = quantity;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.mraOwner = mraOwner;
        this.tags = tags;
        this.country = country;
    }
}
