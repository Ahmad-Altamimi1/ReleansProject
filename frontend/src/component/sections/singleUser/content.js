import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import axios from "../../api/axios";
import { Link, useParams } from "react-router-dom";

export default function () {
  const accessToken = sessionStorage.getItem("token");
  const [editpage, seteditpage] = useState(false);
  const [deletePage, setdeletePage] = useState(false);
  const { id } = useParams();
  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
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

  const {
    data: singleUser,
    isLoading,
    error,
    refetch,
  } = useQuery("singleUser", fetchOrder);
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

  console.log(singleUser);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Single User</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Single User</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-4">
              <div className="card dash-widget">
                <div className="card-body">
                  <span className="dash-widget-icon-pending">
                    <i className="fa fa-th-large"></i>
                  </span>
                  <div className="dash-widget-info">
                    <h3>{singleUser.order.length}</h3>
                    <span>Numbers of Orders</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-4">
              <div className="card dash-widget">
                <div className="card-body">
                  <span className="dash-widget-icon-pending">
                    <i className="fa fa-money"></i>
                  </span>
                  <div className="dash-widget-info">
                    <h3>
                      {singleUser.order.reduce(
                        (total, item) => total + item.total_price,
                        0
                      )}
                    </h3>
                    <span>Money Spent</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-4">
              <div className="card dash-widget">
                <div className="card-body">
                  <span
                    className={
                      singleUser.user.role === "regular"
                        ? "dash-widget-icon-progress"
                        : singleUser.user.role === "manager"
                        ? "dash-widget-icon"
                        : singleUser.user.role === "admin"
                        ? "dash-widget-icon-rejected"
                        : "dash-widget-icon-progress"
                    }
                  >
                    <i
                      className={
                        singleUser.user.role === "regular"
                          ? "fa fa-user"
                          : singleUser.user.role === "manager"
                          ? "fa fa-user-secret"
                          : singleUser.user.role === "admin"
                          ? "fa fa-grav"
                          : ""
                      }
                    ></i>
                  </span>
                  <div className="dash-widget-info">
                    <h3>{singleUser.user.role}</h3>
                    <span>User Role</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------- Product Information start----------------------------------------------------------- */}

          <div className="tab-content">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="profile-view">
                      <div className="profile-img-wrap">
                        <div className="profile-img">
                          <a href="">
                            <img
                              src={
                                singleUser.user.image
                                  ? singleUser.user.image
                                  : "http://localhost:8000/avatar/user.jpg"
                              }
                              alt=""
                            />
                          </a>
                        </div>
                      </div>
                      <div className="profile-basic">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="profile-info-left">
                              <h3 className="user-name m-t-0">
                                {singleUser.user.name}
                              </h3>
                              <h5 className="company-role m-t-0 mb-0">
                                User Role
                              </h5>
                              <small className="text-muted">
                                {singleUser.user.role}
                              </small>
                              <div className="staff-id">
                                User ID : {singleUser.user.id}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <ul className="personal-info">
                              <li>
                                <span className="title">Email:</span>
                                <span className="text">
                                  <a href="">{singleUser.user.email}</a>
                                </span>
                              </li>
                              <li>
                                <span className="title">Started At:</span>
                                <span className="text">
                                  {formatDate(singleUser.user.created_at)}
                                </span>
                              </li>
                              <li>
                                <span className="title">Verified At:</span>
                                <span className="text">
                                  {formatDate(
                                    singleUser.user.email_verified_at
                                  )}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------- Product Information end ----------------------------------------------------------- */}

            {/* --------------------------------------------------- Stock History start----------------------------------------------------------- */}

            <div className="card">
              <div className="card-body">
                <h3 className="card-title">
                  {" "}
                  Order items Information
                  {singleUser.order.status == "pending" ? (
                    <div className="mail-sent-time">
                      <Link
                        to="javascript:void(0)"
                        className="btn btn-custom"
                        data-toggle="modal"
                        data-target="#add_order_item"
                      >
                        Add Product
                      </Link>
                    </div>
                  ) : (
                    ""
                  )}
                </h3>
                <hr />

                <div className="row">
                  <div className="col-md-12">
                    <div className="table-responsive">
                      <table className="table table-striped custom-table mb-0 datatable">
                        <thead>
                          <tr>
                            <th>Order Number</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th className="text-right">Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {singleUser.order &&
                            singleUser.order.map((order) => (
                              <>
                                <tr>
                                  <td>{order.id}</td>
                                  <td>{order.total_price}</td>

                                  <td>
                                    <i
                                      className={`fa fa-dot-circle-o ${
                                        order.status === "pending"
                                          ? "text-secondary"
                                          : order.status === "in progress"
                                          ? "text-info"
                                          : order.status === "fulfilled"
                                          ? "text-success"
                                          : order.status === "rejected"
                                          ? "text-danger"
                                          : ""
                                      }`}
                                    ></i>{" "}
                                    {order.status}
                                  </td>
                                  <td>{formatDate(order.created_at)}</td>
                                  <td className="text-right">
                                    <Link
                                      className="btn btn-info"
                                      to={`/orders/${order.id}`}
                                    >
                                      <i className="fa fa-eye m-r-5" /> More
                                      Info
                                    </Link>
                                  </td>
                                </tr>
                              </>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
