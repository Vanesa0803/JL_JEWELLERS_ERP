const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const billRoutes = require("./routes/billRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const cashBookRoutes = require("./routes/cashBookRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const financeRoutes = require("./routes/financeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const limiter = require("./middleware/rateLimiter");
const exportRoutes = require("./routes/exportRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(limiter);

app.use("/api/ledger", ledgerRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/cashbook", cashBookRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/export", exportRoutes);

app.get("/", (req, res) => {
    res.send("🚀 JL Jewellers ERP Backend Running");
});

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "API Not Found"

    });

});

module.exports = app;