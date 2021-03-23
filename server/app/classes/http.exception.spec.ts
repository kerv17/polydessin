import { expect } from 'chai';
import { describe } from 'mocha';
import { HttpException } from './http.exceptions';

describe('HttpException', () => {
    const HTTP_OK = 200;
    it('should create a simple HTTPException', () => {
        const createdMessage = 'Course created successfuly';
        const httpException: HttpException = new HttpException(HTTP_OK, createdMessage);

        expect(httpException.message).to.equals(createdMessage);
    });
});
