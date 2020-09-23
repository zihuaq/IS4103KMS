import { Project } from './project';

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

    constructor(materialResourcePostingId?: number, name?: string, unit?: string, totalQuantity?: number, obtainedQuantity?: number, lackingQuantity?: number, description?: string, startDate?: Date, endDate?: Date, latitude?: number, longitude?: number, project?: Project) {
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
    }
}
