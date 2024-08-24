const express = require("express");
const app = express();
const { CovidTally } = require("./connector");
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("HELLO WORLD");
});

// your code goes here

app.get("/totalRecovered", async (req, res) => {
  try {
    const totalRecovered = await CovidTally.aggregate([
      {
        $group: {
          _id: "total",
          recovered: { $sum: "$recovered" },
        },
      },
    ]);
    res.json({ data: totalRecovered[0] });
  } catch (error) {
    res.json({ message: error });
  }
})

app.get("/totalDeath", async (req, res) => {
  try {
    const totalDeaths = await CovidTally.aggregate([
      {
        $group: {
          _id: "total",
          death: { $sum: "$death" },
        },
      },
    ]);

    res.json({ data: totalDeaths[0] });
  } catch (error) {
    res.json({ message: error });
  }
});

app.get("/hotspotStates", async (req, res) => {
  try {
    const hotspots = await CovidTally.aggregate([
        {
            $project: {
                _id:0,
                state: 1, // Include the state field
                rate: {
                    $round: [
                        {
                            $cond: {
                                if: { $eq: ["$infected", 0] },
                                then: 0,
                                else: {
                                    $divide: [
                                        { $subtract: ["$infected", "$recovered"] },
                                        "$infected"
                                    ]
                                }
                            }
                        },
                        5
                    ]
                }
            }
        },
        {
            $match: {
                rate: { $gt: 0.1 } 
            }
        }
    ]);
    console.log(hotspots);
    res.json({ data: hotspots });
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});

app.get("/healthyStates",async(req,res)=>{
    try {

        const healthyState = await CovidTally.aggregate([
            {

                $project:{
                    _id:0,
                    state:1,
                    mortality:{
                        $round:[
                            {
                                $cond:{
                                    if:{$eq:["$infected",0]},
                                    then:0,
                                    else:{
                                        $divide:["$death","$infected"]
                                    }
                                }
                               
                            }
                            ,5]
                    }
                }
            },
            {
                $match:{
                    mortality:{$lt:0.005},
                }
            }
        ])

        // console.log(healthyState);

        res.json({data:healthyState});
        
    } catch (error) {
        console.log(error);
        res.json({message:error.message});
    }
})


module.exports = app;
