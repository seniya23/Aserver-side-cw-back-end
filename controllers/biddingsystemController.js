import biddingTable from "../models/biddingTable.js"
import bidhistoryTable from "../models/bidhistoryTable.js"
import alumniTable from "../models/alumniTable.js"
import nodemailer from "nodemailer";
import db from "../config/database.js";

let isSelectingWinner = false;

const transporter = nodemailer.createTransport({

    service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
    auth: {
        user: "seniya.20210647@iit.ac.lk",
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export function sendBidNotification(email, firstName, action, bidAmount) {
    
    const subject = action === 'placed' ? 'Bid Placed Successfully' : 'Bid Updated Successfully';
    const text = `Dear ${firstName},\n\nYour bid of $${bidAmount} has been ${action}.\n\nBest regards,\nBidding System`;

    transporter.sendMail({
        from: "seniya.20210647@iit.ac.lk",
        to: email,
        subject: subject,
        text: text
    }, (err, info) => {
        if (err) {
            console.log(err);
        }
    });
}

export function sendWinNotification(email, firstName, bidAmount) {
    const subject = 'Congratulations! You Won the Bid';
    const text = `Dear ${firstName},\n\nCongratulations! Your bid of $${bidAmount} has won.\n\nBest regards,\nBidding System`;

    transporter.sendMail({
        from: "seniya.20210647@iit.ac.lk",
        to: email,
        subject: subject,
        text: text
    }, (err, info) => {
        if (err) {
            console.log(err);
        }
    });
}

export function placeBidding(req,res){

    const email = req.user.email;
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;
    const image = req.user.image;
    const bidAmount = req.body.bidAmount;
    
    if (req.user.role !== 'alumni') {
        res.status(401).json({
            message: "Please Login as Alumni"
        });
        return;
    }

    if (!bidAmount || bidAmount <= 0) {
        res.status(400).json({
            message: "Invalid bid amount"
        });
        return;
    }
    
    alumniTable.get(
        "SELECT * FROM alumni WHERE email = ?", [email],
        (err, user) => {
            if (err) {
                res.status(500).json({
                    message: "Bid placing error"
                });
                return;
            }
            if(!user){
                res.status(401).json({
                    message: "Please create alumni profile"
                });
                return;
            }

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();

            // Check monthly win limit
            biddingTable.all(
                "SELECT * FROM bidding WHERE email = ? AND status = 'won' AND month = ? AND year = ?",
                [email, currentMonth, currentYear],
                (err, wins) => {
                    if (err) {
                        res.status(500).json({
                            message: "Bid placing error"
                        });
                        return;
                    }

                    if (wins.length >= 3) {
                        res.status(403).json({
                            message: "You have reached the 3-win limit for this month"
                        });
                        return;
                    }

                    // Check if user has active bid
                    biddingTable.get(
                        "SELECT * FROM bidding WHERE email = ? AND status = 'active'",
                        [email],
                        (err, existingBid) => {
                            if (err) {
                                res.status(500).json({
                                    message: "Bid placing error"
                                });
                                return;
                            }

                            if (existingBid) {
                                
                                    res.status(400).json({
                                        message: "You have an active bid"
                                    });
                                    return;
                                
                            } else {
                                // Insert new bid
                                biddingTable.run(
                                    `INSERT INTO bidding (email, firstName, lastName, image, bidAmount, status, month, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                                    [email, firstName, lastName, image, bidAmount, "active", currentMonth, currentYear],
                                    (err) => {
                                        if (err) {
                                            res.status(500).json({
                                                message: "Bid placing error"
                                            });
                                            return;
                                        }
                                        // Insert into history
                                        bidhistoryTable.run(
                                            `INSERT INTO bidhistory (email, firstName, lastName, bidAmount, action) VALUES (?, ?, ?, ?, ?)`,
                                            [email, firstName, lastName, bidAmount, 'placed'],
                                            (err) => {
                                                if (err) console.log(err);
                                            }
                                        );
                                        // Send email
                                        sendBidNotification(email, firstName, 'placed', bidAmount);
                                        res.json({
                                            message: "Bid placed successfully"
                                        });
                                    }
                                );
                            }
                        }
                    );
                }
            );
        }
    );
}

export function updateBid(req,res){
    const email = req.user.email;
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;
    const bidAmount = req.body.bidAmount;
    
    if (req.user.role !== 'alumni') {
        res.status(401).json({
            message: "Please Login as Alumni"
        });
        return;
    }

    if (!bidAmount || bidAmount <= 0) {
        res.status(400).json({
            message: "Invalid bid amount"
        });
        return;
    }
    
    alumniTable.get(
        "SELECT * FROM alumni WHERE email = ?", [email],
        (err, user) => {
            if (err) {
                res.status(500).json({
                    message: "Bid placing error"
                });
                return;
            }
            if(!user){
                res.status(401).json({
                    message: "Please create alumni profile"
                });
                return;
            }
        }
    )

            const currentDate = new Date();
        
            // Check if user has active bid
                    biddingTable.get(
                        "SELECT * FROM bidding WHERE email = ? AND status = 'active'",
                        [email],
                        (err, existingBid) => {
                            if (err) {
                                res.status(500).json({
                                    message: "Bid placing error"
                                });
                                return;
                            }

                            if (existingBid) {
                                if (bidAmount <= existingBid.bidAmount) {
                                    res.status(400).json({
                                        message: "New bid must be higher than current bid"
                                    });
                                    return;
                                }
                                // Update existing bid//chekkkkkkkkkkkkkkkkkkkkkkkk
                                biddingTable.run(
                                    `UPDATE bidding SET bidAmount = ?, bidDate = CURRENT_TIMESTAMP WHERE id = ?`, 
                                    [bidAmount, existingBid.id],
                                    (err) => {
                                        if (err) {
                                            res.status(500).json({
                                                message: "Bid update error"
                                            });
                                            return;
                                        }
                                        // Insert into history
                                        bidhistoryTable.run(
                                            `INSERT INTO bidhistory (email, firstName, lastName, bidAmount, action) VALUES (?, ?, ?, ?, ?)`,
                                            [email, firstName, lastName, bidAmount, 'updated'],
                                            (err) => {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            }
                                        );
                                        // Send email
                                        sendBidNotification(email, firstName, 'updated', bidAmount);
                                        res.json({
                                            message: "Bid updated successfully"
                                        });
                                    }
                                );
                            
                            }
                    }
                )
}

export function viewBiddingAlumni(req, res) {
    const email = req.user.email;

    if (req.user.role !== 'alumni' && req.user.role !== 'admin') {
        res.status(401).json({
            message: "Please Login as Alumni"
        });
        return;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Get current bid
    biddingTable.get(
        "SELECT * FROM bidding WHERE email = ? AND status = 'active'",
        [email],
        (err, currentBid) => {
            if (err) {
                res.status(500).json({
                    message: "Failed to fetch bidding data"
                });
                return;
            }

            // Get monthly wins
            biddingTable.all(
                "SELECT * FROM bidding WHERE email = ? AND status = 'won' AND month = ? AND year = ?",
                [email, currentMonth, currentYear],
                (err, wins) => {
                    if (err) {
                        res.status(500).json({
                            message: "Failed to fetch bidding data"
                        });
                        return;
                    }

                    const remainingSlots = 3 - wins.length;

                    // Get bid history
                    bidhistoryTable.all(
                        "SELECT * FROM bidhistory WHERE email = ? ORDER BY bidDate DESC",
                        [email],
                        (err, history) => {
                            if (err) {
                                res.status(500).json({
                                    message: "Failed to fetch bidding data"
                                });
                                return;
                            }

                            res.json({
                                currentBid: currentBid || null,
                                monthlyWins: wins.length,
                                remainingSlots: remainingSlots,
                                bidHistory: history
                            });
                        }
                    );
                }
            );
        }
    );
}



export function selectWinner() {
    if (isSelectingWinner) {
        console.log("selectWinner is already running; skipping duplicate execution.");
        return;
    }
    isSelectingWinner = true;

    // Get the highest active bid
    biddingTable.get(
        "SELECT * FROM bidding WHERE status = 'active' ORDER BY bidAmount DESC LIMIT 1",
        [],
        (err, winner) => {
            if (err) {
                console.log("Error selecting winner:", err);
                isSelectingWinner = false;
                return;
            }

            if (!winner) {
                console.log("No active bids to select winner");
                isSelectingWinner = false;
                return;
            }

            // Mark as won only if still active (idempotent guard)
            biddingTable.run(
                "UPDATE bidding SET status = 'won' WHERE id = ? AND status = 'active'",
                [winner.id],
                function (err) {
                    if (err) {
                        console.log("Error updating winner status:", err);
                        isSelectingWinner = false;
                        return;
                    }

                    if (this.changes === 0) {
                        console.log("Winner has already been processed by another run.");
                        isSelectingWinner = false;
                        return;
                    }

                    // Update alumni bidWins
                    alumniTable.run(
                        "UPDATE alumni SET bidWins = bidWins + 1 WHERE email = ?",
                        [winner.email],
                        (err) => {
                            if (err) {
                                console.log("Error updating bidWins:", err);
                            }
                        }
                    );

                    // Insert into history
                    bidhistoryTable.run(
                        `INSERT INTO bidhistory (email, firstName, lastName, bidAmount, action) VALUES (?, ?, ?, ?, ?)`,
                        [winner.email, winner.firstName, winner.lastName, winner.bidAmount, 'won'],
                        (err) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );

                    // Send notification
                    sendWinNotification(winner.email, winner.firstName, winner.bidAmount);

                    // Set other active bids to 'lost'
                    biddingTable.run(
                        "UPDATE bidding SET status = 'lost' WHERE status = 'active' AND id != ?",
                        [winner.id],
                        (err) => {
                            if (err) {
                                console.log("Error updating lost bids:", err);
                            }
                        }
                    );

                    console.log(`Winner selected: ${winner.email} with bid $${winner.bidAmount}`);
                    isSelectingWinner = false;
                }
            );
        }
    );
}


export function bidHistory(req,res){

    const email = req.user.email;

    if (req.user.role !== 'alumni' && req.user.role !== 'admin') {
        res.status(401).json({
            message: "Please Login as Alumni"
        });
        return;
    }


    bidhistoryTable.get(
        "SELECT * FROM bidhistory WHERE email = ?",[email],
        (err,history)=>{
            if(err){
                res.status(500).json({
                    massage : "Database error"
                })
                return
            }
            res.json({
                    massage : history
                });
        }
    )
}

export function deleteBids(req,res){
    const email =  req.params.email;

    biddingTable.get(
        "SELECT * FROM bidding WHERE email = ?",[email],
        (err,user)=>{
            if(err){
                res.status(500).json({
                    massage : "Database error"
                })
                return
            }
            if(!user){
                res.status(404).json({
                    massage : "User not Exist"
                })
                return
            }

            biddingTable.run(
                "DELETE FROM bidding WHERE email = ?",[email],
                (err)=>{
                    if(err){
                        res.status(500).json({
                            massage : "Database error"
                        })
                        return
                    }
                    res.json({
                        massage : "Alumni bid history delete successfully"
                    })
                }
            )
        }
    )
}



export function clearBids(req, res) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  db.serialize(() => {
    db.run("DELETE FROM bidding", (err) => {
      if (err) return res.status(500).json({ message: "Delete bidding failed", error: err.message });

      db.run("DELETE FROM bidhistory", (err2) => {
        if (err2) return res.status(500).json({ message: "Delete bidhistory failed", error: err2.message });

        // optional: reset AUTOINCREMENT sequence
        db.run("DELETE FROM sqlite_sequence WHERE name IN ('bidding', 'bidhistory')", (err3) => {
          if (err3) console.warn("sqlite_sequence reset failed", err3.message);

          res.json({ message: "Cleared bidding and bidhistory tables" });
        });
      });
    });
  });
}

