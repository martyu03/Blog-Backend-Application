const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the CORS package
const blogRoutes = require("./routes/blog");
const userRoutes = require("./routes/user");

const app = express();

// [SECTION] Middlewares
const allowedOrigins = ['http://localhost:3000', 'https://blog-application-theta-ashen.vercel.app'];
app.use(cors({
    origin: allowedOrigins,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/blogs", blogRoutes);
app.use("/users", userRoutes);

// [SECTION] Database Connection
mongoose.connect('mongodb+srv://admin:admin1234@yudb.chcsg.mongodb.net/Blog-Application?retryWrites=true&w=majority&appName=YuDB');
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

if (require.main === module) {
    app.listen(4000, () => console.log(`API is now online on port 4000`));
}

module.exports = { app, mongoose };