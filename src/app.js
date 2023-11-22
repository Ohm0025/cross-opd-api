require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFoundMiddleware = require("./middleware/notFound");
const errorMiddleware = require("./middleware/error");

const authRoute = require("./routes/authRoute");
const opdRoute = require("./routes/opdRoute");
const drugRoute = require("./routes/drugRoute");
const examRoute = require("./routes/examRoute");
const pastRoute = require("./routes/pastRoute");
const underlyRoute = require("./routes/underlyRoute");
const followUpRoute = require("./routes/followUpRoute");
const allergyRoute = require("./routes/allergyRoute");
const labHxRoute = require("./routes/labHxRoute");
const imgHxRoute = require("./routes/imgHxRoute");

const authenticate = require("./middleware/authenticate");

const uploadMiddleware = require("./middleware/uploadMiddleWare");
const { testUploadImg } = require("./controllers/testController");

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let waitingPatient = [];

const addNewPatient = (patientId, socketId) => {
  !waitingPatient.some((user) => user.patientId === patientId) &&
    waitingPatient.push({ patientId, socketId });
};

io.on("connection", (socket) => {
  socket.on("newPatient", (patientId) => {
    addNewPatient(patientId, socket.id);
  });

  socket.on("activatedOpd", (patientId) => {
    let selectedCase = waitingPatient.find(
      (item) => item.patientId === +patientId
    );

    selectedCase &&
      io.emit("changeStatus", {
        status: "inprogress",
        sendPatientId: +patientId,
      });
  });

  socket.on("finishCase", (patientId) => {
    waitingPatient = waitingPatient.filter(
      (item) => item.patientId !== +patientId
    );

    io.emit("finishStatus", {
      command: "closeCase",
      sendPatientId: +patientId,
    });
  });

  socket.on("cancelCase", (patientId) => {
    // waitingPatient = waitingPatient.filter(
    //   (item) => item.patientId !== +patientId
    // );
    io.emit("closeStatus", {
      command: "cancelOpdCard",
      sendPatientId: +patientId,
    });
  });
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// console.log(waitingPatient);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use("/image", express.static("image"));
app.use(express.static("public"));

app.use("/auth", authRoute);

//re-start all expired case
// app.use("/", authenticate, reStartCase);

app.use("/opd", authenticate, opdRoute);
app.use("/drug", authenticate, drugRoute);
app.use("/exam", authenticate, examRoute);
app.use("/getPast", authenticate, pastRoute);
app.use("/underly", authenticate, underlyRoute);
app.use("/followUp", authenticate, followUpRoute);
app.use("/allergy", authenticate, allergyRoute);
app.use("/getLab", authenticate, labHxRoute);
app.use("/getImg", authenticate, imgHxRoute);

app.post("/testupload", uploadMiddleware, testUploadImg);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8080;
//app.listen(port, () => console.log("server on port " + port));
server.listen(port, () => console.log("server on port " + port));
