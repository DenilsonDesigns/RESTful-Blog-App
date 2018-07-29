const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');


//APP CONFIG
const app = express();
mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE MODEL CONFIG
const blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);

//RESTFUL ROUTES
app.get('/', (req,res)=>{
   res.redirect('/blogs');
});

//INDEX ROUTE
app.get('/blogs', (req,res)=>{
   Blog.find({}, (err, blogs)=>{
      if (err) {
         console.log("Error");
      } else {
         res.render('index', {blogs: blogs});
      }
   });
});

//NEW ROUTE
app.get("/blogs/new", (req,res)=>{
   res.render('new');
});

//CREATE ROUTE
app.post('/blogs', (req,res)=>{
   //CREATE BLOG
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, (err, newBlog)=>{
      if (err) {
         res.render('new');
      } else {
         //THEN, REDIRECT TO THE INDEX
         res.redirect('/blogs');
      }
   });
});

//SHOW ROUTE
app.get('/blogs/:id', (req,res)=>{
   Blog.findById(req.params.id, (err,foundBlog)=>{
      if (err) {
         res.redirect('/blogs');
      } else {
         res.render('show', {blog: foundBlog});
      }
   });
});

//EDIT ROUTE
app.get('/blogs/:id/edit', (req,res)=>{
   Blog.findById(req.params.id, (err, foundBlog)=>{
      if (err) {
         res.redirect('/blogs');
      } else {
         res.render('edit', {blog: foundBlog});
      }
   });
});

//UPDATE ROUTE
app.put("/blogs/:id", (req,res)=>{
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
      if (err) {
         res.redirect('/blogs');
      } else {
         res.redirect('/blogs/'+req.params.id);
      }
   });
});

//DELETE ROUTE
app.delete('/blogs/:id', (req,res)=>{
   //DESTRYO BLOG
   Blog.findByIdAndRemove(req.params.id, (err)=>{
      if (err) {
         res.redirect('/blogs');
      } else {
         res.redirect('/blogs');
      }
   });
});

/////////
//PORT///
/////////
const PORT = 3000;
app.listen(PORT, ()=>{
   console.log(`Server running on port: ${PORT}`);
});