require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFoundMiddleware = require("./middleware/notFound");
const errorMiddleware = require("./middleware/error");

const authRoute = require("./routes/authRoute");
const opdRoute = require("./routes/opdRoute");
const drugRoute = require("./routes/drugRoute");

const authenticate = require("./middleware/authenticate");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoute);
app.use("/opd", authenticate, opdRoute);
app.use("/drug", authenticate, drugRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("server on port " + port));
