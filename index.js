import express from 'express';
import cors from "cors";
import userRouter from './routes/userRouter.js';
import alumniRouter from './routes/alumniRouter.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import biddingRouter from './routes/biddingRouter.js';
import cron from 'node-cron';
import { selectWinner } from './controllers/biddingsystemController.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import analyticsRouter from './routes/analyticsRouter.js';

dotenv.config();
const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Alumni Bidding System API',
      version: '1.0.0',
      description: 'API documentation for the Alumni Bidding System backend',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: process.env.API_KEY_HEADER,
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

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
                        message : "Invalid token"
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
app.use("/api/analytics", analyticsRouter);

// Schedule winner selection to run every day at 00.00
// cron.schedule('0 0 * * *', () => {
//   console.log('Running scheduled winner selection...');
//   selectWinner();
// });

// cron.schedule('* * * * *', () => {
//   console.log('Running automated winner selection (test every minute)...');
//   selectWinner();
// });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:3000');
  console.log('API Documentation available at http://localhost:3000/api-docs');
});





