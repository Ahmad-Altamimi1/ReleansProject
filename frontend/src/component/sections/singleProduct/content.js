import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Edit from "../products/edit";
import Delete from "../products/delete";
import ImageUploadForm from "./imgAdd";
import ImageDeleteForm from "./imgDelete";
import { Link, useParams } from "react-router-dom";

export default function () {
  const accessToken = localStorage.getItem("token");

  const [deleteImage, setdeleteImage] = useState(false);

  const { id } = useParams();
  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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
    data: singleProduct,
    isLoading,
    error,
    refetch,
  } = useQuery("singleProduct", fetchProduct);
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

  console.log(singleProduct);

  const totalProfit = singleProduct.orders.reduce((accumulator, order) => {
    return (
      accumulator +
      order.order_items.reduce((orderAccumulator, item) => {
        return orderAccumulator + item.quantity * item.price_for_unit;
      }, 0)
    );
  }, 0);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">product</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">product</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card tab-box">
            <div className="row user-tabs">
              <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      data-toggle="tab"
                      href="#emp_Product"
                    >
                      {" "}
                      Product Information{" "}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      data-toggle="tab"
                      href="#bank_statutory"
                    >
                      {" "}
                      Stock History{" "}
                      {/* <small className="text-danger">
                        (Admin Only)
                      </small> */}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------- Product Information start----------------------------------------------------------- */}

          <div className="tab-content">
            <div
              className="pro-overview tab-pane fade show active"
              id="emp_Product"
            >
              <div class="row">
                <div class="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                  <div class="stats-info">
                    <h6>Total Orders</h6>
                    <h4>{singleProduct.orders.length}</h4>
                  </div>
                </div>
                <div class="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                  <div class="stats-info">
                    <h6>Total Profit</h6>
                    <h4>${totalProfit.toFixed(2)}</h4>
                  </div>
                </div>
                <div class="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                  <div class="stats-info">
                    <h6>Stock Movements</h6>
                    <h4>{singleProduct.notifications.length}</h4>
                  </div>
                </div>
                <div class="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                  <div class="stats-info">
                    <h6>Last Change In</h6>
                    <h4>{formatDate(singleProduct.product.updated_at)}</h4>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <h3 className="card-title">
                        Product Images{" "}
                        <a
                          className="edit-icon"
                          data-target="#add-product-image"
                          data-toggle="modal"
                          id="edit-icon"
                          href="#"
                        >
                          <i className="fa fa-camera" />
                        </a>
                      </h3>

                      {/* --- img map start ---- */}

                      <div class="row">
                        {singleProduct.images.length > 0 ? (
                          singleProduct.images.map((image, index) => (
                            <div
                              key={index}
                              className="col-md-3 col-sm-4 col-lg-4 col-xl-3"
                            >
                              <div className="uploaded-box">
                                <div className="uploaded-img">
                                  <img
                                    alt="a"
                                    className="img-fluid"
                                    src={image.image}
                                  />
                                </div>
                                <div className="uploaded-img-name">
                                  <Link
                                    to="#"
                                    className="btn btn-danger"
                                    data-toggle="modal"
                                    data-target="#delete_image"
                                    onClick={() => {
                                      setdeleteImage(image.id);
                                    }}
                                  >
                                    <i className="fa fa-trash" /> Delete image
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="mt-5 p-5 w-100">
                            <p className="account-title ">
                              The Product Does Not Have Images
                            </p>
                            <p className="account-subtitle text-center">
                              You can add Images to the product from the{" "}
                              <i class="fa fa-camera" aria-hidden="true"></i>{" "}
                              Button in the top-right
                            </p>
                          </div>
                        )}
                      </div>
                      {/* --- img map end ---- */}
                    </div>
                  </div>
                </div>

                <div className="col-md-4 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <h3 className="card-title">
                        Product Information{" "}
                        <a
                          className="edit-delete-icon mx-1"
                          data-target="#delete_approve"
                          data-toggle="modal"
                          href="#"
                        >
                          <i className="fa fa-trash-o" />
                        </a>
                        <a
                          className="edit-icon"
                          data-target="#edit_leave"
                          data-toggle="modal"
                          href="#"
                        >
                          <i className="fa fa-pencil" />
                        </a>
                      </h3>

                      <ul className="personal-info">
                        <li>
                          <div className="title">ID:</div>
                          <div className="text">
                            {singleProduct.product.id}
                            {singleProduct.product.id}
                          </div>
                        </li>
                        <li>
                          <div className="title">Name:</div>
                          <div className="text">
                            {singleProduct.product.name}
                          </div>
                        </li>
                        <li>
                          <div className="title">Description:</div>
                          <div className="text">
                            {singleProduct.product.description}
                          </div>
                        </li>
                      </ul>
                      <hr />

                      <ul className="personal-info">
                        <li>
                          <div className="title">Price:</div>
                          <div className="text">
                            {singleProduct.product.price}$
                          </div>
                        </li>
                        <li>
                          <div className="title">Quantity:</div>
                          <div className="text">
                            {singleProduct.product.quantity}
                          </div>
                        </li>
                        <li>
                          <div className="title">Added In: </div>
                          <div className="text">
                            {formatDate(singleProduct.product.created_at)}
                          </div>
                        </li>
                        <li>
                          <div className="title">Number Of Interested: </div>
                          <div className="text">#####</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------- Product Information end ----------------------------------------------------------- */}

            {/* --------------------------------------------------- Stock History start----------------------------------------------------------- */}

            <div className="tab-pane fade" id="bank_statutory">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title"> Basic Salary Information</h3>
                  <hr />

                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-responsive">
                        <table className="table table-striped custom-table mb-0 datatable">
                          <thead>
                            <tr>
                              <th>User Name</th>
                              <th>message</th>
                              <th className="text-crntir">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {singleProduct.notifications &&
                              singleProduct.notifications.map(
                                (notification) => (
                                  <>
                                    <tr>
                                      <td>{notification.userName}</td>
                                      <td>{notification.message}</td>
                                      <td>{notification.created_at}</td>
                                    </tr>
                                  </>
                                )
                              )}
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
        <Edit id={singleProduct.product.id} onEditComplete={handleRefetch} />
        <Delete id={singleProduct.product.id} onEditComplete={handleRefetch} />
        <ImageUploadForm
          id={singleProduct.product.id}
          onEditComplete={handleRefetch}
        />
        {deleteImage && (
          <ImageDeleteForm id={deleteImage} onEditComplete={handleRefetch} />
        )}
      </div>
    </>
  );
}
