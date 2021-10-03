const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
const multer = require("multer");
const path = require("path");

dotenv.config();
mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
  );

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

app.use("/images",express.static(path.join(__dirname, 'public/images')));

//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
//subir imagen a server
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"public/images");
  },
  filename:(req,file,cb)=>{
      cb(null,req.body.name);
  },
});

const upload = multer({storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
      return res.status(200).json("File uploaded successfully");
    }catch(err){
      console.log(err);
    }
});

app.use("/api/users",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/posts",postRouter);

app.listen(8800,()=>{
    console.log('Back server is running');
});