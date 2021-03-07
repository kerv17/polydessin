import { inject, injectable } from "inversify";
import { Metadata } from "../classes/metadata";
import { Collection, UpdateQuery, FilterQuery, FindOneOptions, FindAndModifyWriteOpResultObject } from "mongodb";
import "reflect-metadata";
import { HttpException } from "src/classes/http.exception";
import { DatabaseService } from "./database.service";
import TYPES from "../types";

// CHANGE the URL for your database information
const DATABASE_COLLECTION = "metadata";

@injectable()
export class CoursesService {

  constructor(
    @inject(TYPES.DatabaseService) private databaseService: DatabaseService
  ) {
  }

  get collection(): Collection<Metadata> {
    return this.databaseService.database.collection(
        DATABASE_COLLECTION
      );
  }

  async getAllMetadata(): Promise<Metadata[]> {
    return this.collection
      .find({})
      .toArray()
      .then((metadata: Metadata[]) => {
        return metadata;
      });
  }

  async getMetadata(aCode: string): Promise<Metadata> {
    // TODO: This can return null if the metadata does not exist, need to handle it
    return this.collection
      .findOne({ code: aCode })
      .then((metadata: Metadata) => {
        return metadata;
      });
  }

  async addMetadata(data: Metadata): Promise<void> {
    if (this.validateMetadata(data)) {
      await this.collection.insertOne(data).catch((error: Error) => {
        throw new HttpException(500, "Failed to insert metadata");
      });
    } else {
      throw new Error("Invalid metadata");
    }
  }

  async deleteMetadata(aCode: string): Promise<void> {
    return this.collection
      .findOneAndDelete({ code: aCode })
      .then((res:FindAndModifyWriteOpResultObject<Metadata>) => {
        if(!res.value){
          throw new Error("Failed to delete metadata");
        }
      })
      .catch(() => {
        throw new Error("Failed to delete metadata");
      });
  }
    // TODO modifier ca pour gerer les arrays de tags
  async modifyMetadata(metadata: Metadata): Promise<void> {
    let filterQuery: FilterQuery<Metadata> = { code: metadata.code };
    let updateQuery: UpdateQuery<Metadata> = {
      $set: {
        code: metadata.code,
        name: metadata.name,
        tags: metadata.tags,
      },
    };
    // Can also use replaceOne if we want to replace the entire object
    return this.collection
      .updateOne(filterQuery, updateQuery)
      .then(() => {})
      .catch(() => {
        throw new Error("Failed to update document");
      });
  }

  async getMetadataName(aCode: string): Promise<string> {
    let filterQuery: FilterQuery<Metadata> = { code: aCode };
    // Only get the name and not any of the other fields
    let projection: FindOneOptions = { projection: { name: 1, _id: 0 } };
    return this.collection
      .findOne(filterQuery, projection)
      .then((metadata: Metadata) => {
        return metadata.name;
      })
      .catch(() => {
        throw new Error("Failed to get data");
      });
  }
  async getCodesByName(aName: string): Promise<Metadata[]> {
    let filterQuery: FilterQuery<Metadata> = { name: aName };
    return this.collection
      .find(filterQuery)
      .toArray()
      .then((metadatas: Metadata[]) => {
        return metadatas;
      })
      .catch(() => {
        throw new Error("No codes for that name");
      });
  }
  // TODO getCodesBy tags

  // TODO getcodesBy name + tags

  private validateMetadata(metadata: Metadata): boolean {
    return (
      this.validateName(metadata.name) ||
      this.validateTags(metadata.tags)
    );
  }
  // TODO define name acceptance rules
  private validateName(name: string): boolean {
    return name.startsWith("Dessin");
  }

  // TODO define tags acceptance rules
  private validateTags(tag: string[]): boolean {
    return true;
    //credits > 0 && credits <= 6;
  }
}
