import express from 'express';
import morgan from 'morgan';

const app = express()


app.use(morgan('dev'));
app.use(express.json())


app.get('/api/status/health', (req , res) =>{
    res.status(200).json({
        status: "ok"
    })
})

app.get('/api/ai/healthz' , (req , res)=>{
    res.status(200).json({
        message: "AI service is running successfully" ,
        status : "ok"
    })
})



export default app