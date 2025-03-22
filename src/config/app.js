const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb'}));

app.use(express.static(path.resolve("public")));

app.use(cors());

module.exports = app;