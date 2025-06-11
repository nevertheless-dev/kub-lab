import React from "react";

const ToDo = ({ todo, toggleTask, removeTask }) => (
  <div className="task">
    <span
      className={todo.complete ? "done" : ""}
      onClick={() => toggleTask(todo.id)}
    >
      {todo.task}
    </span>
    <button onClick={() => removeTask(todo.id)}>×</button>
  </div>
);

export default ToDo;
