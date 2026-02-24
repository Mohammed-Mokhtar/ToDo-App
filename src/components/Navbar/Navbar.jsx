import React, { useContext, useEffect } from "react";
import styles from "./Navbar.module.css";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { initFlowbite } from "flowbite";

export default function Navbar() {
  let { userData, userToken, setUserToken, setUserData } =
    useContext(UserContext);
  const handleSignOut = function () {
    setUserToken(null);
    setUserData(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
  };

  useEffect(() => {
    initFlowbite();
  }, [userData]);

  return (
    <nav className="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-xl text-blue-800 font-semibold whitespace-nowrap capitalize">
            ToDo App
          </span>
        </Link>

        {userData && (
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="flex text-sm bg-neutral-primary rounded-full md:me-0 focus:ring-4 focus:ring-neutral-tertiary"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span className="sr-only">Open user menu</span>

              <div className="relative w-10 h-10 overflow-hidden bg-neutral-secondary-medium rounded-full pointer-events-none">
                <svg
                  className="absolute w-12 h-12 text-body-subtle -left-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </button>
            {/* Dropdown menu */}
            <div
              className="z-50 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44"
              id="user-dropdown"
            >
              <div className="px-4 py-3 text-sm border-b border-default">
                <span className="block text-heading font-medium">
                  {userData.name}
                </span>
                <span className="block text-body truncate">
                  {userData.email}
                </span>
              </div>
              <ul
                className="p-2 text-sm text-body font-medium"
                aria-labelledby="user-menu-button"
              >
                <li>
                  <Link
                    to="login"
                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                    onClick={() => handleSignOut()}
                  >
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            </button>
          </div>
        )}
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
            {userData && (
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0"
                      : "block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                  }
                  aria-current="page"
                >
                  Home
                </NavLink>
              </li>
            )}
            {userData && (
              <li>
                <NavLink
                  to="profile"
                  className={({ isActive }) =>
                    isActive
                      ? "block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0"
                      : "block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                  }
                >
                  Profile
                </NavLink>
              </li>
            )}
            {!userData && (
              <li>
                <NavLink
                  to="login"
                  className={({ isActive }) =>
                    isActive
                      ? "block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0"
                      : "block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                  }
                >
                  Login
                </NavLink>
              </li>
            )}
            {!userData && (
              <li>
                <NavLink
                  to="register"
                  className={({ isActive }) =>
                    isActive
                      ? "block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0"
                      : "block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                  }
                >
                  Register
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
