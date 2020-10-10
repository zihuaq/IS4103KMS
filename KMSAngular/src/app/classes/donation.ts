import { Project } from './project';

export class Donation {
    donationId: number;
    paypalOrderId: number;
    dateDonated: Date;
    amount: number;
    currency: String;
    project: Project;

    constructor(donationId?: number, paypalOrderId?: number, dateDonated?: Date, amount?: number, currency?: String, project?: Project) {
        this.donationId = donationId;
        this.paypalOrderId = paypalOrderId;
        this.dateDonated = dateDonated;
        this.amount = amount;
        this.currency = currency;
        this.project = project;
    }
}
