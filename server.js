const express=require("express");
const app=express();
const fs=require("fs");
const path=require("path");
const cookieparser=require("cookie-parser");
const session=require("express-session");

app.use(cookieparser());
app.set("view engine","ejs");
const oneday=1000*60*60*24;
const userRoutes=require("./routing/userroutes");

app.use(session({
    saveUninitialized:true,
    resave:false,
    secret:'askjh34asdf345#@#43',
    cookie:{maxAge:oneday}
}));

//below code is for authenticate user
app.use("/users",auth,userRoutes);
function auth(req,res,next)
{
    if(req.session.username)
     next();
    else
    res.redirect("/");

}

app.use(express.static("public"));
app.use(express.urlencoded());
app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.render("login",{"message":""});
})

app.get("/",(req,res)=>{
    if(req.session.username)
    res.render("dashboard",{"uname":req.session.username});
else
    // res.sendFile(path.join(__dirname,"./public/login.html"));
    res.render("login",{"message":""})
})
app.get("/login",(req,res)=>{
    if(req.session.username)
    res.render("dashboard",{"uname":req.session.username});
else
    res.render("login",{"message":""});
})

// app.get("/dashboard",(req,res)=>{
//     if(req.session.username)
//     res.sendFile(path.join(__dirname,"./public/dashboard.html"));
// else
// res.redirect("/login");

// })
app.post("/login",(req,res)=>{
    //console.log(req.body);
    fs.readFile("users.txt","utf-8",(err,data)=>{

        let records=JSON.parse(data);
        let results=records.filter((item)=>{
            if(item.username==req.body.username && item.password==req.body.password)
            return true;
        })
        if(results.length==0)

        res.render("login",{"message":"invalid"});
    else
    //res.send("Welcome");
{
   req.session.username=req.body.username;
   var n=req.session.username;
res.render("dashboard",{"uname":n})
}

    })

})


app.post("/")

//express
//express-session
//cookie-parser


// app.get("/npass",(req,res)=>{
//     res.render("npass",{"status":""})
//  })

// app.post("/npass", (req, res) => {
//     const nusername = req.body.username;
//     const npassword = req.body.password;
//     const nepassword = req.body.nepassword;
  
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
//   });

app.listen(3000,(err)=>{
console.log("Server Started...");

});