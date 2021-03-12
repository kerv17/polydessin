import { Message } from '@common/communication/message';
import { MetadataService } from 'app/services/metadata.service';
import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Metadata } from '../classes/metadata';
import { TYPES } from '../types';

@injectable()
export class MetadataController {
    router: Router;

    constructor(@inject(TYPES.MetadataService) private metadataService: MetadataService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
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
        });

        this.router.get('/:code', async (req: Request, res: Response, next: NextFunction) => {
            this.metadataService
                .getMetadataByCode(req.params.code)
                .then((metadata: Metadata) => {
                    res.json(metadata);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/:name', async (req: Request, res: Response, next: NextFunction) => {
            this.metadataService
                .getMetadataByName(req.params.name)
                .then((metadata: Metadata[]) => {
                    res.json(metadata);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
        this.router.get('/:tag', async (req: Request, res: Response, next: NextFunction) => {
            this.metadataService
                .getMetadataByTag(req.params.tag)
                .then((metadatas: Metadata[]) => {
                    res.json(metadatas);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            this.metadataService
                .addMetadata(req.body)
                .then(() => {
                    res.sendStatus(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.patch('/', async (req: Request, res: Response, next: NextFunction) => {
            this.metadataService
                .modifyMetadata(req.body)
                .then(() => {
                    res.sendStatus(Httpstatus.OK);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/:code', async (req: Request, res: Response, next: NextFunction) => {
            this.metadataService
                .deleteMetadata(req.params.code)
                .then(() => {
                    const msg: Message = req.body;
                    msg.title = "L'image a ete supprimer";
                    msg.body = Httpstatus.StatusCodes.NO_CONTENT.toString();
                    res.send(msg);
                    res.status(Httpstatus.StatusCodes.NO_CONTENT);
                })
                .catch((error: Error) => {
                    const msg: Message = req.body;
                    msg.title = "L'image ne se trouve pas sur la base de données";
                    msg.body = Httpstatus.StatusCodes.NOT_FOUND.toString();
                    res.send(msg);
                    res.status(Httpstatus.StatusCodes.NOT_FOUND);
                });
        });
        // TODO get qui prend des tags
        /*this.router.get(
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
      // TODO get qui prend des tags+noms
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
    );*/
    }
}
