import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import axios from "../../api/axios";
import Add from "./add";
import Edit from "./edit";
import Delete from "./delete";
import { Link } from "react-router-dom";


const formatDate = dateString => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ({users,handleRefetch}) {
  const [editpage, seteditpage] = useState(false);
  const [deletePage, setdeletePage] = useState(false);
  return (
    <>

            {/* ---------------------------------- */}
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-striped custom-table mb-0 datatable">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined at</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users &&
                        users.map((user) => (
                          <>
                            <tr key={user.id}>
                              <td>{user.id}</td>
                              <td>
                                <h2 className="table-avatar">
                                  <img className="avatar" alt="" src={user.image?user.image:"http://localhost:8000/avatar/user.jpg"} />
                                  <a href={`/users/${user.id}`}>{user.name}</a>
                                </h2>
                              </td>
                              <td>{user.email}</td>
                              <td>
                                <span className={`badge ${user.role == 'admin'? "bg-inverse-danger":user.role == 'manager'?"bg-inverse-warning":user.role == 'regular'?"bg-inverse-primary":""}`}>
                                  {user.role}
                                  </span>
                                  </td>
                              <td>{formatDate(user.created_at)}</td>
                              <td className="text-right">
                                <div className="dropdown dropdown-action">
                                  <Link
                                    to="javascript:void(0)"
                                    className="action-icon dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="material-icons">more_vert</i>
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link
                                      className="dropdown-item"
                                      to={`/users/${user.id}`}
                                    >
                                      <i className="fa fa-eye m-r-5" /> More
                                      Info
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to="javascript:void(0)"
                                      data-toggle="modal"
                                      data-target="#edit_user"
                                      data-id={user.id}
                                      onClick={() => {
                                        seteditpage(user);
                                      }}
                                    >
                                      <i className="fa fa-pencil m-r-5" /> Edit
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to="javascript:void(0)"
                                      data-toggle="modal"
                                      data-target="#delete_approve"
                                      onClick={() => {
                                        setdeletePage(user.id);
                                      }}
                                    >
                                      <i className="fa fa-trash-o m-r-5" />{" "}
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* ---------------------------------- */}
            {editpage && <Edit user={editpage} onEditComplete={handleRefetch} />}
      {deletePage && <Delete id={deletePage} onEditComplete={handleRefetch} />}
    </>
  );
}
