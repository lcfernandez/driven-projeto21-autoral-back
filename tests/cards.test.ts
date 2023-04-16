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

describe("POST: /cards", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const res = await api.post("/cards");
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const token = faker.lorem.word();
    const res = await api.post("/cards").set("Authorization", `Bearer ${token}`);
    
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

    const res = await api.post("/cards").set("Authorization", `Bearer ${token}`);
    
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
    const projectId = projectRes.body.id;
    const laneTitle = faker.lorem.word();
    const laneBody = { title: laneTitle, project_id: projectId };

    const laneRes = await api.post("/lanes").set("Authorization", `Bearer ${token}`).send(laneBody);
    const { id } = laneRes.body;
    
    const title = faker.lorem.word();
    const body = { title, lane_id: id };

    const res = await api.post("/cards").set("Authorization", `Bearer ${token}`).send(body);

    expect(res.status).toBe(201);
  });

  it("Should respond with status 404 if there is no lane with such id", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const projectName = faker.lorem.word();
    const projectBody = { name: projectName };
    await api.post("/projects").set("Authorization", `Bearer ${token}`).send(projectBody);
    
    const title = faker.lorem.word();
    const id = faker.datatype.number();
    const body = { title, lane_id: id };

    const res = await api.post("/cards").set("Authorization", `Bearer ${token}`).send(body);
    
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
    const projectId = projectRes.body.id;  
    const laneTitle = faker.lorem.word();
    const laneBody = { title: laneTitle, project_id: projectId };

    const laneRes = await api.post("/lanes").set("Authorization", `Bearer ${token}`).send(laneBody);
    const { id } = laneRes.body;
    
    const title = faker.lorem.word();
    const body = { title, lane_id: id };

    const secondUserName = faker.name.fullName();
    const secondEmail = faker.internet.email();
    const secondSignUpBody = { name: secondUserName, email: secondEmail, password: secondEmail, confirmPassword: secondEmail };
    await api.post("/sign-up").send(secondSignUpBody);
    
    const secondSignInBody = { email: secondEmail, password: secondEmail };
    const secondSignInRes = await api.post("/sign-in").send(secondSignInBody);
    const secondToken = secondSignInRes.text;

    const res = await api.post("/cards").set("Authorization", `Bearer ${secondToken}`).send(body);
    
    expect(res.status).toBe(403);
  });
});

describe("PUT: /cards/:id", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const id = faker.datatype.number();
    const res = await api.put(`/cards/${id}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const token = faker.lorem.word();
    const id = faker.datatype.number();
    const res = await api.put(`/cards/${id}`).set("Authorization", `Bearer ${token}`);
    
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

    const res = await api.put(`/cards/${id}`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(422);
  });

  it("Should respond with status 200 if body is valid", async () => {
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
    const projectId = projectRes.body.id;
    const laneTitle = faker.lorem.word();
    const laneBody = { title: laneTitle, project_id: projectId };

    const laneRes = await api.post("/lanes").set("Authorization", `Bearer ${token}`).send(laneBody);
    const laneId = laneRes.body.id;

    const title = faker.lorem.word();
    const body = { title, lane_id: laneId };

    const createRes = await api.post("/cards").set("Authorization", `Bearer ${token}`).send(body);
    const { id } = createRes.body;

    const secondTitle = faker.lorem.word();
    const secondBody = { title: secondTitle, lane_id: laneId };

    const res = await api.put(`/cards/${id}`).set("Authorization", `Bearer ${token}`).send(secondBody);
    
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
    const title = faker.lorem.word();
    const laneId = faker.datatype.number();
    const body = { title, lane_id: laneId };

    const res = await api.put(`/cards/${id}`).set("Authorization", `Bearer ${token}`).send(body);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 404 if there is no card with such id", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;
    
    const id = faker.datatype.number();
    const title = faker.lorem.word();
    const laneId = faker.datatype.number();
    const body = { title, lane_id: laneId };

    const res = await api.put(`/cards/${id}`).set("Authorization", `Bearer ${token}`).send(body);
    
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
    const projectId = projectRes.body.id;
    const laneTitle = faker.lorem.word();
    const laneBody = { title: laneTitle, project_id: projectId };

    const laneRes = await api.post("/lanes").set("Authorization", `Bearer ${token}`).send(laneBody);
    const laneId = laneRes.body.id;

    const title = faker.lorem.word();
    const body = { title, lane_id: laneId };

    const createRes = await api.post("/cards").set("Authorization", `Bearer ${token}`).send(body);
    const { id } = createRes.body;

    const secondTitle = faker.lorem.word();
    const secondBody = { title: secondTitle, lane_id: laneId };

    const secondUserName = faker.name.fullName();
    const secondEmail = faker.internet.email();
    const secondSignUpBody = { name: secondUserName, email: secondEmail, password: secondEmail, confirmPassword: secondEmail };
    await api.post("/sign-up").send(secondSignUpBody);
    
    const secondSignInBody = { email: secondEmail, password: secondEmail };
    const secondSignInRes = await api.post("/sign-in").send(secondSignInBody);
    const secondToken = secondSignInRes.text;

    const res = await api.put(`/cards/${id}`).set("Authorization", `Bearer ${secondToken}`).send(secondBody);
    
    expect(res.status).toBe(403);
  });
});

describe("DELETE: /cards/:id", () => {
  it("Should respond with status 401 if no header is given", async () => {
    const id = faker.datatype.number();
    const res = await api.delete(`/cards/${id}`);
    
    expect(res.status).toBe(401);
  });

  it("Should respond with status 401 if token is invalid", async () => {
    const id = faker.datatype.number();
    const token = faker.lorem.word();
    const res = await api.delete(`/cards/${id}`).set("Authorization", `Bearer ${token}`);
    
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
    const projectId = projectRes.body.id;
    const laneTitle = faker.lorem.word();
    const laneBody = { title: laneTitle, project_id: projectId };

    const laneRes = await api.post("/lanes").set("Authorization", `Bearer ${token}`).send(laneBody);
    const laneId = laneRes.body.id;

    const title = faker.lorem.word();
    const body = { title, lane_id: laneId };

    const createRes = await api.post("/cards").set("Authorization", `Bearer ${token}`).send(body);
    const { id } = createRes.body;

    const res = await api.delete(`/cards/${id}`).set("Authorization", `Bearer ${token}`);
    
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

    const res = await api.delete(`/cards/${id}`).set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });

  it("Should respond with status 404 if there is no card with such id", async () => {
    const userName = faker.name.fullName();
    const email = faker.internet.email();
    const signUpBody = { name: userName, email, password: email, confirmPassword: email };
    await api.post("/sign-up").send(signUpBody);
    
    const signInBody = { email, password: email };
    const signInRes = await api.post("/sign-in").send(signInBody);
    const token = signInRes.text;

    const id = faker.datatype.number();

    const res = await api.delete(`/cards/${id}`).set("Authorization", `Bearer ${token}`);
    
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
    const projectId = projectRes.body.id;
    const laneTitle = faker.lorem.word();
    const laneBody = { title: laneTitle, project_id: projectId };

    const laneRes = await api.post("/lanes").set("Authorization", `Bearer ${token}`).send(laneBody);
    const laneId = laneRes.body.id;

    const title = faker.lorem.word();
    const body = { title, lane_id: laneId };

    const createRes = await api.post("/cards").set("Authorization", `Bearer ${token}`).send(body);
    const { id } = createRes.body;

    const secondUserName = faker.name.fullName();
    const secondEmail = faker.internet.email();
    const secondSignUpBody = { name: secondUserName, email: secondEmail, password: secondEmail, confirmPassword: secondEmail };
    await api.post("/sign-up").send(secondSignUpBody);
    
    const secondSignInBody = { email: secondEmail, password: secondEmail };
    const secondSignInRes = await api.post("/sign-in").send(secondSignInBody);
    const secondToken = secondSignInRes.text;

    const res = await api.delete(`/cards/${id}`).set("Authorization", `Bearer ${secondToken}`);
    
    expect(res.status).toBe(403);
  });
});
