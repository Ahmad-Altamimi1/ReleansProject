import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { LowStockNotification } from "../../Functions/LowStockNotification";
import { useSelector, useDispatch } from "react-redux";
import { SendNotiToUpdateNumber, userdata } from "../../Redux/action";

const UpdateOrderStatusForm = ({ onEditComplete, order }) => {
  const [formData, setFormData] = useState([order.status]);
  const dispatch = useDispatch();
  const countofNoti = useSelector((state) => state.NotiCount);
  useEffect(() => {
    setFormData([order.status]);
  }, [order]);

  const handleSelectOption = (option) => {
    setFormData([option]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
      console.log(formData);
      const response = await axios.put(`/orders/${order.id}`, formData);
      const quntofNoti = response.data.lowQuantityProducts.length;
      dispatch(SendNotiToUpdateNumber(parseInt(countofNoti) + quntofNoti));
      LowStockNotification(
        response.data.productId,
        "Order item added successfully"
      );
      onEditComplete();
      console.log("Order item added successfully");
      setFormData([order.status]);
      document.querySelector("#status_order_x").click();
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  return (
    <div
      className="modal custom-modal fade"
      id="update_status_order"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Change Order Status</h5>
            <button
              id="status_order_x"
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <h6></h6>

              <div class="w100 text-center">
                <div className="dropdown action-label">
                  <a
                    className="btn btn-white btn-sm btn-rounded dropdown-toggle"
                    href="#"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i
                      className={`fa fa-dot-circle-o ${
                        formData[0] === "pending"
                          ? "text-secondary"
                          : formData[0] === "in progress"
                          ? "text-info"
                          : formData[0] === "fulfilled"
                          ? "text-success"
                          : formData[0] === "rejected"
                          ? "text-danger"
                          : ""
                      }`}
                    ></i>{" "}
                    {formData[0]}
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelectOption("pending")}
                    >
                      <i className="fa fa-dot-circle-o text-secondary"></i>{" "}
                      Pending
                    </a>

                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelectOption("in progress")}
                    >
                      <i className="fa fa-dot-circle-o text-info"></i> In
                      Progress
                    </a>

                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelectOption("fulfilled")}
                    >
                      <i className="fa fa-dot-circle-o text-success"></i>{" "}
                      Fulfilled
                    </a>

                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelectOption("rejected")}
                    >
                      <i className="fa fa-dot-circle-o text-danger"></i>{" "}
                      Rejected
                    </a>
                  </div>
                </div>
              </div>
              <div className="submit-section">
                <button className="btn btn-primary submit-btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatusForm;
