import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError("Failed to fetch items..");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error("Failed to create item");
      setName("");
      setDescription("");
      setError("");
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/items/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>MERN Stack App</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div>
          <input
            type="text"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 8, width: "70%", marginRight: 8 }}
            data-testid="name-input"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: 8, width: "70%", marginRight: 8 }}
            data-testid="desc-input"
          />
        </div>
        <button
          type="submit"
          style={{ padding: "8px 16px", marginTop: 8 }}
          data-testid="submit-btn"
        >
          Add Item
        </button>
      </form>

      <h2>Items ({items.length})</h2>
      <ul data-testid="items-list">
        {items.map((item) => (
          <li
            key={item._id}
            style={{ marginBottom: 10, listStyle: "none" }}
            data-testid="item"
          >
            <strong>{item.name}</strong> - {item.description}
            <button
              onClick={() => handleDelete(item._id)}
              style={{ marginLeft: 10, color: "red" }}
              data-testid="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p data-testid="empty-message">No items yet.</p>}
    </div>
  );
}

export default App;
