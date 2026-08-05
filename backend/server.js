require("dotenv").config();
const app = require("./app");
require("./config/db");



const PORT = process.env.PORT || 5005;

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});