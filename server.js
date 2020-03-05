if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//App variables
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const db = mongoose.connection;

//Routes
const indexRouter = require("./Routes/index");

//App setting and usage
app.set("view engine", "ejs");
app.set("views", __dirname + "/Views");
app.set("layout", "layouts/layout");
app.use(fileUpload());
app.use(expressLayouts);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

//Data base connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
db.on("error", (error) => {
  console.log("Error on connect to Database, error: " + error);
});
db.once("open", () => {
  console.log("connected to mongoose");
});

//App Routes usage call
app.use("/", indexRouter);

app.listen(process.env.PORT || 3000);
