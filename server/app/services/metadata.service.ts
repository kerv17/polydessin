import { TYPES } from '@app/types';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Collection, FindAndModifyWriteOpResultObject, ObjectId } from 'mongodb';
import 'reflect-metadata';
import { HttpException } from '../classes/http.exceptions';
import { Metadata } from '../classes/metadata';
import { DatabaseService } from './database.service';

const DATABASE_COLLECTION = 'metadata';
const MAX_SIZE_TAG = 10;
const MIN_SIZE_TAG = 3;
const MAX_NUMBER_TAG = 5;

@injectable()
export class MetadataService {
    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {}

    get collection(): Collection<Metadata> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    async getAllMetadata(): Promise<Metadata[]> {
        return this.collection
            .find({})
            .toArray()
            .then((metadata: Metadata[]) => {
                if (metadata.length === 0) throw new HttpException(Httpstatus.StatusCodes.NOT_FOUND, 'Aucun canvas présent dans la base de données');
                return metadata;
            });
    }

    async getMetadataByTags(tagsToFind: string[]): Promise<Metadata[]> {
        return this.collection
            .find({ tags: { $in: tagsToFind } })
            .toArray()
            .then((metadatas: Metadata[]) => {
                if (metadatas.length === 0) {
                    throw new Error();
                }
                return metadatas;
            })

            .catch(() => {
                throw new HttpException(Httpstatus.StatusCodes.NOT_FOUND, "Aucun canvas n'a été trouvé");
            });
    }

    async addMetadata(metadata: Metadata): Promise<void> {
        if (this.validateMetadata(metadata)) {
            await this.collection
                .insertOne(metadata)
                .catch((error: Error) => {
                    throw new HttpException(Httpstatus.StatusCodes.INTERNAL_SERVER_ERROR, "Le serveur n'a pas pu insérer la donnée");
                })
                .catch((error: Error) => {
                    throw new Error(error.message);
                });
        } else {
            throw new HttpException(Httpstatus.StatusCodes.BAD_REQUEST, "n'a pas pu insérer la donnée, format érroné");
        }
    }

    async deleteMetadata(aCode: string): Promise<void> {
        return this.collection
            .findOneAndDelete({ codeID: new ObjectId(aCode) })
            .then((res: FindAndModifyWriteOpResultObject<Metadata>) => {
                if (!res.value) {
                    throw new Error("Le serveur n'a pas pu enlever la donnée");
                }
            })
            .catch((error: Error) => {
                throw new Error(error.message);
            });
    }

    private validateMetadata(metadata: Metadata): boolean {
        return this.validateName(metadata.name) && this.validateTags(metadata.tags);
    }

    private validateName(name: string): boolean {
        return name.startsWith('Dessin');
    }

    private validateTags(tags: string[]): boolean {
        return (
            tags.length === 0 ||
            (this.verifyTagsNotNull(tags) &&
                this.verifyTagsTooLong(tags) &&
                this.verifyTagsTooShort(tags) &&
                this.verifyTagsNoSpecialChracter(tags) &&
                this.verifyTagsNumber(tags))
        );
    }

    private verifyTagsNumber(tags: string[]): boolean {
        return tags.length <= MAX_NUMBER_TAG;
    }
    private verifyTagsNotNull(tags: string[]): boolean {
        return tags.every((elem) => elem.length > 0);
    }
    private verifyTagsTooLong(tags: string[]): boolean {
        return tags.every((elem) => elem.length <= MAX_SIZE_TAG);
    }
    private verifyTagsTooShort(tags: string[]): boolean {
        return tags.every((elem) => elem.length >= MIN_SIZE_TAG);
    }

    /*
    RÉFÉRENCES POUR LE CODE DE LA METHODE  verifyTagsNoSpecialChracter :
    Le présent code est tiré du tutoriel "Check wheter String contains Special Characters using JavaScript" de Mudassar Khan,
    publié le 28 Decembre 2018
    disponible à l'adresse suivante : "https://www.aspsnippets.com/Articles/Check-whether-String-contains-Special-Characters-using-JavaScript.aspx"
    Quelques modifications y ont été apportées
    */
    private verifyTagsNoSpecialChracter(tags: string[]): boolean {
        // only accepts letters and numbers
        const regex = /^[A-Za-z0-9]+$/;
        return tags.every((elem) => regex.test(elem));
    }
}
