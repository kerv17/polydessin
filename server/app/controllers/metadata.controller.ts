import { NextFunction, Request, Response, Router } from "express";
import * as Httpstatus from "http-status-codes";
import { inject, injectable } from "inversify";

import TYPES from "../types";
import { Metadata } from "../classes/metadata";
import { MetadataService } from "src/services/metadata.service";

@injectable()
export class MetadataController {
  router: Router;

  constructor(
    @inject(TYPES.MetadataService) private metadataService: MetadataService
  ) {
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router = Router();

    this.router.get(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        this.metadataService
          .getAllMetadata()
          .then((metadata: Metadata[]) => {
            res.json(metadata);
          })
          .catch((error: Error) => {
            res.status(Httpstatus.NOT_FOUND).send(error.message);
          });
        
        // Can also use the async/await syntax
        // try{
        //   const courses = await this.coursesService.getAllCourses();
        //   res.json(courses);
        // }
        // catch(error){
        //   res.status(Httpstatus.NOT_FOUND).send(error.message);
        // }
      }
    );
      // TODO change when change service
    this.router.get(
      "/:subjectCode",
      async (req: Request, res: Response, next: NextFunction) => {
        this.metadataService
          .getMetadata(req.params.subjectCode)
          .then((metadata: Metadata) => {
            res.json(metadata);
          })
          .catch((error: Error) => {
            res.status(Httpstatus.NOT_FOUND).send(error.message);
          });
      }
    );

    this.router.post(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body);
        this.metadataService
          .addMetadata(req.body)
          .then(() => {
            res.sendStatus(Httpstatus.CREATED).send();
          })
          .catch((error: Error) => {
            res.status(Httpstatus.NOT_FOUND).send(error.message);
          });
      }
    );

    this.router.patch(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        this.metadataService
          .modifyMetadata(req.body)
          .then(() => {
            res.sendStatus(Httpstatus.OK);
          })
          .catch((error: Error) => {
            res.status(Httpstatus.NOT_FOUND).send(error.message);
          });
      }
    );
      // TODO change after change to service
    this.router.delete(
      "/:subjectCode",
      async (req: Request, res: Response, next: NextFunction) => {
        this.metadataService
          .deleteMetadata(req.params.subjectCode)
          .then(() => {
            res.sendStatus(Httpstatus.NO_CONTENT).send();
          })
          .catch((error: Error) => {
            res.status(Httpstatus.NOT_FOUND).send(error.message);
          });
      }
    );
       // TODO change after change to service
    this.router.get(
      "/teachers/code/:subjectCode",
      async (req: Request, res: Response, next: NextFunction) => {
        this.metadataService
          .getCourseTeacher(req.params.subjectCode)
          .then((teacher: string) => {
            res.send(teacher);
          })
          .catch((error: Error) => {
            res.status(Httpstatus.NOT_FOUND).send(error.message);
          });
      }
    );

    this.router.get(
      "/teachers/name/:name",
      async (req: Request, res: Response, next: NextFunction) => {
        this.metadataService
          .getCoursesByTeacher(req.params.name)
          .then((courses: Course[]) => {
            res.send(courses);
          })
          .catch((error: Error) => {
            res.status(Httpstatus.NOT_FOUND).send(error.message);
          });
      }
    );
  }
}
