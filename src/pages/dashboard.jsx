import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function Dashbord() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Optional: persist mode
    return localStorage.getItem("darkMode") === "true";
  });

  const [user, setUser] = useState(null);

 
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
 // authetication 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "completed") return task.completed;
    if (statusFilter === "pending") return !task.completed;
    return true;
  });

  const handleInputChange = (e) => setTask(e.target.value);

  const handleAddTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now(), text: task.trim(), completed: false }]);
      setTask("");
    }
  };

  const startEdit = (id, text) => {
    setEditingTaskId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editingText.trim() } : t)));
    setEditingTaskId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingText("");
  };
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Logged in user:", user);
    } catch (err) {
      console.error("Login error:", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Todo App</h1>
          {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">{user.displayName}</span>
                <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded-full">Logout</button>
              </div>
            ) : (
              <button onClick={handleLogin} className="px-3 py-1 bg-green-500 text-white rounded-full">Login with Google</button>
          )}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-sm px-3 py-1 border rounded-full bg-gray-200 dark:bg-gray-700 dark:text-white"
          >
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={task}
            onChange={handleInputChange}
            placeholder="Enter a task"
            className="flex-grow border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {["all", "completed", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition 
                ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <ul>
          {filteredTasks.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 py-2"
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() =>
                    setTasks(
                      tasks.map((task) =>
                        task.id === t.id
                          ? { ...task, completed: !task.completed }
                          : task
                      )
                    )
                  }
                  className="form-checkbox text-blue-600"
                />
                {editingTaskId === t.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(t.id);
                      else if (e.key === "Escape") cancelEdit();
                    }}
                    className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                    autoFocus
                  />
                ) : (
                  <span
                    className={t.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}
                  >
                    {t.text}
                  </span>
                )}
              </label>

              {editingTaskId === t.id ? (
                <>
                  <button
                    onClick={() => saveEdit(t.id)}
                    className="text-green-600 hover:text-green-800 px-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-600 hover:text-gray-800 px-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(t.id, t.text)}
                    className="text-blue-600 hover:text-blue-800 px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setTasks(tasks.filter((task) => task.id !== t.id))}
                    className="text-red-500 hover:text-red-700 font-bold px-2"
                    aria-label={`Delete task ${t.text}`}
                  >
                    X
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
