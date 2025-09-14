import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";

    const handleSubmit = () => {
        setError("");
        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Unable to create Todo item");
                    return res.json();
                })
                .then((data) => {
                    setTodos([...todos, data]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully");
                    setTimeout(() => setMessage(""), 3000);
                })
                .catch(() => setError("Unable to create Todo item"));
        } else {
            setError("Both fields are required!");
        }
    };

    useEffect(() => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch(() => setError("Failed to fetch todos"));
    }, []);

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: editTitle, description: editDescription }),
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Unable to update Todo item");
                    return res.json();
                })
                .then(() => {
                    setTodos(todos.map((item) => (item._id === editId ? { ...item, title: editTitle, description: editDescription } : item)));
                    setEditId(null);
                    setMessage("Item updated successfully");
                    setTimeout(() => setMessage(""), 3000);
                })
                .catch(() => setError("Unable to update Todo item"));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            fetch(apiUrl + "/todos/" + id, { method: "DELETE" })
                .then(() => setTodos(todos.filter((item) => item._id !== id)))
                .catch(() => setError("Failed to delete item"));
        }
    };

    return (
        <div className="container-fluid bg-dark text-white vh-100 vw-100 d-flex flex-column align-items-center justify-content-start py-5 px-3">


            <div className="text-center p-3 bg-black text-white rounded shadow-lg w-100">
                <h1>📌 To-Do List (MERN)</h1>
            </div>

            <div className="mt-4 p-4 bg-black rounded shadow-lg w-75 w-md-100">
                <h3 className="mb-3 text-center">➕ Add a New Task</h3>
                {message && <p className="text-success fw-bold text-center">{message}</p>}
                <div className="d-flex flex-column flex-md-row gap-2">
                    <input
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="form-control bg-dark text-white border-white w-100"
                        type="text"
                    />
                    <input
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="form-control bg-dark text-white border-white w-100"
                        type="text"
                    />
                    <button className="btn btn-outline-light shadow-sm" onClick={handleSubmit}>
                        Add
                    </button>
                </div>
                {error && <p className="text-danger fw-bold mt-2 text-center">{error}</p>}
            </div>

            <div className="mt-4 w-75 w-md-100">
                <h3 className="mb-3 text-center">📋 Your Tasks</h3>
                <div className="row">
                    {todos.length === 0 && <p className="text-center text-muted">No tasks added yet!</p>}
                    {todos.map((item) => (
                        <div key={item._id} className="col-md-4 col-sm-6 mb-3">
                            <div className="card bg-dark text-white shadow-lg border-0">
                                <div className="card-body">
                                    {editId !== item._id ? (
                                        <>
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text">{item.description}</p>
                                            <div className="d-flex justify-content-between">
                                                <button className="btn btn-outline-warning" onClick={() => handleEdit(item)}>
                                                    ✏️ Edit
                                                </button>
                                                <button className="btn btn-outline-danger" onClick={() => handleDelete(item._id)}>
                                                    🗑 Delete
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                placeholder="Edit Title"
                                                className="form-control mb-2 bg-dark text-white border-white"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                            />
                                            <input
                                                placeholder="Edit Description"
                                                className="form-control mb-2 bg-dark text-white border-white"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                            />
                                            <div className="d-flex justify-content-between">
                                                <button className="btn btn-outline-success" onClick={handleUpdate}>
                                                    ✅ Save
                                                </button>
                                                <button className="btn btn-outline-secondary" onClick={() => setEditId(null)}>
                                                    ❌ Cancel
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
