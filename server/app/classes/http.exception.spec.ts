import { expect } from "chai";
import { describe } from "mocha";
import { HttpException } from "./http.exceptions";

describe("HttpException", () => {
  it("should create a simple HTTPException", () => {
    const createdMessage = "Course created successfuly";
    const httpException: HttpException = new HttpException(200, createdMessage);

    expect(httpException.message).to.equals(createdMessage);
  });
  /*it("should create a simple HTTPException", () => {
    const createdMessage = "Course created successfuly";
    const httpException: HttpException = new HttpException(createdMessage);

    expect(httpException.message).to.equals(createdMessage);
    expect(httpException.status).to.equals(200);
  });*/
});
