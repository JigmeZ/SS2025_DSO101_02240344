const request = require("supertest");
const { app } = require("./server");

describe("Todo API Tests", () => {
  test("GET /api/health should return ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test("basic math works", () => {
    expect(1 + 1).toBe(2);
  });
});