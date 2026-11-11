const Order = require('../models/order');

const userSpending = async(req, res) => {
    const result = await Order.aggregate([
        //stage 1 match is a filter
        // returns all fields in the original document with status completed
        // decide which document gets to move forward in the pipeline
        { 
            $match : { status : "completed" }
        },

        // stage 2
        // receives raw data from stage 1 summarizes it
        {
            $group : {
                _id: "$userId",
                totalSpent : { $sum: "$amount"},
                orderCount: { $sum : 1}

            }
        },

        // stage 3
        // reshape data from stage 2 before sending to client
        // make it frontend friendly
        {
            $project : {
                userId: "$_id",
                totalSpent: 1,
                orderCount: 1,
                averageOrderValue: {
                    divide: ["$totalSpent", "orderCount"]
                },
                _id: 0
            }
        },

        //stage 4 - all top spenders in descending order
        {
            $sort: {
                totalSpent: -1
            }
        },

        //stage 6 - display only 5
        { $limit: 5 },

        //stage 7 - attach user details to the order data
        // lookup returns an array of new data
        {
            $lookup : {
                from: "users", // look into this collection name
                localField: "userId",
                foreignField: "_id",
                as: "user" // store new array data in this variable
            }
        },

            // turn user array into an object as the nested data is becoming too much
        {
            $unwind : "$user"
        },

        // final data being sent to client
        {
            $project: {
                userId: 1,
                totalSpent: 1,
                orderCount: 1,
                averageOrderValue: 1,
                "user.name": 1,
                "user.email": 1

            }
        }

    ]);
    res.json(result);
}

module.exports = userSpending;