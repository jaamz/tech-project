const express       = require('express');
const logger        = require('morgan');
const assignments   = require('./routes/assignments');
const employees     = require('./routes/employees');
const projects      = require('./routes/projects');
const login         = require('./routes/login');
const statusTypes   = require('./routes/statusTypes');
const cors          = require('cors');
const passport      = require('passport');

/**
 * For when we add .env file to handle DB_URLs
 */
require("dotenv").load();
require("./config/db");

const app       = express();
const port      = process.env.PORT;

app.use(cors());

app.listen(port, () => console.log(`Server running on port: ${port}`));
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize())
app.use(passport.session())
// Routes
app.use("/api/assignments", assignments);
app.use("/api/employees", employees);
app.use("/api/projects", projects);
app.use("/api/statustypes", statusTypes);
app.use("/api/", login);

module.exports = app;
