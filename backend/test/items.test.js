const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

let app;
let itemId;

const MONGO_URI = process.env.MONGO_URI;

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);

  const Item = mongoose.model(
    "Item",
    new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now },
    })
  );

  app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/items", async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const item = new Item(req.body);
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ error: "Item not found" });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const item = await Item.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ error: "Item not found" });
      res.json({ message: "Item deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

afterAll(async () => {
  if (itemId) {
    await mongoose.connection.db.collection("items").deleteOne({ _id: itemId });
  }
  await mongoose.connection.close();
});

describe("API Tests", () => {
  test("GET /api/health should return status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("POST /api/items should create a new item", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ name: "Test Item", description: "Test Description" });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Test Item");
    expect(res.body.description).toBe("Test Description");
    itemId = res.body._id;
  });

  test("GET /api/items should return all items", async () => {
    const res = await request(app).get("/api/items");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /api/items/:id should return a single item", async () => {
    const res = await request(app).get(`/api/items/${itemId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Item");
  });

  test("GET /api/items/:id should return 404 for non-existent item", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/items/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test("POST /api/items should return 400 for missing name", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ description: "No name" });
    expect(res.statusCode).toBe(400);
  });

  test("DELETE /api/items/:id should delete an item", async () => {
    const res = await request(app).delete(`/api/items/${itemId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item deleted");
  });

  test("DELETE /api/items/:id should return 404 for non-existent item", async () => {
    const res = await request(app).delete(`/api/items/${itemId}`);
    expect(res.statusCode).toBe(404);
  });
});
