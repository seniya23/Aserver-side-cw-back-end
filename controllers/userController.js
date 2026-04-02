import userTable from "../models/userTable.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import otpTable from "../models/otpTable.js";
dotenv.config();

const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: "seniya.20210647@iit.ac.lk",
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

export function Createuser(req ,res) {

    const data = req.body;
    const hashedPassword = bcrypt.hashSync(data.password,10);
    const universityDomain1 = "@westminster.ac.uk";
    const universityDomain2 = "@iit.ac.lk";
    const universityDomain3 = "@gmail.com"; //testing purpose only

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
            }
            else{

                if (!data.email.endsWith(universityDomain1) && !data.email.endsWith(universityDomain2) && !data.email.endsWith(universityDomain3)) {
                    return res.status(400).json({
                        message: "Only university email allowed"
                    });
                }
                else{
                userTable.run(
                    `INSERT INTO users (email, firstName, lastName, password, role, image) VALUES (?, ?, ?, ?, ?, ?)`,
                    [data.email, data.firstName, data.lastName, hashedPassword, data.role || "alumni", data.image || "default.jpg" ],
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
                res.status(401).json({
                    massage : "Please check password or email"
                })
                return
            }
            if(user.isBlocked == 1){
                res.status(403).json({
                    massage : "User is block please contact admin"
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
            if(isblocked == 1){
                res.json({
                massage : "User blocked status updated successfully"
            })
            }
            if(isblocked == 0){
                res.json({
                massage : "User unblocked status updated successfully"
            })
            }
            if(isblocked !== 1 && isblocked !== 0){
                res.status(500).json({
                    massage : "Couldn't update status"
                })
                return
            }
            
        }
    )
}

export function Userdelete(req,res){
    const email = req.params.email

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
                    massage : "User not found"
                })
                return
            }

            userTable.run(
                "DELETE FROM users WHERE email = ?",[email],
                (err)=>{
                    if(err){
                        res.status(500).json({
                            massage : "Database error"
                        })
                        return
                    }
                    res.json({
                        massage : "User delete successfully"
                    })
                }
            )
        }
    )
}

export function Sendotp(req,res){
    const email = req.params.email;

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
                    massage : "User not found"
                })
                return
            }

            // Delete any previous OTP for this email
            otpTable.run("DELETE FROM otp WHERE email = ?", [email], (err) => {
                if(err) {
                    console.log(err);
                    return;
                }

                // Generate random 6 digit OTP
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

                // Insert new OTP
                otpTable.run(
                    `INSERT INTO otp (email, otp) VALUES (?, ?)`,
                    [email, otpCode],
                    (err)=>{
                        if(err){
                            console.log(err);
                            res.status(500).json({
                                message: "Failed to save OTP"
                            });
                            return
                        }

                        // Send email
                        const message = {
                            from: "seniya.20210647@iit.ac.lk",
                            to: email,
                            subject: "Your OTP Code",
                            text: "Your OTP code is " + otpCode,
                        };

                        transporter.sendMail(message, (err, info) => {
                            if (err) {
                                res.status(500).json({
                                    message: "Failed to send OTP",
                                    error: err.message,
                                });
                            } else {
                                res.json({
                                    message: "OTP sent successfully",
                                });
                            }
                        });
                    }
                );
            });
        }
    );
}

export function Otpverify_Passwordreset(req, res){
    const otp = req.body.otp;
    const newpassword = req.body.newpassword;
    const email = req.body.email;
    const hashedPassword = bcrypt.hashSync(newpassword,10);

    otpTable.get("SELECT * FROM otp WHERE email = ?",[email],
        (err,otpRecord)=>{
            if(err){
                res.status(500).json({
                    massage : "Database error"
                })
                return
            }
            if(!otpRecord){
                res.status(400).json({
                    message: "OTP not found or expired"
                })
                return
            }
            if(otpRecord.otp == otp){
                userTable.run(
                "UPDATE users SET password = ? WHERE email = ?",[hashedPassword, email],
                (err)=>{
                    if(err){
                        console.log(err);
                        res.status(500).json({
                            massage : "Couldn't update password"
                        })
                        return
                    }else{
                        // Delete the used OTP
                        otpTable.run("DELETE FROM otp WHERE email = ?", [email], (err) => {
                            if(err) console.log(err);
                        });
                        res.json({
                        message: "Password changed successfully",
                    });
                    }
                }
                )
            } else {
                res.status(400).json({
                    message: "Invalid OTP"
                })
            }
        }
    )
}


