import { Fulfillment } from './fulfillment';
import { PaymentStatus } from './payment-status.enum';

export class Payment {
    paymentId: number;
    amount: number;
    paypalOrderId: string;
    previousDueDate: Date;
    dueDate: Date;
    status: PaymentStatus;
    isLast: boolean;
    fulfillment: Fulfillment;

    constructor(paymentId?: number,
        amount?: number,
        paypalOrderId?: string,
        previousDueDate?: Date,
        dueDate?: Date,
        status?: PaymentStatus,
        isLast?: boolean,
        fulfillment?: Fulfillment) 
    {
        this.paymentId = paymentId;
        this.amount = amount;
        this.paypalOrderId = paypalOrderId;
        this.previousDueDate = previousDueDate;
        this.dueDate = dueDate;
        this.status = status;
        this.isLast = isLast;
        this.fulfillment = fulfillment;
    }

}
