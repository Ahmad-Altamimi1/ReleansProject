import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import axios from "../../api/axios";
import Add from "./add";
import Quantity from "./quantity";
import Delete from "./delete";
import { Link, useParams } from "react-router-dom";

export default function () {
  const accessToken = localStorage.getItem("token");
  const [editpage, seteditpage] = useState(false);
  const [deletePage, setdeletePage] = useState(false);
  const { id } = useParams();
  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/orders/${id}`, {
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
    data: singleOrder,
    isLoading,
    error,
    refetch,
  } = useQuery("singleOrder", fetchOrder);
  const handleRefetch = () => {
    refetch();
  };
  if (isLoading) return <div className="loader"></div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(singleOrder);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Single Order</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="index.php">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Single Order</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <div className="card-body">
                  <span className="dash-widget-icon">
                    <i className="fa fa-truck"></i>
                  </span>
                  <div className="dash-widget-info">
                    <h3>{singleOrder.order.id}</h3>
                    <span>Order Number</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <div className="card-body">
                  <span className="dash-widget-icon">
                    <i className="fa fa-money"></i>
                  </span>
                  <div className="dash-widget-info">
                    <h3>{singleOrder.order.total_price}</h3>
                    <span>Order Worth</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <div className="card-body">
                  <span className="dash-widget-icon">
                    <i className="fa fa-cart-plus"></i>
                  </span>
                  <div className="dash-widget-info">
                    <h3>{formatDate(singleOrder.order.created_at)}</h3>
                    <span>Created At</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <div className="card-body">
                  <span
                    className={
                      singleOrder.order.status === "pending"
                        ? "dash-widget-icon-pending"
                        : singleOrder.order.status === "fulfilled"
                        ? "dash-widget-icon-fulfilled"
                        : singleOrder.order.status === "in progress"
                        ? "dash-widget-icon-progress"
                        : singleOrder.order.status === "rejected"
                        ? "dash-widget-icon-rejected"
                        : ""
                    }
                  >
                    <i
                      className={
                        singleOrder.order.status === "pending"
                          ? "fa fa-spinner"
                          : singleOrder.order.status === "fulfilled"
                          ? "fa fa-check"
                          : singleOrder.order.status === "in progress"
                          ? "fa fa-location-arrow"
                          : singleOrder.order.status === "rejected"
                          ? "fa fa-ban"
                          : ""
                      }
                    ></i>
                  </span>
                  <div className="dash-widget-info">
                    <h3>{singleOrder.order.status}</h3>
                    <span>Order Status</span>
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
                                singleOrder.order.user.image
                                  ? singleOrder.order.user.image
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
                                {singleOrder.order.user.name}
                              </h3>
                              <h5 className="company-role m-t-0 mb-0">
                                User Role
                              </h5>
                              <small className="text-muted">
                                {singleOrder.order.user.role}
                              </small>
                              <div className="staff-id">
                                User ID : {singleOrder.order.user.id}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <ul className="personal-info">
                              <li>
                                <span className="title">Email:</span>
                                <span className="text">
                                  <a href="">{singleOrder.order.user.email}</a>
                                </span>
                              </li>
                              <li>
                                <span className="title">Started At:</span>
                                <span className="text">
                                  {formatDate(
                                    singleOrder.order.user.created_at
                                  )}
                                </span>
                              </li>
                              <li>
                                <span className="title">Verified At:</span>
                                <span className="text">
                                  {formatDate(
                                    singleOrder.order.user.email_verified_at
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
                  {singleOrder.order.status == "pending" ? (
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
                            <th>Product Name</th>
                            <th>Product Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Added At</th>
                            {singleOrder.order.status == "pending" ? (
                              <th className="text-right">Action</th>
                            ) : (
                              ""
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {singleOrder.orderItem &&
                            singleOrder.orderItem.map((item) => (
                              <>
                                <tr>
                                  <td>{item.product.name}</td>
                                  <td>{item.price_for_unit}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.price_for_unit * item.quantity}</td>
                                  <td>{formatDate(item.created_at)}</td>

                                  {singleOrder.order.status == "pending" ? (
                                    <td className="text-right">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="javascript:void(0)"
                                          className="action-icon dropdown-toggle"
                                          data-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="javascript:void(0)"
                                            data-toggle="modal"
                                            data-target="#Update_order_item"
                                            data-id={item.id}
                                            onClick={() => {
                                              seteditpage(item);
                                            }}
                                          >
                                            <i className="fa fa-pencil m-r-5" />
                                            Update Quantity
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="javascript:void(0)"
                                            data-toggle="modal"
                                            data-target="#delete_order_item"
                                            onClick={() => {
                                              setdeletePage(item.id);
                                            }}
                                          >
                                            <i className="fa fa-trash-o m-r-5" />{" "}
                                            Delete
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  ) : (
                                    ""
                                  )}
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
      <Add onEditComplete={handleRefetch} orderData={singleOrder} />
      {editpage && <Quantity item={editpage} onEditComplete={handleRefetch} />}
      {deletePage && <Delete id={deletePage} onEditComplete={handleRefetch} />}
    </>
  );
}
