import { ObjectId } from 'mongodb';

export interface Metadata {
    codeID: ObjectId;
    name: string;
    tags: string[];
    height: number;
    width:number;
}
