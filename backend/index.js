import express from "express";
import bodyParser from "body-parser"; //use to parse json data
import cookieParser from "cookie-parser"; //use to handle cookies
import cors from "cors"; //use to connect backend and frontend
import dotenv from "dotenv"; //use to handle environment variables

//app config
dotenv.config();
const app = express();

//cors options
const corsOptions = {
  origin: [""],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

//middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello from Backend Server");
});

//server listener
const PORT = process.env.PORT || 3800;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
