const express = require("express");
const next = require("next");
const TradeData = require("./models/FXData");
const mongoose = require("mongoose");
const { request } = require("http");
require("dotenv").config();
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const MONGO_URI = process.env.MONGO_URI;
app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.post("/trades", async (req, res) => {
    try {
      const trade = new TradeData(req.body);
      await trade.save();
      console.log("Trade saved:", trade);
      res.status(201).json(trade);
    } catch (err) {
      console.error("Error saving trade:", err.message, req.body);
      res.status(400).json({ error: err.message });
    }
  });
  server.put("/trades/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const trade = req.body;

      if (!id) {
        return res.status(400).json({ error: "Trade ID is required" });
      }

      const updatedTrade = await TradeData.findByIdAndUpdate(id, trade, {
        new: true,
      });

      if (!updatedTrade) {
        return res.status(404).json({ error: "Trade not found" });
      }

      console.log(`Updated trade with ID: ${id}`, updatedTrade);
      res.status(200).json(updatedTrade);
    } catch (err) {
      console.error("Error updating trade:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
  server.get("/trades", async (req, res) => {
    try {
      const trades = await TradeData.find();
      console.log("Fetched trades:", trades);
      res.json(trades);
    } catch (err) {
      console.error("Error fetching trades:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
  server.delete("/trades/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Trade ID is required" });
      }

      const result = await TradeData.findByIdAndDelete(id);

      if (!result) {
        return res.status(404).json({ error: "Trade not found" });
      }

      console.log(`Deleted trade with ID: ${id}`);
      res
        .status(200)
        .json({ message: "Trade deleted successfully", deletedTrade: result });
    } catch (err) {
      console.error("Error deleting trade:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(5000, async (err) => {
    if (err) throw err;
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      process.exit(1); // Exit process with failure
    }
    console.log("Server ready on http://localhost:5000");
  });
});
