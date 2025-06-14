import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [catImage, setCatImage] = useState("");
  const [randomText, setRandomText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Загрузка задач из localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Сохранение задач в localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Загрузка данных с API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCatImage("https://http.cat/404.jpg");

        const textRes = await axios.get(
          "https://baconipsum.com/api/?type=meat-and-filler&paras=1"
        );
        setRandomText(textRes.data[0]);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить данные.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addTask = (text) => {
    if (text.trim()) {
      const newTask = { id: Date.now(), text, done: false };
      setTasks([...tasks, newTask]);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <div className="app">
      <h1>Мои задачи ({tasks.length})</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask(e.target.task.value);
          e.target.task.value = "";
        }}
      >
        <input type="text" name="task" placeholder="Добавить задачу..." />
        <button type="submit">Добавить</button>
      </form>

      <div className="tasks">
        {tasks.map((task) => (
          <div key={task.id} className="task">
            <span
              onClick={() => toggleTask(task.id)}
              className={`task-text ${task.done ? "done" : ""}`}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)} className="task-delete">
              ×
            </button>
          </div>
        ))}
      </div>

      {!loading && !error && (
        <div className="info">
          <div>
            <strong>🐱 Картинка (HTTP кот):</strong>
            <div style={{ marginTop: "10px" }}>
              <img
                src={catImage}
                alt="HTTP Cat"
                className="animal-image"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/200x200?text=Нет+изображения";
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <strong>📝 Случайный текст:</strong>
            <p className="animal-text">{randomText}</p>
          </div>
        </div>
      )}

      {loading && <div className="loading">Загрузка...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
