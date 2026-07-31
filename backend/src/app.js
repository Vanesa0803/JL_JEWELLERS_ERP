const express = require("express");
const cors = require("cors");

const billRoutes = require("./routes/billRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.send("🚀 JL Jewellers ERP Backend Running");
});

module.exports = app;