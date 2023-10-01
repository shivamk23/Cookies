const express=require("express");
const path=require("path");
const fs= require("fs");
const router=express.Router();
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
  if(req.session.username){
    let data=fs.readFileSync("./product.json","utf-8");
data=JSON.parse(data);
    res.render("index",{products:data});
  }else{
    res.render("login");
  }
})

router.get("/productdetails/:data",(req,res)=>{
  fs.readFile("./product.json","utf-8",(err,data)=>{
    if(err){
      console.log(err);
    }
    let products=JSON.parse(data);
        let results=products.filter((item)=>{
            if(item.id==req.params.data)
            return true;
        })
        res.render("productdetails",{products:results});
        
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
    var nusername = req.body.username
    var npassword = req.body.password
    var nepassword = req.body.nepassword
  
    fs.readFile("./users.txt", "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error reading user data.");
      }
  
      let record = JSON.parse(data);
  
      // Find the user record by username and password
      const result = record.findIndex((item) => {
        return item.username === nusername && item.password === npassword;
      });
  
      if (result==-1) {
        return res.render("npass", { "status": "Wrong username/password" });
      }
  
      // Update the password for the user
      record[result].password = nepassword;
  
      fs.writeFile("./users.txt", JSON.stringify(record, null, 3), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error updating password.");
        }
  
        return res.render("npass", { "status": "Password updated" });
      });
    });
  });



  
 module.exports=router;