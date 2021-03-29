import { ImgurSaveService } from '@app/services/imgur-save.service';
import { NextFunction, Request, Response, Router } from 'express';
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
            this.imgurService.addData(req.body).catch();
        });
    }
}
