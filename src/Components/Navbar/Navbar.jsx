import React, { useState, useEffect } from "react";
import { NavbarLogo, NavbarLogoButton } from "../../Utilities/Svgs";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Axios from "axios";

const Navbar = () => {
  const [navbarActive, setNavbarActive] = useState(window.innerWidth >= 640);
  const [user, setUser] = useState(null);

  const handleToggleButtonClick = () => {
    setNavbarActive((previousState) => !previousState);
  };

  const handleResize = () => {
    setNavbarActive(window.innerWidth >= 640);
  };

  useEffect(() => {
    handleResize();

    const handleResizeThrottled = () => {
      handleResize();
    };

    window.addEventListener("resize", handleResizeThrottled);

    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      Axios.get("http://localhost:3001/api/user", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error("Failed to fetch user details:", error);
        });
    }
    return () => {
      window.removeEventListener("resize", handleResizeThrottled);
    };
  }, []);

  return (
    <motion.header
      transition={{ duration: 0.5, delay: 0.7 }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      className="fixed w-full top-0 z-20"
    >
      <nav className="navbar bg-navy-navbar h-13">
        <div className="container mx-auto px-4  h-full flex justify-between items-center">
          <div
            className={`navbar__toggle-menu bg-navy-navbar flex flex-col justify-center h-navbar absolute w-full sm:hidden ${
              navbarActive ? "navbar-active" : ""
            }`}
          >
            <ul className="nav-links text-white flex flex-col text-center gap-1">
              <NavItem link="/">Home</NavItem>
              <NavItem link="#about">About Us</NavItem>
              {!user && <NavItem link="#news">News</NavItem>}
              <NavItem link="#discover">Companies</NavItem>
            </ul>
          </div>
          <a href="#" className="navbar__logo" title="Navbar Logo">
            <NavbarLogo />
          </a>
          <button
            className="navbar__toggle-button sm:hidden"
            title="Toggle navigation"
            onClick={handleToggleButtonClick}
          >
            <NavbarLogoButton navbarActive={navbarActive} />
          </button>
          <ul className="nav-links hidden  text-white sm:flex flex-col sm:flex-row text-center gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-10">
            <NavItem link="/">Home</NavItem>
            <NavItem link="#about">About Us</NavItem>
            {!user && <NavItem link="#news">News</NavItem>}
            <NavItem link="#discover">Companies</NavItem>
          </ul>
          {user ? (
            <div className="navbar__user-email-circle hidden sm:flex items-center justify-center h-10 w-10 bg-blue-500 text-white rounded-full">
              User
            </div>
          ) : (
            <AuthButtons />
          )}
        </div>
      </nav>
    </motion.header>
  );
};

const NavItem = ({ link, children, ...props }) => (
  <li className="nav-item text-4xl font-extrabold transition-colors py-3  sm:text-base sm:p-0 sm:hover:text-stone-300">
    <a href={link} className="nav-link">
      {children}
    </a>
  </li>
);

const AuthButtons = () => {
  return (
    <div className="navbar__auth-buttons  flex flex-col sm:flex-row items-center gap-6 sm:gap-2 mt-2 sm:mt-0 text-white">
      <Link
        to={"/login"}
        className="text-center  navbar__signin-btn w-52 bg-orange-banner font-extrabold text-4xl rounded-2xl py-2 px-8 transition border-2 border-amber-600 hover:bg-transparent sm:text-base sm:w-20 sm:p-0"
      >
        Login
      </Link>
      <Link
        to={"/signUp"}
        className=" text-center navbar__signin-btn w-52 bg-bluish font-extrabold text-4xl rounded-2xl py-2 px-8 border-2 border-cyan-800 transition hover:bg-transparent sm:text-base sm:w-20 sm:p-0"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default Navbar;
