const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithname = users.filter((user)=>{
        return user.username === username
      });
    if(userswithname.length > 0){
        return false;
      } else {
        return true;
      }
    };

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
}

    if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
        data: username
    }, 'secret', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).json({message:"User successfully logged in"});
    } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
    });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization["username"];
  let review = req.query.review;
  let isbn = req.params.isbn;

  books[isbn]["reviews"][username] = review

  if (books[isbn]["reviews"][username] === review){
      
    return res.status(201).json({message:"Your review has been succesfully added"});
  }
  else {
      
          res.send.json("Your review not added");
      }


});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization["username"];
    let isbn = req.params.isbn;
    let reviews = books[isbn]["reviews"];
    const hasKey = username in reviews
    
    if (hasKey){
        delete(reviews[username]);
        res.send("Your review has been succesfully deleted");
    }else{
        res.send("Your have not yet reviewed this book")
    }

   
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser