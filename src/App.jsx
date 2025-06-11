import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  // Состояния
  const [tasks, setTasks] = useState([]);
  const [usdRate, setUsdRate] = useState("");
  const [eurRate, setEurRate] = useState("");
  const [weather, setWeather] = useState(null);
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

  // Загрузка данных (курс валют и погода)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Курс валют
        const currency = await axios.get(
          "https://www.cbr-xml-daily.ru/daily_json.js"
        );
        setUsdRate(currency.data.Valute.USD.Value.toFixed(2));
        setEurRate(currency.data.Valute.EUR.Value.toFixed(2));

        // Погода
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const weatherData = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=c7616da4b68205c2f3ae73df2c31d177`
          );
          setWeather(weatherData.data);
        });
      } catch (err) {
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Функции для работы с задачами
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

  // Рендер компонента
  return (
    <div className="app">
      <h1>Мои задачи ({tasks.length})</h1>

      {/* Блок с курсами и погодой */}
      {!loading && !error && (
        <div className="info">
          <div>
            $ {usdRate} руб. | € {eurRate} руб.
          </div>
          {weather && (
            <div>Погода: {Math.round(weather.main.temp - 273.15)}°C</div>
          )}
        </div>
      )}

      {/* Форма добавления задачи */}
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
