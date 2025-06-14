import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [joke, setJoke] = useState("");
  const [quote, setQuote] = useState("");
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

  // Загрузка анекдота и цитаты
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🃏 Анекдот
        const jokeRes = await axios.get(
          "https://api.rss2json.com/v1/api.json?rss_url=https://www.anekdot.ru/rss/export_j.xml"
        );
        setJoke(jokeRes.data.items[0].description);

        // 💬 Цитата
        const quoteRes = await axios.get("https://api.quotable.io/random");
        setQuote(`"${quoteRes.data.content}" — ${quoteRes.data.author}`);
      } catch (err) {
        console.error("Ошибка при загрузке API:", err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Функции для задач
  const addTask = (text) => {
    if (text.trim()) {
      const newTask = {
        id: Date.now(),
        text,
        done: false,
      };
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

      {/* Блок с анекдотом и цитатой */}
      {!loading && !error && (
        <div className="info">
          <div>
            <strong>😂 Анекдот:</strong>
            <div dangerouslySetInnerHTML={{ __html: joke }} />
          </div>
          <div style={{ marginTop: "10px" }}>
            <strong>💡 Цитата:</strong>
            <div>{quote}</div>
          </div>
        </div>
      )}

      {/* Форма задач */}
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

      {/* Список задач */}
      <div className="tasks">
        {tasks.map((task) => (
          <div key={task.id} className={`task ${task.done ? "done" : ""}`}>
            <span onClick={() => toggleTask(task.id)}>{task.text}</span>
            <button onClick={() => deleteTask(task.id)}>×</button>
          </div>
        ))}
      </div>

      {loading && <div>Загрузка...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
