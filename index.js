//[Dependencies and Modules]
const express = require("express");
const mongoose = require("mongoose");
//allows our backend app to be available to our frontend app
//allows to control the app's CORS settings
const cors = require("cors");

//Routes Middleware
//allows access to routes defined within our app
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000", // Local development (frontend)
  // "https://fitnessapp-client.vercel.app", // Vercel frontend (remove for now since not deployed)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        // Allow requests with no origin (like Postman or curl requests)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 4000;

// MongoDB connection
mongoose.connect(
  "mongodb+srv://admin:admin123@wdc028-b461.qifgo.mongodb.net/fitness-app-API?retryWrites=true&w=majority&appName=WDC028-B461",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas.")
);

// [Backend Routes]
app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

// Start the server
if (require.main === module) {
  app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${process.env.PORT || port}`);
  });
}

module.exports = { app, mongoose };
