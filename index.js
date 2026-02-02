import express from 'express';
import cors from "cors";
import userRouter from './routes/userRouter.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:3000');
});

