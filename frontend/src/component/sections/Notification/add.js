import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import SendNotification from "../../Functions/SendNotification";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";

import { SendNotiToUpdateNumber, userdata } from "../../Redux/action";

const AddNotificationForm = ({ onEditComplete }) => {
  const [warning, setwarning] = useState("");

  const dispatch = useDispatch();
  const countofNoti = useSelector((state) => state.NotiCount);

  const [formData, setFormData] = useState({
    message: "",
    receiver: "regular",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
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
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      const response = await axios.post("/notifications", formData);
      dispatch(SendNotiToUpdateNumber(parseInt(countofNoti) + 1));
      console.log(response.data);
      const Username = response.data.id;
      SendNotification(formData, Username, "addMove", formData, Username);
      console.log("Notification added successfully");
      setFormData({
        message: "",
        receiver: "",
      });
      document.querySelector("#add_Noti").click();
    } catch (error) {
      console.error("Error adding Notification:", error.message);
    }
  };

  return (
    <div id="add_Noti" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Notification</h5>
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
                  message <span className="text-danger">*</span>
                </label>
                <textarea
                  name="message"
                  className="form-control"
                  value={formData.message}
                  onChange={handleChange}
                />
                <div>{warning}</div>
              </div>
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
              <div className="submit-section">
                <button
                  type="submit"
                  name="add_Notification"
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

export default AddNotificationForm;
