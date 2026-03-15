import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const total = tasks.length;
  const completed = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  async function fetchTasks() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      if (!response.ok) throw new Error("Failed to load tasks");
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    const response = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (response.ok) {
      const created = await response.json();
      setTasks((current) => [created, ...current]);
      setNewTitle("");
    }
  }

  async function saveTask(id) {
    const title = editingTitle.trim();
    if (!title) return;

    const existing = tasks.find((task) => task.id === id);
    if (!existing) return;

    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: existing.completed }),
    });

    if (response.ok) {
      const updated = await response.json();
      setTasks((current) =>
        current.map((task) => (task.id === id ? updated : task)),
      );
      setEditingId(null);
      setEditingTitle("");
    }
  }

  async function toggleCompleted(task) {
    const response = await fetch(`${API_URL}/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        completed: !task.completed,
      }),
    });

    if (response.ok) {
      const updated = await response.json();
      setTasks((current) =>
        current.map((item) => (item.id === task.id ? updated : item)),
      );
    }
  }

  async function deleteTask(id) {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      setTasks((current) => current.filter((task) => task.id !== id));
    }
  }

  return (
    <main className="page">
      <section className="card">
        <header className="header">
          <h1>Task Board</h1>
          <p>
            {completed}/{total} completed
          </p>
        </header>

        <form className="add-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Add a task"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading...</p>}

        {!loading && (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <label className="check-wrap">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompleted(task)}
                  />
                </label>

                {editingId === task.id ? (
                  <input
                    className="edit-input"
                    value={editingTitle}
                    onChange={(event) => setEditingTitle(event.target.value)}
                  />
                ) : (
                  <span className={task.completed ? "done" : ""}>
                    {task.title}
                  </span>
                )}

                <div className="actions">
                  {editingId === task.id ? (
                    <button onClick={() => saveTask(task.id)}>Save</button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(task.id);
                        setEditingTitle(task.title);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="danger"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
