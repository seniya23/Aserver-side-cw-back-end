import userTable from "../models/userTable.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import otpTable from "../models/otpTable.js";
import axios from "axios";
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

// export function Isblocked(req,res){
//     const email = req.params.email
//     const isblocked = req.body.isBlocked

//     if(!req.user){
//         res.status(401).json({
//             massage : "Unauthorized"
//         })
//         return
//     }

//     if(req.user.role != "admin"){
//         res.status(403).json({
//             massage : "Forbidden - admin access required"
//         })
//         return
//     }

//     userTable.run(
//         "UPDATE users SET isBlocked = ? WHERE email = ?",
//         [isblocked, email],
//         (err)=>{
//             if(err){
//                 console.log(err);
//                 res.status(500).json({
//                     massage : "Couldn't update status"
//                 })
//                 return
//             }
//             if(isblocked == 1){
//                 res.json({
//                 massage : "User blocked status updated successfully"
//             })
//             }
//             if(isblocked == 0){
//                 res.json({
//                 massage : "User unblocked status updated successfully"
//             })
//             }
//             if(isblocked !== 1 && isblocked !== 0){
//                 res.status(500).json({
//                     massage : "Couldn't update status"
//                 })
//                 return
//             }
            
//         }
//     )
// }

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

    if (!otp || !newpassword || !email) {
        return res.status(400).json({
            message: "OTP, new password, and email are required"
        });
    }

    if (typeof newpassword !== 'string') {
        return res.status(400).json({
            message: "New password must be a string"
        });
    }

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

export async function googleLogin(req, res) {
	console.log(req.body.token);
	try {
		const response = await axios.get(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{
				headers: {
					Authorization: `Bearer ${req.body.token}`,
				},
			}
		);

		console.log(response.data); //response.data have all the information about the user from google

        //check user already in database or not
		userTable.get(
			"SELECT * FROM users WHERE email = ?",
			[response.data.email],
			(err, user) => {
				if (err) {
					res.status(500).json({
						message: "Database error",
						error: err.message,
					});
					return;
				}
				if (user == null) {
					// Insert new user
					userTable.run(
						`INSERT INTO users (email, firstName, lastName, password, role, isEmailVerified, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
						[response.data.email, response.data.given_name, response.data.family_name, "123", "alumni", 1, response.data.picture || "default.jpg"],
						function(err) {
							if (err) {
								res.status(500).json({
									message: "User creation failed",
									error: err.message,
								});
								return;
							}
							const newUser = {
								email: response.data.email,
								firstName: response.data.given_name,
								lastName: response.data.family_name,
								role: "alumni",
								isEmailVerified: 1,
								image: response.data.picture || "default.jpg",
							};

							const payload = {
								email: newUser.email,
								firstName: newUser.firstName,
								lastName: newUser.lastName,
								role: newUser.role,
								isEmailVerified: true,
								image: newUser.image,
							};

							const token = jwt.sign(payload, process.env.JWT_SECRET, {
								expiresIn: "150h",
							});

							res.json({
								message: "Login successful",
								token: token,
								role: newUser.role,
							});
						}
					);
				} else {
					if (user.isBlocked == 1) {
						res.status(403).json({
							message: "User is blocked. Contact admin.",
						});
						return;
					}
					const payload = {
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
						role: user.role,
						isEmailVerified: user.isEmailVerified == 1,
						image: user.image,
					};

					const token = jwt.sign(payload, process.env.JWT_SECRET, {
						expiresIn: "150h",
					});

					res.json({
						message: "Login successful",
						token: token,
						role: user.role,
					});
				}
			}
		);
	} catch (error) {
		res.status(500).json({
			message: "Google login failed",
			error: error.message,
		});
	}
}

export function getAllUsers(req, res) {
    if(req.user.role != "admin"){
        res.status(401).json({
            message : "Unauthorized"
        })
        return
    }

    userTable.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            res.status(500).json({
                message: "Error fetching users",
                error: err.message
            })
            return
        }
        res.json(rows)
    })
}

export function updateUserStatus(req, res) {
	if (!req.user) {
		res.status(401).json({
			message: "Unauthorized",
		});
		return;
	}

	if (req.user.role != "admin") {
		res.status(403).json({
			message: "Forbidden - admin access required",
		});
		return;
	}

	const email = req.params.email;

	if (req.user.email === email) {
		res.status(400).json({
			message: "Admin cannot change their own status"
		});
		return;
	}

	const isBlocked = req.body.isBlocked;

	if (isBlocked !== 0 && isBlocked !== 1) {
		res.status(400).json({
			message: "isBlocked must be 0 or 1"
		});
		return;
	}

	userTable.run(
		"UPDATE users SET isBlocked = ? WHERE email = ?",
		[isBlocked, email],
		(err) => {
			if (err) {
				console.log(err);
				res.status(500).json({
					message: "Error updating user status",
					error: err.message
				});
				return;
			}
			res.json({
				message: "User status updated successfully"
			});
		}
	);
}

