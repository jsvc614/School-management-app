import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { IconContext } from "react-icons";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { nanoid } from "@reduxjs/toolkit";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";

function Navbar({ badge, logout, onShowNotifications, notifications }) {
  const [sidebar, setSidebar] = useState(false);

  const user = useSelector(selectCurrentUser);

  const navigate = useNavigate();

  const goToStudentProfile = () => {
    navigate(`/profile/${user.email}`);
  };

  let navLinkContent;
  if (user) {
    let navLinks = ["Home", "Messages", "Classes", "Schedule"];

    if (user?.role === "STUDENT") {
      navLinks = [
        "Home",
        "Messages",
        "Classes",
        "Schedule",
        "Attendance",
        "Grades",
      ];
    }

    navLinkContent = navLinks.map((navLink) => {
      return (
        <li className="navbar-toggle" key={nanoid()}>
          <NavLink
            to={navLink === "Home" ? "/" : navLink.toLowerCase()}
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            {navLink}
          </NavLink>
        </li>
      );
    });
  }

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <div className="navBar">
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar-container">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <ul className="no-mobile-nav">{navLinkContent}</ul>
          <div className="rightSection">
            <Badge
              onClick={onShowNotifications}
              badgeContent={notifications?.filter((noti) => !noti.read).length}
              className="notificationIcon"
              color="secondary"
              style={{ cursor: "pointer" }}
            >
              <span className="notificationTooltip">Show notifications</span>
              <MailIcon sx={{ fontSize: "35px" }} />
            </Badge>
            <div className={"userInfo"} onClick={goToStudentProfile}>
              <img src={user?.image.url} alt=""></img>
              <p>{user?.fullName}</p>
            </div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {navLinkContent}
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
}

export default Navbar;
