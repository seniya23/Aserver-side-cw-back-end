import userTable from "../models/userTable.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function Createuser(req ,res) {

    const data = req.body;
    const hashedPassword = bcrypt.hashSync(data.password,10);

    try{
    userTable.get(
        "SELECT * FROM users WHERE email = ?",[data.email],
        (err,user) =>{
            if(err){
                res.status(500).json({
                    massage : "Database error"
                })
                return
            }
            if(user){
                res.status(404).json({
                    massage : "User already exists"
                })
                return
            }else{
                userTable.run(
                    `INSERT INTO users (email, firstName, lastName, password, role) VALUES (?, ?, ?, ?, ?)`,
                    [data.email, data.firstName, data.lastName, hashedPassword, data.role || "user"],
                    (err)=>{
                        if(err){
                            res.status(500).json({
                                massage : "User saving error"
                            })
                            return
                        }
                        res.json({
                            massage : "User creation successfull"
                        })
                    }
                )

            }
            
        }
        

    )}catch(error) {
        res.status(500).json({
        message: error.message
        });
    }
    
}

export function Loginuser(req,res){

    const email = req.body.email;
    const password = req.body.password;

    userTable.get(
        "SELECT * FROM users WHERE email = ?",[email],
        (err,user)=>{
            if(err){
                res.status(500).json({
                    massage : "Database error"
                })
                return
            }
            if(!user){
                res.status(404).json({
                    massage : "Please check password or email"
                })
                return
            }
            
            console.log(user);
            const ispasswordcorrect = bcrypt.compareSync(password,user.password);
            console.log(ispasswordcorrect);
            if(!ispasswordcorrect){
                res.status(404).json({
                    massage : "Please check password or email"
                })
                return
            }
            
            const payload = {
                email : user.email,
                firstName : user.firstName,
                lastName : user.lastName,
                password : user.password,
                role : user.role,
                isBlocked : user.isBlocked,
                image : user.image
            }
            console.log(payload);

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn : "150h"
            }) 
            res.json({
                role : user.role,
                token : token,
                massage : "Successfully login welcome back"
            })
            console.log(token);
        }
    )

}

export function Isblocked(req,res){
    const email = req.params.email
    const isblocked = req.body.isBlocked

    if(!req.user){
        res.status(401).json({
            massage : "Unauthorized"
        })
        return
    }

    if(req.user.role != "admin"){
        res.status(403).json({
            massage : "Forbidden - admin access required"
        })
        return
    }

    userTable.run(
        "UPDATE users SET isBlocked = ? WHERE email = ?",
        [isblocked, email],
        (err)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    massage : "Couldn't update status"
                })
                return
            }
            res.json({
                massage : "User blocked status updated successfully"
            })
        }
    )
}

