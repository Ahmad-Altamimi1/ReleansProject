import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import SendNotification from "../../Functions/SendNotification";
import { useQuery } from "react-query";

import { SendNotiToUpdateNumber, userdata } from "../../Redux/action";
import { useSelector, useDispatch } from "react-redux";

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

const EditProductForm = ({ id, onEditComplete }) => {
  const dispatch = useDispatch();
  const countofNoti = useSelector((state) => state.NotiCount);
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery("products", fetchProducts);
  const [formData, setFormData] = useState({
    message: "",
    receiver: "",
    productId: "",
  });
  const [OldData, setOldData] = useState({
    message: "",
    receiver: "",
    productId: "",
  });

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const csrfResponse = await axios.get("/get-csrf-token");
        const csrfToken = csrfResponse.data.token;

        axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
        const response = await axios.get(`/notifications/${id}`);
        console.log(response.data);
        const notification = response.data.notification;
        setOldData({
          message: notification.message,
          receiver: notification.receiver,
          // productId: notification.productId,
        });

        setFormData({
          message: notification.message,
          receiver: notification.receiver,
          // productId: notification.productId,
        });
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    fetchNotification();
  }, [id, onEditComplete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectOption = (option) => {
    setFormData({
      ...formData,
      receiver: option,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/notifications/${id}`, formData);
      document.querySelector("#edit_Noti").click();
      onEditComplete();
      console.log(" response", response.data);
      const newProductId = response.data.productId;
      SendNotification(formData, newProductId, "editnotification", OldData);

      dispatch(SendNotiToUpdateNumber(parseInt(countofNoti) + 1));

      console.log("notification updated successfully");
    } catch (error) {
      console.error("Error updating notification:", error.message);
    }
  };

  return (
    <div id="edit_Noti" className="modal custom-modal fade" receiver="dialog">
      <div className="modal-dialog modal-dialog-centered" receiver="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit notification</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Message <span className="text-danger">*</span>
                </label>
                <input
                  name="message"
                  className="form-control"
                  type="text"
                  value={formData.message}
                  onChange={handleChange}
                ></input>
              </div>
              {/* <div className="form-group">
                <label>
                  Product Name <span className="text-danger">*</span>
                </label>
                <select
                  name="productId"
                  className="form-control"
                  type="text"
                  value={formData.productId}
                  onChange={handleChange}
                >
                  <option value="">--------</option>

                  {products &&
                    products.map((product) => (
                      <>
                        <option value={product.id}>{product.name}</option>
                      </>
                    ))}
                </select>
              </div> */}
              <div class="form-group">
                <label>
                  Receivers <span className="text-danger">*</span> :
                </label>
                <div className=" dropdown action-label float-right ">
                  <a
                    className={`py-2 px-5 btn btn-white btn-sm btn-rounded dropdown-toggle ${`badge ${
                      formData.receiver == "admin"
                        ? "bg-inverse-danger"
                        : formData.receiver == "manager"
                        ? "bg-inverse-warning"
                        : formData.receiver == "regular"
                        ? "bg-inverse-primary"
                        : ""
                    }`}`}
                    href="#"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {formData.receiver}
                  </a>
                  <div className="dropdown-menu dropdown-menu-right text-center">
                    <a
                      className="dropdown-item badge bg-inverse-primary"
                      href="#"
                      onClick={() => handleSelectOption("regular")}
                    >
                      Regular
                    </a>

                    <a
                      className="dropdown-item badge bg-inverse-warning"
                      href="#"
                      onClick={() => handleSelectOption("manager")}
                    >
                      Manager
                    </a>

                    <a
                      className="dropdown-item badge bg-inverse-danger"
                      href="#"
                      onClick={() => handleSelectOption("admin")}
                    >
                      Admin
                    </a>
                  </div>
                </div>
              </div>
              {/* <div className="form-group">
                <label>
                  receiver <span className="text-danger">*</span>
                </label>
                <input
                  name="receiver"
                  className="form-control"
                  type="number"
                  value={formData.receiver}
                  onChange={handleChange}
                />
              </div> */}
              <div className="submit-section">
                <button
                  type="submit"
                  name="edit_product"
                  className="btn btn-primary submit-btn"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;
