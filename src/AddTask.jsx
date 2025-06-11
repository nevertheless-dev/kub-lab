import React, { useState } from "react";

const ToDoForm = ({ addTask }) => {
  const [input, setInput] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTask(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit(e)}
        placeholder="Добавить задачу"
      />
      <button type="submit">+</button>
    </form>
  );
};

export default ToDoForm;
