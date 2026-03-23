import express from 'express';
import cors from "cors";
import userRouter from './routes/userRouter.js';
import alumniRouter from './routes/alumniRouter.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import biddingRouter from './routes/biddingRouter.js';
import cron from 'node-cron';
import { selectWinner } from './controllers/biddingsystemController.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use((req,res,next)=>{
    const authorizationHeader = req.header("Authorization")

    if(authorizationHeader){

        const token = authorizationHeader.replace("Bearer ", "")
        console.log(token);

        jwt.verify(token, process.env.JWT_SECRET,
            (err, content)=>{
                if(content){
                    console.log(content);
                    req.user = content
                    next()
                }else{
                    res.status(401).json({
                        massage : "Invalid token"
                    })
                    console.log("Invalid token")
                }
            }
        )
    }else{
        next();
    }
})

app.use("/api/users",userRouter);
app.use("/api/alumni",alumniRouter);
app.use("/api/bidding",biddingRouter);

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:3000');
});

// Schedule winner selection at midnight every day
cron.schedule('0 0 * * *', () => {
  console.log('Running automated winner selection...');
  selectWinner();
});

// cron.schedule('* * * * *', () => {
//   console.log('Running automated winner selection (test every minute)...');
//   selectWinner();
// });

