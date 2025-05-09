import React from "react";

const Dropdown = ({ title, options, onSelect }) => (
  <div className="dropdown mb-3">
    <button
      className="btn btn-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {title}
    </button>
    <ul className="dropdown-menu">
      <li>
        <a className="dropdown-item" href="#" onClick={() => onSelect("")}>
          Todos
        </a>
      </li>
      {options.map((option) => (
        <li key={option}>
          <button className="dropdown-item" onClick={() => onSelect(option)}>
            {option}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default Dropdown;
