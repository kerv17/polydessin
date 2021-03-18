import { TYPES } from '@app/types';
import { inject, injectable } from 'inversify';
import { Collection, FindAndModifyWriteOpResultObject, ObjectId } from 'mongodb';
import 'reflect-metadata';
import { HttpException } from '../classes/http.exceptions';
import { Metadata } from '../classes/metadata';
import { DatabaseService } from './database.service';

const DATABASE_COLLECTION = 'metadata';
const MAX_SIZE_TAG = 20;
const MIN_SIZE_TAG = 3;

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
                return metadata;
            });
    }

    // TODO getMetadataByTags
    async getMetadataByTags(tagsToFind: string[]): Promise<Metadata[]> {
        return this.collection
            .find({ tags: { $in: tagsToFind } })
            .toArray()
            .then((metadatas: Metadata[]) => {
                return metadatas;
            })

            .catch(() => {
                throw new Error('Failed to get data');
            });
    }
    // TODO getMetadataByNameAndTags

    async addMetadata(metadata: Metadata): Promise<void> {
        if (this.validateMetadata(metadata)) {
            await this.collection
                .insertOne(metadata)
                .catch((error: Error) => {
                    throw new HttpException(500, 'Failed to insert metadata');
                })
                .catch((error: Error) => {
                    throw new Error(error.message);
                });
        } else {
            throw new Error('Invalid metadata');
        }
    }

    async deleteMetadata(aCode: string): Promise<void> {
        return this.collection
            .findOneAndDelete({ codeID: new ObjectId(aCode) })
            .then((res: FindAndModifyWriteOpResultObject<Metadata>) => {
                if (!res.value) {
                    throw new Error('Failed to delete metadata');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete metadata');
            });
    }
    /*
    // TODO is this necessary?
    async modifyMetadata(metadata: Metadata): Promise<void> {
        if (this.validateMetadata(metadata)) {
            const filterQuery: FilterQuery<Metadata> = { code: metadata.codeID };
            const updateQuery: UpdateQuery<Metadata> = {
                $set: {
                    code: metadata.codeID,
                    name: metadata.name,
                    tags: metadata.tags,
                },
            };
            // Can also use replaceOne if we want to replace the entire object
            return this.collection
                .updateOne(filterQuery, updateQuery)
                .then(() => {})
                .catch(() => {
                    throw new Error('Failed to update document');
                });
        }
    }
    */
    private validateMetadata(metadata: Metadata): boolean {
        return this.validateName(metadata.name) && this.validateTags(metadata.tags);
    }
    // TODO define name acceptance rules
    private validateName(name: string): boolean {
        return name.startsWith('Dessin');
    }

    // TODO define tags acceptance rules
    private validateTags(tags: string[]): boolean {
        if (tags.length === 0) {
            // il est accepter qu'un dessin peut ne pas avoir de tag
            return true;
        } else {
            if (
                this.verifyTagsNotNull(tags) &&
                this.verifyTagsTooLong(tags) &&
                this.verifyTagsTooShort(tags) &&
                this.verifyTagsNoSpecialChracter(tags)
            ) {
                return true;
            }
            return false;
        }
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
