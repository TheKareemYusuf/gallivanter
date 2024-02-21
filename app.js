const express = require("express");
const CONFIG = require("./config/config");
const cors = require("cors");
const bodyParser = require("body-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");


const userAuthRouter = require("./routes/userAuthRoutes");
const creatorAuthRouter = require("./routes/creatorAuthRoutes");
const creatorTourRouter = require('./routes/creatorTourRoutes');
const publicTourRouter = require('./routes/publicTourRoutes');
const creatorRouter = require('./routes/creatorRoutes');
const userRouter = require('./routes/userRoutes');
const userTourRouter = require('./routes/userTourRoutes');



const app = express();

// const corsOptions = {
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   // optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

app.use(cors());


console.log(app.get("env"));
console.log(process.env.NODE_ENV);


// Middleware to parse user information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// User authentication middleware
require("./authentication/userAuth");

// User authentication middleware
require("./authentication/creatorAuth");

// Landing page routes
app.get("/", (req, res) => {
  res.json({
    status: "Success",
    message:
      "Welcome to Gallivanter API, kindly visit the following links for information about usage",
    Documentation_link: "Link to documentations will go here",
  });
});

// Public Tour Routes
app.use("/api/v1/tours", publicTourRouter);


// User ROUTES
app.use("/api/v1/users/", userAuthRouter);
app.use("/api/v1/users/profile", userRouter);
app.use("/api/v1/users/tours", userTourRouter)


// Creator ROUTES
app.use("/api/v1/creators/", creatorAuthRouter);
app.use("/api/v1/creators/tours", creatorTourRouter);
app.use("/api/v1/creators/profile", creatorRouter);



// unknown routes/endpoints
app.all("*", (req, res, next) => {
  return next(
    new AppError(`unknown route!, ${req.originalUrl}  does not exist`, 404)
  );
});

app.use(globalErrorHandler.errorHandler);

module.exports = app;
