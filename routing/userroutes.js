const express=require("express");
const path=require("path");
const fs= require("fs");
const router=express.Router();
const client=require("mongodb").MongoClient;
router.use(express.urlencoded())
router.get("/dashboard",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/dashboard.html"))
})

router.get("/profile",(req,res)=>{
   res.send("User profile page");
})

router.get("/history",(req,res)=>{
    res.send("User history page");
 })
 router.get("/npass",(req,res)=>{
    res.render("npass",{"status":""})
 })

 let dbinstance;
 client.connect("mongodb+srv://shivamsk2315:test1@cluster0.xe6okby.mongodb.net/E-Comm")
 .then((server) => {
   dbinstance = server.db("E-Comm");
   console.log("Connected to the database...");
 })
 .catch((err) => {
   console.log("Unable to connect to the database: " + err);
 });

//  router.post("/update-p",(req,res)=>{
//     const username = req.body.username;
//   const password = req.body.password;
//   const npassword = req.body.npassword;
//     fs.readFile("./users.txt","utf-8",(err,data)=>{
//         if(err){
//             console.log(err);
//         }
//         let record=JSON.parse(data);
//         let result=record.find((item)=>{
//             if(item.username===username && item.password===password){
                
//                 return true;}
//         })
//         if(result.length==0){
//             res.render("logout",{"status":"Wrong username/password"})
//         }else{
//             result.password=npassword;
//         }
//         fs.writeFile("./users.txt",JSON.stringify(record,null,3),(err,data)=>{
//             if(err){
//                 console.log(err);
//             }else{
//                 res.render("npass",{"status":"password update"})
//             }

//         })
//     })
//  })

router.get("/proucts",(req,res)=>{
//   if(req.session.username){
//     let data=fs.readFileSync("./product.json","utf-8");
// data=JSON.parse(data);
//     res.render("index",{product:data});
//   }else{
//     res.render("login");
//   }
dbinstance.collection("Product").find({}).toArray().then((response)=>{
  
  res.render("index",{product:response,username:req.session.username});
})
})

router.get("/productdetails/:id",(req,res)=>{
  // fs.readFile("./product.json","utf-8",(err,data)=>{
  //   if(err){
  //     console.log(err);
  //   }
  //   let products=JSON.parse(data);
  //       let results=products.filter((item)=>{
  //           if(item.id==req.params.data)
  //           return true;
  //       })
  //       res.render("productdetails",{products:results});
        
  // })

  dbinstance.collection("Product").find({id:parseInt(req.params.id)}).toArray().then((response)=>{
    
     res.render("productdetails",{product:response});

 })
 
})

router.get("/npass",(req,res)=>{
  if(req.session.username){
    res.render("npass",{"status":""})}
    else{
      res.render("login");
    }
 })

router.post("/npass", (req, res) => {
  const nusername = req.body.username;
  const npassword = req.body.password;
  const nepassword = req.body.nepassword;

  dbinstance.collection("users").find({$and:[{'username':nusername},{'password':npassword}]}).toArray().then((response)=>
    {
        if(response.length==0)
        res.render("npass",{"status":"invalid"});
    else{
        req.session.username=req.body.username;
        var n=req.session.username;
        dbinstance.collection("users").updateOne({username:nusername},{$set:{password:nepassword}}).then((response)=>{
          res.render("npass",{"status":"password updated"});
        })
        }
    })








//     var nusername = req.body.username
//     var npassword = req.body.password
//     var nepassword = req.body.nepassword
  
//     fs.readFile("./users.txt", "utf-8", (err, data) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send("Error reading user data.");
//       }
  
//       let record = JSON.parse(data);
  
//       // Find the user record by username and password
//       const result = record.findIndex((item) => {
//         return item.username === nusername && item.password === npassword;
//       });
  
//       if (result==-1) {
//         return res.render("npass", { "status": "Wrong username/password" });
//       }
  
//       // Update the password for the user
//       record[result].password = nepassword;
  
//       fs.writeFile("./users.txt", JSON.stringify(record, null, 3), (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send("Error updating password.");
//         }
  
//         return res.render("npass", { "status": "Password updated" });
//       });
//     });
  });



  
 module.exports=router;