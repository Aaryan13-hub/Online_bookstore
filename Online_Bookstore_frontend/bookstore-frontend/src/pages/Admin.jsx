import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar"; 
import axiosInstance from "../Config/axiosConfig";

function Admin() {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    price: "",
    stock: "",
    imageUrl: null, // 🟢 added to handle image update
  });

  const [newBook, setNewBook] = useState({
    title: "",
    genre: "",
    price: "",
    stock: "",
    imageUrl: "",
    authorNames: [],
  });

  const [authorInput, setAuthorInput] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // ✅ Fetch all books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axiosInstance
      .get("/getbooks")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Error fetching books:", err));
  };

  // ✅ Delete book
  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      axiosInstance
        .delete(`/delete/${bookId}`)
        .then((res) => {
          alert(res.data);
          setBooks((prev) => prev.filter((b) => b.bookId !== bookId));
        })
        .catch((err) => console.error("Error deleting book:", err));
    }
  };

  // ✅ Open update form with existing details
  const handleEdit = (book) => {
    setEditBook(book.bookId);
    setFormData({
      title: book.title,
      genre: book.genre,
      price: book.price,
      stock: book.stock,
      imageFile: null, // 🟢 reset image
      currentImageUrl: book.imageUrl, // 🟢 store current image for preview
    });
  };

  // ✅ Update book with optional image
const handleUpdate = async () => {
  if (!editBook) return;

  let uploadedImageUrl = formData.currentImageUrl; // keep old image

  if (formData.imageFile) {
    const imgData = new FormData();
    imgData.append("file", formData.imageFile);

    try {
      const uploadRes = await axiosInstance.post("/upload", imgData);
      uploadedImageUrl = uploadRes.data;
    } catch (err) {
      console.error("Error uploading image", err);
      alert("⚠️ Failed to upload new image.");
      return;
    }
  }

  const updatedBook = {
    title: formData.title,
    genre: formData.genre,
    price: Number(formData.price),
    stock: Number(formData.stock),
    imageUrl: uploadedImageUrl,
  };

  try {
    const res = await axiosInstance.put(
      `/update/${editBook}`,
      updatedBook
    );

    alert("✅ Book updated successfully!");

    setBooks((prev) =>
      prev.map((b) => (b.bookId === res.data.bookId ? res.data : b))
    );

    setEditBook(null);
    setFormData({
      title: "",
      genre: "",
      price: "",
      stock: "",
      imageFile: null,
      currentImageUrl: "",
    });
  } catch (err) {
    console.error("Error updating book:", err);
    alert("⚠️ Failed to update book.");
  }
};


  // ✅ Add author
  const handleAddAuthor = () => {
    if (authorInput.trim() === "") return;
    setNewBook({
      ...newBook,
      authorNames: [...newBook.authorNames, authorInput.trim()],
    });
    setAuthorInput("");
  };

  // ✅ Remove author
  const handleRemoveAuthor = (index) => {
    const updatedAuthors = newBook.authorNames.filter((_, i) => i !== index);
    setNewBook({ ...newBook, authorNames: updatedAuthors });
  };

  // ✅ Add new book
  const handleAddBook = async () => {
    if (
      !newBook.title ||
      !newBook.genre ||
      !newBook.price ||
      !newBook.stock ||
      newBook.authorNames.length === 0
    ) {
      alert("⚠️ Please fill in all fields before adding a book.");
      return;
    }

    let uploadedImageUrl = "";
    if (imageFile) {
      const imgData = new FormData();
      imgData.append("file", imageFile);

      try {
        const uploadRes = await axiosInstance.post(
          "/upload",
          imgData
        );
        uploadedImageUrl = uploadRes.data;
        console.log(uploadedImageUrl);
        
      } catch (err) {
        console.error("Error uploading image", err);
        alert("⚠️ Failed to upload image. Book not added.");
        return;
      }
    }

    const bookToAdd = {
      title: newBook.title,
      genre: newBook.genre,
      price: Number(newBook.price),
      stock: Number(newBook.stock),
      authorNames: newBook.authorNames,
      imageUrl: uploadedImageUrl,
    };

    try {
      const res = await axiosInstance.post("/add", bookToAdd);
      alert("✅ Book added successfully!");
      setBooks((prev) => [...prev, res.data]);
      setNewBook({
        title: "",
        genre: "",
        price: "",
        stock: "",
        imageUrl: "",
        authorNames: [],
      });
      setImageFile(null);
    } catch (err) {
      console.error("Error adding book:", err);
      alert("⚠️ Failed to add book.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 Book List</h2>

      {/* 🟢 Add Book Form */}
      <div
        style={{
          marginBottom: "20px",
          background: "#f9f9f9",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <h3>➕ Add New Book</h3>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newBook.price}
          onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          value={newBook.stock}
          onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files?.[0] ?? null)
          }
        />

        {/* 🟢 Multiple Authors */}
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Enter author name"
            value={authorInput}
            onChange={(e) => setAuthorInput(e.target.value)}
          />
          <button onClick={handleAddAuthor}>➕ Add Author</button>

          <div style={{ marginTop: "10px" }}>
            {newBook.authorNames.map((author, index) => (
              <span
                key={index}
                style={{
                  marginRight: "10px",
                  background: "#e3e3e3",
                  padding: "5px",
                  borderRadius: "5px",
                  display: "inline-block",
                }}
              >
                {author}{" "}
                <button
                  onClick={() => handleRemoveAuthor(index)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
              </span>
            ))}
          </div>
        </div>

        <button style={{ marginTop: "10px" }} onClick={handleAddBook}>
          💾 Add Book
        </button>
      </div>

      {/* ✅ Book Table */}
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#161515ff", color: "white" }}>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.bookId}>
                <td>{book.bookId}</td>
                <td>{book.title}</td>
                <td>{book.genre}</td>
                <td>{book.price}</td>
                <td>{book.stock}</td>
                <td>
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      width="80"
                      height="100"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(book)}>✏️ Update</button>
                  &nbsp;
                  <button onClick={() => handleDelete(book.bookId)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" align="center">
                No books available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Update Form */}
      {editBook && (
        <div style={{ marginTop: "20px" }}>
          <h3>✏️ Update Book Details</h3>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Genre"
            value={formData.genre}
            onChange={(e) =>
              setFormData({ ...formData, genre: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />

          {/* 🟢 Image update option */}
          <div style={{ marginTop: "10px" }}>
            <label>Current Image:</label><br />
            {formData.currentImageUrl ? (
              <img
                src={formData.currentImageUrl}
                alt="Current"
                width="100"
                style={{ margin: "10px 0", objectFit: "cover" }}
              />
            ) : (
              <p>No image available</p>
            )}
            <br />
            <label>Upload New Image (optional): </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, imageFile: e.target.files[0] })
              }
            />
          </div>

          <button onClick={handleUpdate} style={{ marginTop: "10px" }}>
            💾 Save
          </button>
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => setEditBook(null)}
          >
            ❌ Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default Admin;
