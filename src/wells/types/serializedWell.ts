import { Exclude } from "class-transformer";

export class SerializedWell{

    id: string;
    hasActiveUser: boolean;
    updatedAt: Date;

    @Exclude()
    userId: string;

    @Exclude()
    createdAt:Date;

    @Exclude()
    deletedAt:Date;

    constructor(partial: Partial<SerializedWell>){
        Object.assign(this, partial);
    }
}