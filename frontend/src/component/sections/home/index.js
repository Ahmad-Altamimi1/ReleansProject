import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import axios from "../../api/axios";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const fetchCollection = async () => {
  try {
    const response = await axios.get(`/collectionData`);
    return response.data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export default function () {
  const user = useSelector((state) => state.userData);

  const {
    data: collectionData,
    isLoading,
    error,
    refetch,
  } = useQuery("collectionData", fetchCollection);
  const handleRefetch = () => {
    refetch(collectionData);
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
      <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title"></h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active">Dashboard</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <div className="card-body">
                  <span className="dash-widget-icon">
                    <i className="fa fa-cubes" />
                  </span>
                  <div className="dash-widget-info">
                    <h3>{collectionData.Orders}</h3>
                    <span>Orders</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <div className="card-body">
                  <span className="dash-widget-icon">
                    <i className="fa fa-users" />
                  </span>
                  <div className="dash-widget-info">
                    <h3>{collectionData.usersCount}</h3>
                    <span>Users</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <div className="card-body">
                  <span className="dash-widget-icon">
                    <i className="fa fa-diamond" />
                  </span>
                  <div className="dash-widget-info">
                    <h3>{collectionData.Admins}</h3>
                    <span>Admins</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <div className="card-body">
                  <span className="dash-widget-icon">
                    <i className="fa fa-user" />
                  </span>
                  <div className="dash-widget-info">
                    <h3>{collectionData.EmployCount}</h3>
                    <span>Employees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {JSON.parse(user).role == "admin" && (
            <div className="row">
              <div className="col-md-12">
                <div className="card-group m-b-30">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <span className="d-block">Full Filled Order</span>
                        </div>
                        <div>
                          <span className="text-success">+10%</span>
                        </div>
                      </div>
                      <h3 className="mb-3">{collectionData.fulfilledOrder}</h3>

                      <div className="progress mb-2" style={{ height: 5 }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{
                            width: `${
                              (collectionData.fulfilledOrder /
                                collectionData.Orders) *
                              100
                            }%`,
                          }}
                          aria-valuenow={40}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mb-0">
                        Overall {collectionData.Orders} Order
                      </p>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <span className="d-block">Earnings</span>
                        </div>
                        <div>
                          <span className="text-success"></span>
                        </div>
                      </div>
                      <h3 className="mb-3">${collectionData.totalPrice}</h3>
                      {/* <div className="progress mb-2" style={{ height: 5 }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: "70%" }}
                        aria-valuenow={40}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <p className="mb-0">
                      Previous Month{" "}
                      <span className="text-muted">$1,15,852</span>
                    </p> */}
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <span className="d-block">Expenses</span>
                        </div>
                        <div>
                          <span className="text-danger"></span>
                        </div>
                      </div>
                      <h3 className="mb-3">{collectionData.progressOrder}</h3>
                      <div className="progress mb-2" style={{ height: 5 }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{
                            width: `${
                              (collectionData.progressOrder /
                                collectionData.Orders) *
                              100
                            }%`,
                          }}
                          aria-valuenow={40}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mb-0">
                        Overall {collectionData.Orders} Order
                      </p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <span className="d-block">Stock Movement</span>
                        </div>
                        <div>
                          <span className="text-danger"></span>
                        </div>
                      </div>
                      <h3 className="mb-3">{collectionData.StockMovement}</h3>
                      <div className="progress mb-2" style={{ height: 5 }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: "70%" }}
                          aria-valuenow={40}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mb-0">
                        {/* Previous Month{" "}
                      <span className="text-muted">$1,42,000</span> */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card card-table flex-fill">
                <div className="card-header">
                  <h3 className="card-title mb-0">Recent Orders</h3>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table custom-table mb-0">
                      <thead>
                        <tr>
                          <th>Orders Number </th>
                          <th>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collectionData.RecentOrders?.map((Order) => (
                          <tr>
                            <td>
                              <h2>
                                <a href="project-view.php">{Order.id}</a>
                              </h2>
                              <small className="block text-ellipsis">
                                {/* <span>1</span>
                                <span className="text-muted">open tasks, </span>
                                <span>9</span> */}
                                <span className="text-muted">
                                  {Order.status}
                                </span>
                              </small>
                            </td>
                            <td>
                              <div className="progress progress-xs progress-striped">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  data-toggle="tooltip"
                                  title="65%"
                                  style={{
                                    width:
                                      Order.status === "pending"
                                        ? "70%"
                                        : Order.status === "in progress"
                                        ? "70%"
                                        : Order.status === "fulfilled"
                                        ? "100%"
                                        : Order.status === "rejected"
                                        ? "0%"
                                        : "auto",
                                    backgroundColor:
                                      Order.status === "fulfilled"
                                        ? "green"
                                        : Order.status === "rejected"
                                        ? "red"
                                        : "#ff9b44",
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer">
                  <Link to="/orders">View all Orders</Link>
                </div>
              </div>
            </div>
          </div>
          {JSON.parse(user).role == "admin" && (
            <div className="row">
              <div className="col-md-12 d-flex">
                <div className="card card-table flex-fill">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Popular Products</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table custom-table mb-0">
                        <thead>
                          <tr>
                            <th>Products Nmae </th>
                            <th>Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {collectionData.popularProducts?.map((product) => (
                            <tr>
                              <td>
                                <h2>
                                  <a href="">{product.productName}</a>
                                </h2>
                                <small className="block text-ellipsis">
                                  {/* <span>1</span>
                                <span className="text-muted">open tasks, </span>
                                <span>9</span> */}
                                  <span className="text-muted">
                                    Purchase Count: {product.purchase_count}
                                  </span>
                                </small>
                              </td>
                              <td>
                                <div className="progress progress-xs progress-striped">
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    data-toggle="tooltip"
                                    title={`${
                                      (product.purchase_count /
                                        collectionData.OrdersItems) *
                                      100
                                    }%`}
                                    style={{
                                      width: `${
                                        (product.purchase_count /
                                          collectionData.OrdersItems) *
                                        100
                                      }%`, // Calculating width as a percentage
                                    }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="card-footer">
                    <Link to="/products">View all Products</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* /Page Content */}
      </div>
    </>
  );
}
