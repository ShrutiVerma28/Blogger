const express = require('express');
const app =express();
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const ejs = require('ejs');
var _ = require('lodash');


mongoose.connect('mongodb+srv://shruti-v:math14@cluster0.sf74t.mongodb.net/Firstblog',{   
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("connection successful!");
}).catch((err)=>{console.log(err);})


//declaring variables

const homestart= "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias aut, repellat ipsum facere voluptate dicta obcaecati deserunt nobis suscipit eaque?";
const aboutstart="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias aut, repellat ipsum facere voluptate dicta obcaecati deserunt nobis suscipit eaque?";
const contactstart="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias aut, repellat ipsum facere voluptate dicta obcaecati deserunt nobis suscipit eaque?";
let posts=[];


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');



//database definations

const postSchema = new mongoose.Schema({
    title:String,
    description:String
})

const Blog = mongoose.model('Blog', postSchema);



//routes path

app.get('/',function(req,res){

        Blog.find({},function(err,docs){
        if(!err)
        res.render('Home',{content:homestart, postsar:docs});

        else
        console.log(err);
    });
})

app.get('/about',function(req,res){
    res.render('about',{content:aboutstart});
})

app.get('/contact',function(req,res){
    res.render('contact',{content:contactstart});
})

app.get('/compose',function(req,res){
    res.render('compose');
})


app.post('/compose',function(req,res){

    const post = new Blog({
        title:req.body.title,
        description:req.body.description
    })

    post.save(function(err){

        if (!err){
     
          res.redirect("/");
     
        }
     
      });

})

app.get("/posts/:postid", function(req,res){
    let querystr= req.params.postid;
    Blog.findById(querystr , function(err,doc){
        if(!err)
        res.render('posts',{giventitle:doc.title, givendescription:doc.description});
})
})



app.listen( process.env.PORT || 3000 ,function(){
    console.log('The server has started!!!');
})