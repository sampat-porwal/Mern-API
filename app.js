import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import connectDB from './config/connectdb.js'
import parentRoutes from './routes/parentRoutes.js'
import childRoutes from './routes/childRoutes.js'
import groupRoutes from './routes/groupRoutes.js'

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL


app.use(cors())
connectDB(DATABASE_URL)
app.use(express.json())
app.use("/api/parent", parentRoutes)
app.use("/api/child", childRoutes)
app.use("/api/group", groupRoutes)

app.listen(port, () => {

        console.log(`Server listening at http://localhost:${port}`)
        
})