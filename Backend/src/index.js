const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables from .env file
dotenv.config({ quiet: true });

const port = process.env.PORT || 8000;

// Connect to MongoDB Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Database connected successfully');
    
    // Start the server only after successful DB connection
    app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1); // Exit process with failure
  });





