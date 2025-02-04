const express = require("express");
const dbconnect = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const customerRoutes= require("./routes/customerRoutes");
const transactRoutes= require("./routes/transactRoutes")

const app = express();
dbconnect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/transact', transactRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on ${PORT}`));
