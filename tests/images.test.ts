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
 
describe("POST: /images", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const res = await api.post("/images");
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const token = faker.lorem.word();
    const res = await api.post("/images").set("Authorization", `Bearer ${token}`);
    
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

    const res = await api.post("/images").set("Authorization", `Bearer ${token}`);
    
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

    const projectName = faker.lorem.word();
    const projectBody = { name: projectName };
    const projectRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(projectBody);
    const { id } = projectRes.body;
    const url = faker.internet.url();
    const body = { url, moodboard_id: id };

    const res = await api.post("/images").set("Authorization", `Bearer ${token}`).send(body);
    
    expect(res.status).toBe(201);
  });

  it("Should respond with status 404 if there is no moodboard with such id", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const url = faker.internet.url();
    const moodboardId = faker.datatype.number();
    const body = { url, moodboard_id: moodboardId };

    const res = await api.post("/images").set("Authorization", `Bearer ${token}`).send(body);
    
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

    const projectName = faker.lorem.word();
    const projectBody = { name: projectName };
    const projectRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(projectBody);
    const { id } = projectRes.body;
    const url = faker.internet.url();
    const body = { url, moodboard_id: id };

    const secondUserName = faker.name.fullName();
    const secondEmail = faker.internet.email();
    const secondSignUpBody = { name: secondUserName, email: secondEmail, password: secondEmail, confirmPassword: secondEmail };
    await api.post("/sign-up").send(secondSignUpBody);
    
    const secondSignInBody = { email: secondEmail, password: secondEmail };
    const secondSignInRes = await api.post("/sign-in").send(secondSignInBody);
    const secondToken = secondSignInRes.text;

    const res = await api.post("/images").set("Authorization", `Bearer ${secondToken}`).send(body);
    
    expect(res.status).toBe(403);
  });
});

describe("DELETE: /images/:id", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const id = faker.datatype.number();
    const res = await api.delete(`/images/${id}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const id = faker.datatype.number();
    const token = faker.lorem.word();
    const res = await api.delete(`/images/${id}`).set("Authorization", `Bearer ${token}`);
    
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

    const projectName = faker.lorem.word();
    const projectBody = { name: projectName };
    const projectRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(projectBody);
    const moodboardId = projectRes.body.id;
    const url = faker.internet.url();
    const body = { url, moodboard_id: moodboardId };

    const createImageRes = await api.post("/images").set("Authorization", `Bearer ${token}`).send(body);
    const { id } = createImageRes.body;

    const res = await api.delete(`/images/${id}`).set("Authorization", `Bearer ${token}`);
    
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

    const res = await api.delete(`/images/${id}`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 404 if there is no image with such id", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.datatype.number();

    const res = await api.delete(`/images/${id}`).set("Authorization", `Bearer ${token}`);
    
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

    const projectName = faker.lorem.word();
    const projectBody = { name: projectName };
    const projectRes = await api.post("/projects").set("Authorization", `Bearer ${token}`).send(projectBody);
    const moodboardId = projectRes.body.id;
    const url = faker.internet.url();
    const body = { url, moodboard_id: moodboardId };

    const createImageRes = await api.post("/images").set("Authorization", `Bearer ${token}`).send(body);
    const { id } = createImageRes.body;

    const secondUserName = faker.name.fullName();
    const secondEmail = faker.internet.email();
    const secondSignUpBody = { name: secondUserName, email: secondEmail, password: secondEmail, confirmPassword: secondEmail };
    await api.post("/sign-up").send(secondSignUpBody);
    
    const secondSignInBody = { email: secondEmail, password: secondEmail };
    const secondSignInRes = await api.post("/sign-in").send(secondSignInBody);
    const secondToken = secondSignInRes.text;

    const res = await api.delete(`/images/${id}`).set("Authorization", `Bearer ${secondToken}`);
    
    expect(res.status).toBe(403);
  });
});
