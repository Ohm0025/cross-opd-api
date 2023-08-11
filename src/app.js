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

const authenticate = require("./middleware/authenticate");

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const waitingPatient = [];

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

    io.emit("changeStatus", "inprogress");
  });
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoute);
app.use("/opd", authenticate, opdRoute);
app.use("/drug", authenticate, drugRoute);
app.use("/exam", authenticate, examRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8080;
//app.listen(port, () => console.log("server on port " + port));
server.listen(port, () => console.log("server on port " + port));
