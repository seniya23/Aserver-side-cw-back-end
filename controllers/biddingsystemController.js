import biddingTable from "../models/biddingTable.js"
import bidhistoryTable from "../models/bidhistoryTable.js"

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

    biddingTable.get(
        "SELECT * FROM winner WHERE email = ?", [email],
        (err, user) => {
            if (err) {
                res.status(500).json({
                    massage: "Bid placing error"
                });
                return;
            }

            const winAmount = user?.winAmount ?? 0;
            if (winAmount >= 3) {
                res.status(403).json({
                    massage: "You have reached the amount of winning per month"
                });
                return;
            }

            // proceed with bid insertion
            biddingTable.run(
                `INSERT INTO bidding (email, firstName, lastName, image, bidAmount, status) VALUES (?, ?, ?, ?, ?, ?)`,
                [email, firstName, lastName, image, bidAmount, "pending"],
                (err) => {
                    if (err) {
                        res.status(500).json({
                            massage: "User bidding error"
                        });
                        return;
                    }
                    res.json({
                        massage: "Bidding have placed successfully"
                    });
                }
            );
        }
    );


}

export function viewBiddingAlumni(req, res) {
    const email = req.user.email;

    if (req.user.role !== 'alumni' && req.user.role !== 'admin') {
        res.status(401).json({
            message: "Please Login as Alumni"
        });
        return;
    }

    biddingTable.all(
        "SELECT * FROM bidding WHERE email = ?",
        [email],
        (err, rows) => {
            if (err) {
                res.status(500).json({
                    message: "Failed to fetch bidding data"
                });
                return;
            }

            if (!rows || rows.length === 0) {
                res.status(404).json({
                    message: "You haven't placed any bids yet"
                });
                return;
            }

            res.json({
                data: rows
            });
        }
    );
}


export function selectWinner(req, res) {
    // Find the highest bid among pending bids
    biddingTable.get(
        "SELECT * FROM bidding WHERE status = 'pending' ORDER BY bidAmount DESC LIMIT 1",
        (err, row) => {
            if (err) {
                res.status(500).json({
                    message: "Error selecting winner"
                });
                return;
            }

            if (!row) {
                res.status(404).json({
                    message: "No pending bids found"
                });
                return;
            }

            // Update the winning bid status to 'won'
            biddingTable.run(
                "UPDATE bidding SET status = 'won' WHERE id = ?",
                [row.id],
                (updateErr) => {
                    if (updateErr) {
                        res.status(500).json({
                            message: "Error updating bid status"
                        });
                        return;
                    }

                    // Record the winner in winnerTable
                    biddingTable.run(
                        "INSERT INTO winner (email, winAmount, winDate) VALUES (?, ?, ?)",
                        [row.email, row.bidAmount, new Date().toISOString()],
                        (insertErr) => {
                            if (insertErr) {
                                res.status(500).json({
                                    message: "Error recording winner"
                                });
                                return;
                            }

                            res.json({
                                message: "Winner selected successfully",
                                winner: {
                                    email: row.email,
                                    bidAmount: row.bidAmount,
                                    winDate: new Date().toISOString()
                                }
                            });
                        }
                    );
                }
            );
        }
    );
}