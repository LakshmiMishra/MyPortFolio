const express= require("express");
const sgMail = require('@sendgrid/mail');
const bodyParser=require("body-parser");
const ejs= require("ejs") ;
const mongoose=require("mongoose");

const app= express();
app.set("view engine","ejs");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/portfolioDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const blogSchema=new mongoose.Schema({
  title:String,
  content:String,
  createdOn:String,
  author:String,
  category:String
});

const Blog =new mongoose.model("Blog",blogSchema);


app.get("/composeBlog",(req,res)=>{
  res.render(__dirname+"/views/composeBlog");  
})
app.post("/composeBlog",(req,res)=>{
const blog1=new Blog({
  title:req.body.title,
content:req.body.content,
createdOn:new Date().toLocaleDateString,
createdBy:"Lakshmi",
category:"General"
});

blog1.save(err=>{
  if(err){
    console.log(err.message);
  }
  else{
    res.redirect("/");
  }
});

})
app.get("/", function (req,res){
 
   Blog.find((error,data)=>{
     if(error){
       console.log("Error"+error)
       
     }
     else
     {console.log(data);
      res.render(__dirname+"/views/index",{"blogs":data});  
     }
  })
   
})
app.get("/portfolio-details",(req,res)=>{
    res.render(__dirname+"/views/portfolio-details");
})

app.post("/",(req,res)=>{
  sgMail.send((err,result)=>{
    from: req.body.email
    to: "lakshmii@gmail.com"
    subject: "Test Email"
    text: "This is a test email"
    html: "<p>This is a test email</p>"
  }).then(result => {
    console.log("Sent email");
  }, err => {
    console.error(err);
  });
  
})

app.listen(3000,(req,res)=>{
  console.log("server running")
 // res.sendFile(__dirname+"/views/index");
})