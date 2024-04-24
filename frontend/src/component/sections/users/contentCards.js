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

export default function ({users ,handleRefetch}) {
  const [editpage, seteditpage] = useState(false);
  const [deletePage, setdeletePage] = useState(false);
  return (
    <>
      <div className="row staff-grid-row">
        {users &&
          users.map((user) => (
            <>
              <div class="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-3" key={user.id} >
                <div class="profile-widget">
                  <div class="profile-img">
                    <a href={`/users/${user.id}`} class="avatar"><img height={80} src={user.image ? user.image : "http://localhost:8000/avatar/user.jpg"} alt="picture" /></a>
                  </div>
                  <div className="dropdown profile-action">
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
                  <h4 class="user-name m-t-10 mb-0 text-ellipsis"><a href={`/users/${user.id}`}>{user.name}</a></h4>
                  <div class="small text-muted"><span className={`badge ${user.role == 'admin' ? "bg-inverse-danger" : user.role == 'manager' ? "bg-inverse-warning" : user.role == 'regular' ? "bg-inverse-primary" : ""}`}>
                    {user.role}
                  </span>
                    <h6 class="user-name m-t-10 mb-0 text-ellipsis">{user.email}</h6>
                  </div>
                </div>
              </div>
            </>
          ))}
      </div>
      {editpage && <Edit user={editpage} onEditComplete={handleRefetch} />}
      {deletePage && <Delete id={deletePage} onEditComplete={handleRefetch} />}
    </>
  );
}
