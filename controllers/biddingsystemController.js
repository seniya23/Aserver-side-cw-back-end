import biddingTable from "../models/biddingTable.js"

export function placeBidding(req,res){
    const email = req.user.email;
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;
    const image = req.body.image;
    

    if(!req.user){
        res.status(401).json({
            message: "Please Login"
        });
        return;
    }


}