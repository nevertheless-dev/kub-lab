import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState("");
  const [joke, setJoke] = useState("");
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

  // Загрузка цитаты и анекдота
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Цитата с quotable.io через прокси api.allorigins.dev
        const quoteRes = await axios.get(
          "https://api.allorigins.dev/get?url=" +
            encodeURIComponent("https://api.quotable.io/random")
        );
        const quoteJson = JSON.parse(quoteRes.data.contents);
        setQuote(quoteJson.content);

        // Анекдот с anekdot.ru RSS через прокси api.allorigins.dev
        const jokeRes = await axios.get(
          "https://api.allorigins.dev/get?url=" +
            encodeURIComponent("https://www.anekdot.ru/rss/randomu.html")
        );

        const parser = new DOMParser();
        // Обязательно парсим как XML, а не HTML
        const xml = parser.parseFromString(
          jokeRes.data.contents,
          "application/xml"
        );
        const item = xml.querySelector("item");
        let text = "Анекдот не найден";

        if (item) {
          const description = item.querySelector("description");
          if (description) {
            text = description.textContent || description.innerHTML;
          }
        }

        setJoke(text);
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

      {!loading && !error && (
        <div className="info">
          <div>
            <strong>🧠 Цитата дня:</strong> {quote}
          </div>
          <div>
            <strong>😂 Анекдот:</strong>{" "}
            <span dangerouslySetInnerHTML={{ __html: joke }} />
          </div>
        </div>
      )}

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
