import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import geminiResponse from "./gemini.js"

const app = express()

// Enhanced CORS configuration
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL || ""
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const port = process.env.PORT || 5000
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' })
})

app.listen(port, () => {
    connectDb()
    console.log(`Server started on port ${port}`)
    console.log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`)
})