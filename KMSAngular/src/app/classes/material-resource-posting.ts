import { Project } from './project';
import { Tag } from './tag';
import { Fulfillment } from './fulfillment';

export class MaterialResourcePosting {
    materialResourcePostingId: number;
    name: string;
    unit: string;
    totalQuantity: number;
    obtainedQuantity: number;
    lackingQuantity: number;
    allocatedQuantity: number;
    description: string;
    startDate: Date;
    endDate: Date;
    latitude: number;
    longitude: number;
    project: Project;
    fulfillments: Fulfillment[];
    tags: Tag[];

    constructor(materialResourcePostingId?: number, name?: string, unit?: string, totalQuantity?: number, obtainedQuantity?: number, lackingQuantity?: number, allocatedQuantity?: number, description?: string, startDate?: Date, endDate?: Date, latitude?: number, longitude?: number, project?: Project, fulfillments?: Fulfillment[], tags?: Tag[]) {
        this.materialResourcePostingId = materialResourcePostingId;
        this.name = name;
        this.unit = unit;
        this.totalQuantity = totalQuantity;
        this.obtainedQuantity = obtainedQuantity;
        this.lackingQuantity = lackingQuantity;
        this.allocatedQuantity = allocatedQuantity;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.latitude = latitude;
        this.longitude = longitude;
        this.project = project;
        this.fulfillments = fulfillments;
        this.tags = tags;
    }
}
