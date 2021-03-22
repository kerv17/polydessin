import { ObjectId } from 'mongodb';

export interface Metadata {
    codeID: ObjectId;
    name: string;
    tags: string[];
    format: string;
    height: number;
    width: number;
}
