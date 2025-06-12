import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { layoutChildren } from "../routes/routes"; // Импорт твоего массива маршрутов

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === `/${path}`;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
        <Link
          to="/home"
          className="flex items-center text-lg font-semibold tracking-widest text-gray-900 dark:text-white uppercase"
        >
          Light In My June
        </Link>

        <button
          type="button"
          className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-controls="navbar-menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {!isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:items-center md:justify-end`}
          id="navbar-menu"
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0 font-medium text-gray-700 dark:text-gray-200">
            {layoutChildren.map(({ path }) => (
              <li key={path}>
                <Link
                  to={`/${path}`}
                  className={`block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                    isActive(path)
                      ? "bg-gray-300 dark:bg-gray-600 font-semibold"
                      : "bg-transparent"
                  }`}
                  onClick={() => setIsOpen(false)} 
                >
                  {path}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}