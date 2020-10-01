import { Project } from './project';
import { Tag } from './tag';

export class MaterialResourcePosting {
    materialResourcePostingId: number;
    name: string;
    unit: string;
    totalQuantity: number;
    obtainedQuantity: number;
    lackingQuantity: number;
    description: string;
    startDate: Date;
    endDate: Date;
    latitude: number;
    longitude: number;
    project: Project;
    tags: Tag[];

    constructor(materialResourcePostingId?: number, name?: string, unit?: string, totalQuantity?: number, obtainedQuantity?: number, lackingQuantity?: number, description?: string, startDate?: Date, endDate?: Date, latitude?: number, longitude?: number, project?: Project, tags?: Tag[]) {
        this.materialResourcePostingId = materialResourcePostingId;
        this.name = name;
        this.unit = unit;
        this.totalQuantity = totalQuantity;
        this.obtainedQuantity = obtainedQuantity;
        this.lackingQuantity = lackingQuantity;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.latitude = latitude;
        this.longitude = longitude;
        this.project = project;
        this.tags = tags;
    }
}
