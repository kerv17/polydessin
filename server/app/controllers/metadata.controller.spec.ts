import { Application } from '@app/app';
import { DataAccessService } from '@app/services/data-access.service';
import { TYPES } from '@app/types';
import { CanvasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { expect } from 'chai';
import * as Httpstatus from 'http-status-codes';
import { ObjectId } from 'mongodb';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_NOT_FOUND = 404;

describe('MetadataController', () => {
    const baseInformation = { name: 'aName', tags: ['tag1', 'tag2'], format: 'png', width: 0, height: 0, imageData: '' } as CanvasInformation;
    let dataAccessService: Stubbed<DataAccessService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DataAccessService).toConstantValue({
            getAllData: sandbox.stub().resolves([baseInformation, baseInformation]),
            getDataByTags: sandbox.stub().resolves(baseInformation),
            addData: sandbox.stub().resolves(),
            deleteData: sandbox.stub().resolves(),
        });
        dataAccessService = container.get(TYPES.DataAccessService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return an array of canvasInformation on valid get request to root', async () => {
        return supertest(app)
            .get('/api/metadata/')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal([baseInformation, baseInformation]);
            });
    });
    it('should return an error as a message on get request fail', async () => {
        dataAccessService.getAllData.rejects(new Error('service error'));
        return supertest(app)
            .get('/api/metadata/')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.status).to.equal(HTTP_STATUS_NOT_FOUND);
            });
    });

    it('should return canvasInformation from data access service on valid get request to tag route', async () => {
        return supertest(app)
            .get('/api/metadata/:tags')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(baseInformation);
            });
    });
    it('should return an error as a message on get request with tag fail', async () => {
        dataAccessService.getDataByTags.rejects(new Error('service error'));
        return supertest(app)
            .get('/api/metadata/:tags')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.status).to.equal(HTTP_STATUS_NOT_FOUND);
            });
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
        return supertest(app).post('/api/metadata/').send(testinformation2).set('Accept', 'application/json').expect(HTTP_STATUS_CREATED);
    });
    it('should return an error as a message on post request fail', async () => {
        dataAccessService.addData.rejects(new Error('service error'));
        return supertest(app)
            .post('/api/metadata/')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.status).to.equal(HTTP_STATUS_NOT_FOUND);
            });
    });

    it('should return a messages on valid delete request', async () => {
        const msg = {
            title: "L'image a ete supprimer",
            body: Httpstatus.StatusCodes.NO_CONTENT.toString(),
        } as Message;

        return supertest(app)
            .delete('/api/metadata/:code')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(msg);
            });
    });
    it('should return an error as a message on delete request fail', async () => {
        dataAccessService.deleteData.rejects(new Error('service error'));
        return supertest(app)
            .delete('/api/metadata/:code')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.status).to.equal(HTTP_STATUS_NOT_FOUND);
            });
    });
});
