import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { SendNotiToUpdateNumber, userdata } from "../Redux/action";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
export default function () {
  const user = useSelector((state) => state.userData);
  const [page, setpage] = useState(window.location.href.split("/").pop());
  const dispatch = useDispatch();
  useEffect(() => {
    setpage(window.location.href.split("/").pop());
  }, []);
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      const response = await axios.post("/logout");
      window.sessionStorage.clear();
      window.localStorage.clear();
      dispatch(userdata(response.data.user));
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>Main</span>
              </li>

              <li className="">
                <Link to="/" className={page && page === "" ? "noti-dot" : ""}>
                  <i className="la la-home" /> <span> Dashboard</span>
                </Link>
              </li>

              {/* <li className="menu-title">
                <span>Employees</span>
              </li>
              <li className="submenu">
                <Link to="#" className="noti-dot">
                  <i className="la la-user" /> <span> Employees</span>
                </Link>
              </li> */}
              <li className="">
                <Link
                  to="/products"
                  className={page && page === "products" ? "noti-dot" : ""}
                >
                  <i className="la la-foursquare" /> <span> products</span>
                </Link>
              </li>
              <li className="">
                <Link
                  to="/users"
                  className={page && page === "users" ? "noti-dot" : ""}
                >
                  <i className="la la-users" /> <span> Users</span>
                </Link>
              </li>
              <li className="">
                <Link
                  to="/orders"
                  className={page && page === "orders" ? "noti-dot" : ""}
                >
                  <i className="fa fa-money" /> <span> orders</span>
                </Link>
              </li>
              <li className="">
                <Link
                  to="/stockMovements"
                  className={
                    page && page === "stockMovements" ? "noti-dot" : ""
                  }
                >
                  <i className="la la-expand" /> <span> Stock Movements</span>
                </Link>
              </li>
              <li className="">
                <Link
                  to="/AllNotification"
                  className={
                    page && page === "AllNotification" ? "noti-dot" : ""
                  }
                >
                  <i className="fa fa-bell-o" /> <span> Notifications</span>
                </Link>
              </li>
              <li>
                <Link to="http://127.0.0.1:8000/api/download-sales-report">
                  <i className="fa fa-file-pdf-o" /> <span>Sales Report</span>
                </Link>
              </li>

              <li
                onClick={() => {
                  handleLogout();
                }}
              >
                <Link>
                  <i className="fa fa-sign-out" /> <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
