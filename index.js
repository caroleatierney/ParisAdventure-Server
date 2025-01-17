// ******************************
// ******* DEPENDENCIES *********
// ******************************
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const ParisMemories = require("./models/ParisMemories");
const mongoose = require("mongoose");

// ******************************
// ******** Express App *********
// ******************************
const app = express();

// ******************************
// ************ PORT ************
// ******************************
const PORT = process.env.PORT || 8000;

// ******************************
// ********  MIDDLEWARE *********
// ******************************
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// ******************************
// **** CONNECT TO MONGO DB *****
// ******************************

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// ****************************************
// *************** ROUTES *****************
// ****************************************

// *************************************
// *********   Paris Memories  *********
// *************************************

// Get all Blogs
app.get("/api/parismemories", async (req, res) => {
  try {
    const data = await ParisMemories.find({});
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Paris Memories:", error);
    res.status(500).json({ error: "An error occurred while fetching Paris Memories" });
  }
});

// Get blog by ID
app.get("/api/parismemories/:id", async (req, res) => {
  try {
    const data = await ParisMemories.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the blog." });
  }
});

// Get blog array by postId
app.get("/api/parismemories/:postId/blogArray", async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if the id is a valid ObjectId
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }

    const data = await ParisMemories.findById(postId, "blogArray");

    if (!data) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(data.blogArray);
  } catch (error) {
    console.error("Error fetching blogArray:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the blogArray." });
  }
});

// Get blog array by postId and specific array item
app.get("/api/parismemories/:postId/blogArray/:itemId", async (req, res) => {
  try {
    const { postId, itemId } = req.params;

    // Check if the postId and itemId are valid ObjectIds
    if (
      !mongoose.isValidObjectId(postId) ||
      !mongoose.isValidObjectId(itemId)
    ) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const data = await ParisMemories.findById(postId, "blogArray");

    if (!data) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Find the specific item in the blogArray
    const item = data.blogArray.find((item) => item._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({ error: "Blog array item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching blogArray:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the blogArray." });
  }
});

// Create a post
app.post("/api/parismemories", async (req, res) => {
  try {
    const data = await ParisMemories.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "An error occurred while creating a post." });
  }
});

// Update a post by postId
app.put("/api/parismemories/:postId", async (req, res) => {
  try {
    // send data through a body

    const postId = req.params.postId;
    const { title, image, date, description, blogArray } = req.body;

    const updatedPost = await ParisMemories.findByIdAndUpdate(
      postId,
      {
        title,
        image,
        date,
        description,
        blogArray,
      },
      { new: true }
    );
    res.json(data)
    console.log("Data" + data)

    if (!updatedPost) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating blog:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the blog." });
  }
});

//  Update blogArray by postId
app.put("/api/parismemories/:postId/blogArray", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { newBlog } = req.body;

    const updatedPost = await ParisMemories.findByIdAndUpdate(
      postId,
      { $push: { blogArray: newBlog } },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating blogArray:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the blogArray." });
  }
});

// Delete a post by postId
app.delete("/api/parismemories/:postId", async (req, res) => {
  try {
    const data = await ParisMemories.findByIdAndDelete(req.params.postId);
    if (!data) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the blog." });
  }
});

// Delete a blog by blogId
app.delete("/api/parismemories/:postId/blogArray/:itemId", async (req, res) => {
  const { postId, itemId } = req.params;
  try {
    const result = await ParisMemories.updateOne(
      { _id: postId },
      { $pull: { blogArray: { _id: itemId } } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "Blog item not found or not deleted" });
    }

    res.status(200).json({ message: "Blog item deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      error: "An error occurred while deleting the blog item",
      details: error.message,
    });
  }
});

// ****************************************
// ************** LISTENER ****************
// ****************************************

app.get("/", (req, res) => {
  res.json("Hello World! This is your server!");
});

app.get("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
