import { ObjectId } from "mongodb";

export interface Metadata {
    code: ObjectId;
    name: string;
    tags: string[];
}
