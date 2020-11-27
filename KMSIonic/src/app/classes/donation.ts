import { Project } from './project';

export class Donation {
    donationId: number;
    paypalOrderId: String;
    dateDonated: Date;
    amount: number;
    project: Project;

    constructor(donationId?: number, paypalOrderId?: String, dateDonated?: Date, amount?: number, project?: Project) {
        this.donationId = donationId;
        this.paypalOrderId = paypalOrderId;
        this.dateDonated = dateDonated;
        this.amount = amount;
        this.project = project;
    }
}