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

//Admin routes
const adminIndexRouter = require("./routes/user");
const adminEventoRouter = require("./routes/adminEvento");
const adminQuemSomosRouter = require("./routes/adminQuemSomos");
//Public routes
const indexRouter = require("./routes/index");
const eventoRouter = require("./routes/evento");
const quemSomosRouter = require("./routes/quemSomos");

//App setting and usage
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
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

//Public area
app.use("/", indexRouter);
app.use("/eventos", eventoRouter);
app.use("/quemsomos", quemSomosRouter);
//Admin area
app.use("/admin", adminIndexRouter);
app.use("/admin/evento", adminEventoRouter);
app.use("/admin/quemsomos", adminQuemSomosRouter);

app.listen(process.env.PORT || 3000);
