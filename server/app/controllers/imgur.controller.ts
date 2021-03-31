import { ImgurSaveService } from '@app/services/imgur-save.service';
import { Message } from '@common/communication/message';
import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
@injectable()
export class ImgurController {
    router: Router;

    constructor(@inject(TYPES.ImgurSaveService) private imgurService: ImgurSaveService) {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            this.imgurService
                .addData(req.body)
                .then((https: string) => {
                    const message = { title: 'link', body: https } as Message;

                    res.json(message);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
