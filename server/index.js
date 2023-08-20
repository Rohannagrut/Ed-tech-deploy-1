// //dependencies
// const express = require("express");
// const fileUpload = require("express-fileupload");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// require("dotenv").config();

// //the server app
// const app = express();

// //connections
// const dbConnect = require("./config/database");
// const { cloudinaryConnect } = require("./config/cloudinary");

// //import routes
// const userRouter = require("./routes/user");
// const profileRouter = require("./routes/profile");
// // const paymentRouter = require("./routes/payment");
// const courseRouter = require("./routes/course");

// //app's portd
// const PORT = process.env.PORT || 4001;

// //middlewares
// app.use(express.json());
// app.use(cookieParser());
// // app.use(
// //   cors({
// //     // add * ki jagah front end ka local host
// //     origin: "*",
// //     credentials: true,
// //   })
// // );
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp",
//   })
// );

// //initiating connections;
// dbConnect.connect();
// cloudinaryConnect();

// //routes initialized
// app.use("/api/v1/auth", userRouter);
// app.use("/api/v1/profile", profileRouter);
// // app.use("/api/v1/payment", paymentRouter);
// app.use("/api/v1/course", courseRouter);

// //server endpoint
// app.get("/", (req, res) => {
//   return res.json({
//     success: true,
//     message: "Your server is up and running....",
//   });
// });

// app.listen(PORT, () => {
//   console.log(`App is running at ${PORT}`);
// });
//dependencies
const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

//the server app
const app = express();

//connections
const dbConnect = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

//import routes
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
// const paymentRouter = require("./routes/payment");
const courseRouter = require("./routes/course");

// static file
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
//app's portd
const PORT = process.env.PORT || 4001;

//middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     // add * ki jagah front end ka local host
//     origin: "*",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

//initiating connections;
dbConnect.connect();
cloudinaryConnect();

//routes initialized
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/profile", profileRouter);
// app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/course", courseRouter);

//server endpoint
// app.get("/", (req, res) => {
//   return res.json({
//     success: true,
//     message: "Your server is up and running....",
//   });
// });

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
