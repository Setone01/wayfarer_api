import request from "supertest";
import app from "../server";
import HttpStatus from "http-status-codes";

export const userTests = () => {
  describe("User Test", () => {
    it("should create a user successfully", async () => {
      const userObj = {
        first_name: "Dan",
        last_name: "Steve",
        email: "steajobs@example.com",
        password: "fnvnvvjvj",
        role: "user",
      };
      const response = await request(app)
        .post(`/api/v1/auth/signup`)
        .send(userObj)
        .set("Accept", "application/json");

      expect(response.statusCode).toEqual(HttpStatus.CREATED);
      expect(response.body.status).toEqual("success");
    });

    it("should return an error if missing required fields", async () => {
      const userObj = {
        first_name: " ",
        last_name: " ",
        email: " ",
        password: " ",
        role: " ",
      };
      const response = await request(app)
        .post(`/api/v1/auth/signup`)
        .send(userObj)
        .set("Accept", "application/json");

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body.status).toEqual("Invalid request");
    });
  });
};
