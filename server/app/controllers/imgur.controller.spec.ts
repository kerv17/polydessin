import { Application } from '@app/app';
import { ImgurSaveService } from '@app/services/imgur-save.service';
import { TYPES } from '@app/types';
import { CanvasInformation } from '@common/communication/canvas-information';
import { expect } from 'chai';
import { ObjectId } from 'mongodb';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;

describe('ImgurController', () => {
    // const baseInformation = { name: 'aName', tags: ['tag1', 'tag2'], format: 'png', width: 0, height: 0, imageData: '' } as CanvasInformation;
    let imgurSaveService: Stubbed<ImgurSaveService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.ImgurSaveService).toConstantValue({
            uploadImage: sandbox.stub().resolves(),
        });
        imgurSaveService = container.get(TYPES.ImgurSaveService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should store canvasInformation in the array on valid post request to root', async () => {
        const testinformation2: CanvasInformation = {
            codeID: new ObjectId('507f1f77bcf86cd799439012').toHexString(),
            name: 'DessinTest2',
            tags: ['tagUnique', 'tag2'],
            format: 'jpeg',
            height: 300,
            width: 300,
            imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD',
        };
        return supertest(app).post('/api/imgur/').send(testinformation2).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });
    it('should return an error as a message on post request fail', async () => {
        imgurSaveService.uploadImage.rejects(new Error('service error'));
        return supertest(app)
            .post('/api/imgur/')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response) => {
                expect(response.status).to.equal(HTTP_STATUS_NOT_FOUND);
            });
    });
});
