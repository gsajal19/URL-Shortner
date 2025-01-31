const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const http = require('http');
const connection = mysql.createConnection({
host:"bqk1s9or2e5olgq16lmk-mysql.services.clever-cloud.com",
user: "uerttvbk0tqt8ppw",
password: "763PggQ6rLmfQsATh77Z",
database: "bqk1s9or2e5olgq16lmk"
});
const port=5001;
connection.connect((err)=>{
if(!err){
    console.log("Connection Established");
}else{
    // console.log("Not Connection Established");

}
});
app.use(express.json());
app.use(cors());
app.get("/",(req,resp)=>{
    resp.send("Hey Sajal, App Working ....")
})
app.post('/generate',(req,resp)=>{
    connection.query("INSERT INTO urls(shortid,originalurl,expiration) value('"+ req.body.shortid+" ','"+req.body.originalurl+"', NOW() + INTERVAL "+ req.body.interval +" "+ req.body.intervaltype+")",(err,result)=>{
        if(err){
            resp.status(400).send(err);
        }else{
    
            resp.send({
                status:true,
                shorturl:`http://${req.headers.host}/${req.body.shortid}`,
                message:"Validity "+ req.body.interval+" "+req.body.intervaltype
            });
        }
    });
});

app.get("/:shortid",(req,resp)=>{
    const shortid = req.params.shortid;
    connection.query("SELECT * FROM urls WHERE shortid = ? ",[shortid],(err,result)=>{
        if(err){
            resp.send({
                status:false,
                message:"Something Went Wrong !! Please try again"
            });
        }else{
            if (result.length > 0) {
                // If a result is found, return it
                // resp.status(200).send({
                //     status: true,
                //     message: "Record found.",
                //     data: result
                // });
                // console.log
                resp.redirect(301,result[0].originalurl);

            } else {
                // If no record found with the given shortid
                resp.status(404).send({
                    status: false,
                    message: "URL not found."
                });
        }
     }
    });
});

app.listen(port);