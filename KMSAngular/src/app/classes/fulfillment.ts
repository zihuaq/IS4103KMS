import { FulfillmentStatus } from './fulfillment-status.enum';
import { MaterialResourcePosting } from './material-resource-posting';
import { MaterialResourceAvailable } from './material-resource-available';
import { User } from './user';
import { MraType } from './mra-type.enum';
import { PaymentBasis } from './payment-basis.enum';

export class Fulfillment {
    fulfillmentId: number;
    totalPledgedQuantity: number;
    receivedQuantity: number;
    unreceivedQuantity: number;
    status: FulfillmentStatus;
    priceOffered: number;
    basisOffered: MraType;
    paymentBasis: PaymentBasis;
    fulfillmentOwner: User;
    posting: MaterialResourcePosting;
    mra: MaterialResourceAvailable;

    constructor(fulfillmentId?: number, 
        totalPledgedQuantity?: number, 
        receivedQuantity?: number, 
        unreceivedQuantity?: number, 
        status?: FulfillmentStatus, 
        priceOffered?: number,
        basisOffered?: MraType,
        paymentBasis?: PaymentBasis,
        fulfillmentOwner?: User, 
        posting?: MaterialResourcePosting, 
        mra?: MaterialResourceAvailable) 
    {
        this.fulfillmentId = fulfillmentId;
        this.totalPledgedQuantity = totalPledgedQuantity;
        this.receivedQuantity = receivedQuantity;
        this.unreceivedQuantity = unreceivedQuantity;
        this.status = status;
        this.priceOffered = priceOffered;
        this.basisOffered = basisOffered;
        this.paymentBasis = paymentBasis;
        this.fulfillmentOwner = fulfillmentOwner;
        this.posting = posting;
        this.mra = mra;
    }
}
