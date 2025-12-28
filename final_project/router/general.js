const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/**
 * TASK 6: Register a new user
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password missing" });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

/**
 * TASK 1: Get the list of all books (SYNC)
 */
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

/**
 * TASK 2: Get book details based on ISBN (SYNC)
 */
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

/**
 * TASK 3: Get book details based on Author (SYNC)
 */
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  });

  res.send(result);
});

/**
 * TASK 4: Get book details based on Title (SYNC)
 */
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  });

  res.send(result);
});

/**
 * TASK 5: Get book review (SYNC)
 */
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

/**
 * TASK 10: Get all books using ASYNC / AWAIT with AXIOS
 */
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});
/**
 * TASK 11: Get book details based on ISBN using ASYNC / AWAIT with AXIOS
 */
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});
/**
 * TASK 12: Get book details based on Author using ASYNC / AWAIT with AXIOS
 */
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(
      `http://localhost:5000/author/${author}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});






module.exports.general = public_users;
