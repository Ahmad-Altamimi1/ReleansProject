import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import axios from "../../api/axios";
import Add from "./add";
import Edit from "./edit";
import Delete from "./delete";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
const fetchProducts = async () => {
  const accessToken = localStorage.getItem("token");
  try {
    const response = await axios.get("/products", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.products;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export default function () {
  const userInfo = useSelector((state) => state.userData);
  const [editpage, seteditpage] = useState(false);

  const [deletePage, setdeletePage] = useState(false);
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery("products", fetchProducts);
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
                  <h3 className="page-title">Products</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Products</li>
                  </ul>
                </div>
                {userInfo && JSON.parse(userInfo).role != "regular" && (
                  <div className="col-auto float-right ml-auto">
                    <Link
                      to="javascript:void(0)"
                      className="btn add-btn"
                      data-toggle="modal"
                      data-target="#add_leave"
                    >
                      <i className="fa fa-plus" /> Add Product
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-striped custom-table mb-0 datatable">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Minimum Number Allowed In stock</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    {/* {JSON.parse(userInfo).role == "admin"  || JSON.parse(userInfo).id== && product.id(
                          <th className="text-right">Actions</th>
                        )} */}
                    <tbody>
                      {products &&
                        products.map((product) => (
                          <>
                            <tr key={product.id}>
                              <td>{product.name}</td>
                              <td>{product.description}</td>
                              <td>{product.price}</td>
                              <td>{product.quantity}</td>
                              <td>{product.MinimumNumberAllowedInstock}</td>

                              {(userInfo &&
                                JSON.parse(userInfo).role == "admin") ||
                              (userInfo &&
                                JSON.parse(userInfo).id == product.addby) ? (
                                <>
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
                                          to={`/products/${product.id}`}
                                        >
                                          <i className="fa fa-eye m-r-5" /> More
                                          Info
                                        </Link>
                                        <Link
                                          className="dropdown-item"
                                          to="javascript:void(0)"
                                          data-toggle="modal"
                                          data-target="#edit_leave"
                                          data-id={product.id}
                                          onClick={() => {
                                            seteditpage(product.id);
                                          }}
                                        >
                                          <i className="fa fa-pencil m-r-5" />{" "}
                                          Edit
                                        </Link>
                                        <Link
                                          className="dropdown-item"
                                          to="javascript:void(0)"
                                          data-toggle="modal"
                                          data-target="#delete_approve"
                                          onClick={() => {
                                            setdeletePage(product.id);
                                          }}
                                        >
                                          <i className="fa fa-trash-o m-r-5" />{" "}
                                          Delete
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td></td>
                                </>
                              )}
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
      <Add onEditComplete={handleRefetch} />
      {editpage && <Edit id={editpage} onEditComplete={handleRefetch} />}
      {deletePage && <Delete id={deletePage} onEditComplete={handleRefetch} />}
    </>
  );
}
