import { HttpException } from "./http.exceptions";
import { expect } from "chai";
import { describe } from "mocha";

describe("HttpException", () => {
  it("should create a simple HTTPException", () => {
    const createdMessage = "Course created successfuly";
    const httpException: HttpException = new HttpException(200, createdMessage);

    expect(httpException.message).to.equals(createdMessage);
  });
});
