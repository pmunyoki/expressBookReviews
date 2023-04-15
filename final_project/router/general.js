const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = () => Promise.resolve(JSON.stringify(books,null,4))
const getBookIsbn = (isbn) => Promise.resolve(books[isbn])
const getBookAuthor = (author2) => {
    let text = {};
    for(var key in books){
      var author = books[key]["author"]
      if(author === author2 ){
         text[key]=books[key]
      }}
    return Promise.resolve(text)}

const getBookTitle = (title) => {
    let text = {};
    for(var key in books){
        var title1 = books[key]["title"]
        if(title === title1 ){
           text[key]=books[key]
        }}
    return Promise.resolve(text)}
    


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getAllBooks()
  .then(result => res.status(200).send(result))
  .catch(err => res.status(500).send(err));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  getBookIsbn(isbn)
  .then(result => res.status(200).send(result))
  .catch(err => res.status(500).send(err));
   });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author2 = req.params.author
  getBookAuthor(author2)
  .then(result => res.status(200).send(result))
  .catch(err => res.status(500).send(err));
   });
      
  
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    getBookTitle(title)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err));
    
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  res.send(books[isbn]["reviews"])
  
});

module.exports.general = public_users;
