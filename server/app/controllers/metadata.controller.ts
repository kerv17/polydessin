import { CanvasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { DataAccessService } from 'app/services/data-access.service';
import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class MetadataController {
    router: Router;

    constructor(@inject(TYPES.DataAccessService) private dataAccessService: DataAccessService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/:tags', async (req: Request, res: Response, next: NextFunction) => {
            this.dataAccessService
                .getDataByTags(req.params.tags)
                .then((information: CanvasInformation[]) => {
                    res.json(information);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            this.dataAccessService
                .getAllData()
                .then((information: CanvasInformation[]) => {
                    res.json(information);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            this.dataAccessService
                .addData(req.body)
                .then(() => {
                    const msg = {} as Message;
                    msg.title = "L'image a été enregistrée";
                    res.status(Httpstatus.StatusCodes.CREATED).send(msg);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/:code', async (req: Request, res: Response, next: NextFunction) => {
            this.dataAccessService
                .deleteData(req.params.code)
                .then(() => {
                    const msg: Message = req.body;
                    msg.title = "L'image a été supprimée";
                    msg.body = Httpstatus.StatusCodes.NO_CONTENT.toString();
                    res.send(msg);
                    res.status(Httpstatus.StatusCodes.NO_CONTENT);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
