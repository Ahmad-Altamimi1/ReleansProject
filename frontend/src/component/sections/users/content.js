import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import axios from "../../api/axios";
import Add from "./add";
import Edit from "./edit";
import Delete from "./delete";
import Grid from "./contentCards";
import Tabular from "./contentTable";
import { Link } from "react-router-dom";

const fetchUsers = async () => {
  const accessToken = sessionStorage.getItem("token");
  try {
    const response = await axios.get("/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data.users);

    return response.data.users;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function () {
  const [content, setcontentpage] = useState(true);

  const [editpage, seteditpage] = useState(false);
  const [deletePage, setdeletePage] = useState(false);
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery("users", fetchUsers);
  const handleRefetch = () => {
    refetch();
  };
  if (isLoading)
    return (
      <div className="page-wrapper">
        <div className="loader"></div>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <>
        <div className="page-wrapper">
          {/* Page Content */}
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col">
                  <h3 className="page-title">Users</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Users</li>
                  </ul>
                </div>
                <div className="col-auto float-right ml-auto">
                  <Link
                    to="javascript:void(0)"
                    className="btn add-btn"
                    data-toggle="modal"
                    data-target="#add_user"
                  >
                    <i className="fa fa-plus" /> Add User
                  </Link>
                  <div className="view-icons">
                    <Link
                      onClick={() => {
                        setcontentpage(false);
                      }}
                      id="Grid"
                      title="Grid View"
                      className={`list-view btn btn-link  ${
                        content == true ? "" : "active"
                      }`}
                    >
                      <i className="fa fa-th"></i>
                    </Link>
                    <Link
                      onClick={() => {
                        setcontentpage(true);
                      }}
                      id="Tabular"
                      title="Tabular View"
                      className={`list-view btn btn-link  ${
                        content == true ? "active" : ""
                      }`}
                    >
                      <i className="fa fa-bars"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------------------------- */}
            {content == true ? (
              <Tabular users={users} handleRefetch={handleRefetch} />
            ) : (
              <Grid users={users} handleRefetch={handleRefetch} />
            )}
            {/* ---------------------------------- */}
          </div>
        </div>
      </>
      <Add onEditComplete={handleRefetch} />
      {/* {editpage && <Edit use={editpage} onEditComplete={handleRefetch} />} */}
      {/* {deletePage && <Delete id={deletePage} onEditComplete={handleRefetch} />} */}
    </>
  );
}
