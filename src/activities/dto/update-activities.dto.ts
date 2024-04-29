import { PartialType } from "@nestjs/mapped-types";
import { CreateActivityDto } from "./create-activities.dto";

export class UpdateActivityDto extends PartialType(CreateActivityDto){}