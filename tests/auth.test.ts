import { app } from "../src/app";
import { prisma } from "../src/configs/database";
import { faker } from "@faker-js/faker";

import supertest from "supertest";

const api = supertest(app);

beforeEach(async () => {
  await prisma.cards.deleteMany();
  await prisma.lanes.deleteMany();
  await prisma.moodboards_images.deleteMany();
  await prisma.moodboards.deleteMany();
  await prisma.projects.deleteMany();
  await prisma.users.deleteMany();
});

describe("POST: /sign-up", () => {
  it("Should respond with status 422 if body is invalid", async () => {
    const res = await api.post("/sign-up");
    
    expect(res.status).toBe(422);
  });

  it("Should respond with status 201 if body is valid", async () => {
    const name = faker.name.fullName();
    const email = faker.internet.email();
    const body = { name, email, password: email, confirmPassword: email };

    const res = await api.post("/sign-up").send(body);
    
    expect(res.status).toBe(201);
  });

  it("Should respond with status 409 if e-mail is duplicated", async () => {
    const name = faker.name.fullName();
    const email = faker.internet.email();
    const body = { name, email, password: email, confirmPassword: email };

    await api.post("/sign-up").send(body);

    const res = await api.post("/sign-up").send(body);
    
    expect(res.status).toBe(409);
  });
});

describe("POST: /sign-in", () => {
  it("Should respond with status 422 if body is invalid", async () => {
    const res = await api.post("/sign-in");
    
    expect(res.status).toBe(422);
  });

  it("Should respond with status 401 if email is not registered", async () => {
    const email = faker.internet.email();

    const res = await api.post("/sign-in").send({ email, password: email});
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 200 if body is valid", async () => {
    const name = faker.name.fullName();
    const email = faker.internet.email();
    const body = { name, email, password: email, confirmPassword: email };

    await api.post("/sign-up").send(body);

    const res = await api.post("/sign-in").send({ email, password: email});
    
    expect(res.status).toBe(200);
  });

  it("Should respond with status 401 if credentials are invalid", async () => {
    const name = faker.name.fullName();
    const email = faker.internet.email();
    const body = { name, email, password: email, confirmPassword: email };

    await api.post("/sign-up").send(body);

    const res = await api.post("/sign-in").send({ email, password: name });
    
    expect(res.status).toBe(401);
  });
});
