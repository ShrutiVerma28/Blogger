const express = require('express');
const app =express();
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const _ = require('lodash');
const passport = require('passport');
const session= require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user.js');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));


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
let todos=[];


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
app.engine('ejs', ejsMate);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));


  app.use(passport.initialize());
  app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//database definations

const postSchema = new mongoose.Schema({
    title:String,
    description:String
})

const todoSchema = new mongoose.Schema({
    todo:String
})

const Blog = mongoose.model('Blog', postSchema);
const Todo = mongoose.model('Todo', todoSchema);


//routes path

app.get('/',function(req,res){

        Blog.find({},function(err,docs){
        if(!err)
        res.render('Home',{content:homestart, postsar:docs});

        else
        console.log(err);
    });
})

app.get('/todo', function(req, res){

    let date = new Date();
    let weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    let dayOfWeek = weekday[date.getDay()];
	let dayOfMonth = ( date.getDate() < 10) ? '0':"" + date.getDate();
    let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
	let curMonth = months[date.getMonth()];
    let curYear = date.getFullYear();

    let today = dayOfWeek+", "+curMonth+" "+ dayOfMonth+" "+curYear;
    console.log(today);

    Todo.find({},function(err,docs){
        if(!err)
    res.render('Todo',{todos:docs, today:today});
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

app.get('/register', function(req,res){
    res.render('register');
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

app.post('/todo', function(req,res){

    const todo = new Todo({
        todo:req.body.todo
    })
    todo.save(function(err){
        if(!err){
            console.log(todo.todo);
            console.log(req.body.todo);
            res.redirect('/todo');
        }
    });
})

app.get('/todo/:id', function (req, res) {
    //delete the requested item form mongodb
    console.log("ID",req.params.id);

    Todo.findOneAndRemove(req.params.id, function(err,data) {
        if(!err) {
          console.log("Deleted");
        }
    });
    

    // Todo.findByIdAndDelete({todo: req.params.id}, function (err, doc) {
    //     if (err) {
    //         // handle error
    //         throw err;
    //     }
    //     else{
    //         console.log("DELETED",doc);
    //         res.redirect('/todo')
    //     }
        
    //     // doc.remove(function(error){
    //     //     console.log(error);
    //     //     if(!error){
    //     //         res.redirect('/todo');
    //     //     }
    //     //}); //Removes the document
    // })
    // // Todo.find({todo: req.params.item}).deleteOne(function (err, data) {
    // //   if (err) throw err;
    // //   res.json(data)
    // //   console.log(data)
    // // });
  });

app.get("/posts/:postid", function(req,res){
    let querystr= req.params.postid;
    Blog.findById(querystr , function(err,doc){
        if(!err)
        res.render('posts',{giventitle:doc.title, givendescription:doc.description});
})
})

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });



app.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/');
        })
    } catch (e) {
        res.redirect('/register');
    }
})


app.listen( process.env.PORT || 3300 ,function(){
    console.log('The server has started!!!');
})