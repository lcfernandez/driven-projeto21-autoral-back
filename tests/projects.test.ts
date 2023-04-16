import { app } from "../src/app";
import { prisma } from "../src/configs/database";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
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

describe("POST: /projects", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const res = await api.post("/projects");
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if no token is given", async () => {
    const res = await api.post("/projects").set("Authorization", `Bearer `);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const token = faker.lorem.word();
    const res = await api.post("/projects").set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is not found", async () => {
    const userId = faker.datatype.number();
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    const res = await api.post("/projects").set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 422 if body is invalid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const res = await api.post("/projects").set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(422);
  });

  it("Should respond with status 201 if body is valid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const body = { name };

    const res = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(body);
    
    expect(res.status).toBe(201);
  });

  it("Should respond with status 409 if project's name is duplicated", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const body = { name };

    await api.post("/projects").set("Authorization", `Bearer ${token}`).send(body);
    const res = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(body);
    
    expect(res.status).toBe(409);
  });
});

describe("GET: /projects", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const res = await api.get("/projects");
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const token = faker.lorem.word();
    const res = await api.get("/projects").set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 200 if token is valid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const res = await api.get("/projects").set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });
});

describe("GET: /projects/:id/moodboard", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const id = faker.datatype.number();
    const res = await api.get(`/projects/${id}/moodboard`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const token = faker.lorem.word();
    const id = faker.datatype.number();
    const res = await api.get(`/projects/${id}/moodboard`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 200 if token is valid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const createBody = { name };

    const createRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(createBody);
    const { id } = createRes.body;

    const res = await api.get(`/projects/${id}/moodboard`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });

  it("Should respond with status 404 if id is invalid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.lorem.word();

    const res = await api.get(`/projects/${id}/moodboard`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 404 if there is no project with such id", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.datatype.number();

    const res = await api.get(`/projects/${id}/moodboard`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 403 if user is not the owner", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const createBody = { name };

    const createRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(createBody);
    const { id } = createRes.body;

    const secondUserName = faker.name.fullName();
    const secondEmail = faker.internet.email();
    const secondSignUpBody = { name: secondUserName, email: secondEmail, password: secondEmail, confirmPassword: secondEmail };
    await api.post("/sign-up").send(secondSignUpBody);
    
    const secondSignInBody = { email: secondEmail, password: secondEmail };
    const secondSignInRes = await api.post("/sign-in").send(secondSignInBody);
    const secondToken = secondSignInRes.text;

    const res = await api.get(`/projects/${id}/moodboard`).set("Authorization", `Bearer ${secondToken}`);
    
    expect(res.status).toBe(403);
  });
});

describe("GET: /projects/:id/lanes", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const id = faker.datatype.number();
    const res = await api.get(`/projects/${id}/lanes`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const token = faker.lorem.word();
    const id = faker.datatype.number();
    const res = await api.get(`/projects/${id}/lanes`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 200 if token is valid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const createBody = { name };

    const createRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(createBody);
    const { id } = createRes.body;

    const res = await api.get(`/projects/${id}/lanes`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });

  it("Should respond with status 404 if id is invalid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.lorem.word();

    const res = await api.get(`/projects/${id}/lanes`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 404 if there is no project with such id", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.datatype.number();

    const res = await api.get(`/projects/${id}/lanes`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 403 if user is not the owner", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const createBody = { name };

    const createRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(createBody);
    const { id } = createRes.body;

    const secondUserName = faker.name.fullName();
    const secondEmail = faker.internet.email();
    const secondSignUpBody = { name: secondUserName, email: secondEmail, password: secondEmail, confirmPassword: secondEmail };
    await api.post("/sign-up").send(secondSignUpBody);
    
    const secondSignInBody = { email: secondEmail, password: secondEmail };
    const secondSignInRes = await api.post("/sign-in").send(secondSignInBody);
    const secondToken = secondSignInRes.text;

    const res = await api.get(`/projects/${id}/lanes`).set("Authorization", `Bearer ${secondToken}`);
    
    expect(res.status).toBe(403);
  });
});

describe("PUT: /projects/:id", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const id = faker.datatype.number();
    const res = await api.put(`/projects/${id}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const token = faker.lorem.word();
    const id = faker.datatype.number();
    const res = await api.put(`/projects/${id}`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 422 if body is invalid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.datatype.number();

    const res = await api.put(`/projects/${id}`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(422);
  });

  it("Should respond with status 404 if id is invalid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.lorem.word();
    const name = faker.lorem.word();
    const body = { name };

    const res = await api.put(`/projects/${id}`).set("Authorization", `Bearer ${token}`).send(body);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 404 if there is no project for such id", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.datatype.number();
    const name = faker.lorem.word();
    const body = { name };

    const res = await api.put(`/projects/${id}`).set("Authorization", `Bearer ${token}`).send(body);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 409 if project's name is duplicated", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const body = { name };
    await api.post("/projects").set("Authorization", `Bearer ${token}`).send(body);

    const secondName = faker.lorem.word();
    const secondBody = { name: secondName };
    const secondProjectRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(secondBody);
    const { id } = secondProjectRes.body;
    
    const res = await api.put(`/projects/${id}`).set("Authorization", `Bearer ${token}`).send(body);
    
    expect(res.status).toBe(409);
  });

  it("Should respond with status 200 if body is valid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const body = { name };
    const createRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(body);
    const { id } = createRes.body;

    const secondName = faker.lorem.word();
    const secondBody = { name: secondName };
    
    const res = await api.put(`/projects/${id}`).set("Authorization", `Bearer ${token}`).send(secondBody);
    
    expect(res.status).toBe(200);
  });

  it("Should respond with status 403 if user is not the owner", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const body = { name };
    const createRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(body);
    const { id } = createRes.body;

    const secondName = faker.lorem.word();
    const secondBody = { name: secondName };

    const secondUserName = faker.name.fullName();
    const secondEmail = faker.internet.email();
    const secondSignUpBody = { name: secondUserName, email: secondEmail, password: secondEmail, confirmPassword: secondEmail };
    await api.post("/sign-up").send(secondSignUpBody);
    
    const secondSignInBody = { email: secondEmail, password: secondEmail };
    const secondSignInRes = await api.post("/sign-in").send(secondSignInBody);
    const secondToken = secondSignInRes.text;
    
    const res = await api.put(`/projects/${id}`).set("Authorization", `Bearer ${secondToken}`).send(secondBody);
    
    expect(res.status).toBe(403);
  });
});

describe("DELETE: /projects/:id", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const id = faker.datatype.number();
    const res = await api.delete(`/projects/${id}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const token = faker.lorem.word();
    const id = faker.datatype.number();
    const res = await api.delete(`/projects/${id}`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 200 if token is valid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const createBody = { name };

    const createRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(createBody);
    const { id } = createRes.body;

    const res = await api.delete(`/projects/${id}`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });

  it("Should respond with status 404 if id is invalid", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.lorem.word();

    const res = await api.delete(`/projects/${id}`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 404 if there is no project with such id", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.datatype.number();

    const res = await api.delete(`/projects/${id}`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 403 if user is not the owner", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const name = faker.lorem.word();
    const createBody = { name };

    const createRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(createBody);
    const { id } = createRes.body;

    const secondUserName = faker.name.fullName();
    const secondEmail = faker.internet.email();
    const secondSignUpBody = { name: secondUserName, email: secondEmail, password: secondEmail, confirmPassword: secondEmail };
    await api.post("/sign-up").send(secondSignUpBody);
    
    const secondSignInBody = { email: secondEmail, password: secondEmail };
    const secondSignInRes = await api.post("/sign-in").send(secondSignInBody);
    const secondToken = secondSignInRes.text;

    const res = await api.delete(`/projects/${id}`).set("Authorization", `Bearer ${secondToken}`);
    
    expect(res.status).toBe(403);
  });
});
