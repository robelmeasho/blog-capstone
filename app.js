import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // <- fixed "view" to "views"

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// In-memory post storage
const posts = [];

// Home page: show all posts
app.get("/", (req, res) => {
  res.render("index", { posts });
});

// Handle post creation
app.post("/", (req, res) => {
  const { title, content } = req.body;
  const id = Date.now(); // use timestamp as simple ID
  posts.push({ id, title, content });
  res.redirect("/");
});

// Handle post deletion
app.post("/posts/:id/delete", (req, res) => {
  const id = Number(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).send("Post was not found");
  }

  posts.splice(postIndex, 1); // <- fixed "postindex" typo
  res.redirect("/");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
