import { TYPES } from '@app/types';
import { CanvasInformation } from '@common/communication/canvas-information';
import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import 'reflect-metadata';
import { Metadata } from '../classes/metadata';
import { MetadataService } from './metadata.service';
import { ServerSaveService } from './server-save.service';

@injectable()
export class DataAccessService {
    constructor(
        @inject(TYPES.MetadataService) private metadataService: MetadataService,
        @inject(TYPES.ServerSaveService) private serverSaveService: ServerSaveService,
    ) {}

    async getAllData(): Promise<CanvasInformation[]> {
        return this.metadataService
            .getAllMetadata()
            .then((metadata: Metadata[]) => {
                const information = this.serverSaveService.createCanvasInformation(metadata);
                return information;
            })
            .catch((error: Error) => {
                throw new Error(error.message);
            });
    }
    // getDataByTags() {}
    async addData(information: CanvasInformation): Promise<void> {
        const data: Metadata = {
            codeID: new ObjectId(),
            name: information.name,
            tags: information.tags,
            height: information.height,
            format: information.format,
            width: information.width,
        } as Metadata;

        this.metadataService
            .addMetadata(data)
            .then(() => {
                this.serverSaveService.saveImage(information.format, data.codeID.toHexString(), information.imageData);
            })
            .catch((error: Error) => {
                throw new Error(error.message);
            });
    }
    async deleteData(aCode: string): Promise<void> {
        this.metadataService.deleteMetadata(aCode).then(() => {
            this.serverSaveService.deleteCanvasInformation(aCode);
        });
    }

    /*unsure if needed
  getDataByCode()
  getDataByName()*/
}
