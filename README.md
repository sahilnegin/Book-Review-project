# 📚 Book Review API

A RESTful API built with **Node.js**, **Express.js**, and **MongoDB** that allows users to register, log in, add books, and review them. This project was created as a mini-assignment to demonstrate backend fundamentals and JWT authentication.

---

## 🚀 Features

- ✅ JWT Authentication (Login/Signup)
- ✅ Add & browse books with pagination and filters
- ✅ Submit, update, and delete reviews (1 per user per book)
- ✅ Get average rating and all reviews per book
- ✅ Search books by title or author (case-insensitive, partial match)

---

## 🛠 Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT for Auth
- bcrypt for password hashing
- Postman for testing

---

## 🔧 Installation

```bash
git clone https://github.com/yourusername/book-review-api.git
cd book-review-api/backend
npm install

PORT=3000
MONGO_URI=stringhere/
JWT_SECRET=your_jwt_secret

🧪 API Endpoints
🔐 Auth
POST /api/signup
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
POST /api/login
{
  "email": "john@example.com",
  "password": "123456"
}
 Returns JWT token. Use it as:

makefile
Copy
Edit
Authorization: Bearer <token>
📘 Books
POST /api/books
Add a book (auth required)

json
Copy
Edit
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "genre": "Self-help"
}
GET /api/books
Optional query params:

bash
Copy
Edit
?page=1&limit=10&author=James&genre=Self-help
GET /api/books/:id
Get book by ID + paginated reviews

bash
Copy
Edit
?page=1&limit=5
✍️ Reviews
POST /api/books/:id/reviews
json
Copy
Edit
{
  "rating": 5,
  "comment": "Amazing book!"
}
PUT /api/reviews/:id
Update your review

json
Copy
Edit
{
  "rating": 4,
  "comment": "Updated comment"
}
DELETE /api/reviews/:id
Delete your review

🔍 Search
GET /api/search?q=atomic
Search by title or author (case-insensitive, partial match).

🧱 Schema Overview
User
js
Copy
Edit
{
  username: String,
  email: String,
  password: String (hashed)
}
Book
js
Copy
Edit
{
  title: String,
  author: String,
  genre: String,
  createdBy: ObjectId (User)
}
Review
js
Copy
Edit
{
  book: ObjectId,
  user: ObjectId,
  rating: Number,
  comment: String
}
📌 Notes
Only 1 review per user per book.

Reviews are paginated and include the reviewer's username.

Book list supports filters by author and genre.

Project is modular and uses environment variables.
