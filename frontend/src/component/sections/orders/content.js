import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import axios from "../../api/axios";
import Add from "./add";
import Delete from "./delete";
import Status from "./status";
import { Link } from "react-router-dom";

const fetchProducts = async () => {
  const accessToken = localStorage.getItem("token");
  try {
    const response = await axios.get("/orders", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export default function () {
  const [editpage, seteditpage] = useState({});
  const [deletePage, setdeletePage] = useState(false);
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery("orders", fetchProducts);
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
                  <h3 className="page-title">Orders</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Orders</li>
                  </ul>
                </div>
                <div className="col-auto float-right ml-auto">
                  <Link
                    to="javascript:void(0)"
                    className="btn add-btn"
                    data-toggle="modal"
                    data-target="#add_order"
                  >
                    <i className="fa fa-plus" /> Add Order
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-striped custom-table mb-0 datatable">
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Ordered User</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders &&
                        orders.orders.map((order) => (
                          <>
                            <tr>
                              <td>{order.id}</td>
                              <td>{order.userName}</td>
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
                                      to={`/orders/${order.id}`}
                                    >
                                      <i className="fa fa-eye m-r-5" /> More
                                      Info
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to="javascript:void(0)"
                                      data-toggle="modal"
                                      data-target="#update_status_order"
                                      data-id={order.id}
                                      onClick={() => {
                                        seteditpage(order);
                                      }}
                                    >
                                      <i className="fa fa-pencil m-r-5" /> Edit
                                      Status
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to="javascript:void(0)"
                                      data-toggle="modal"
                                      data-target="#delete_approve"
                                      onClick={() => {
                                        setdeletePage(order.id);
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
                    {/*?php $cnt+=1;
										}
									}?*/}
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* /Page Content */}
          {/* Add Leave Modal */}
          {/* /Delete Leave Modal */}
        </div>
      </>
      <Add allProducts={orders.allProducts} onEditComplete={handleRefetch} />
      {editpage && <Status order={editpage} onEditComplete={handleRefetch} />}
      {deletePage && <Delete id={deletePage} onEditComplete={handleRefetch} />}
    </>
  );
}
