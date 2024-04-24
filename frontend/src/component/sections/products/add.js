import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import SendNotification from "../../Functions/SendNotification";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import { SendNotiToUpdateNumber, userdata } from "../../Redux/action";

const AddProductForm = ({ onEditComplete }) => {
  const dispatch = useDispatch();
  const countofNoti = useSelector((state) => state.NotiCount);

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    MinimumNumberAllowedInstock: "",
  });
  const [warningquantity, setWarningquantity] = useState("");
  const [warningPrice, setWarningPrice] = useState("");
  const [warningName, setWarningName] = useState("");
  const [warningDescription, setWarningDescription] = useState("");
  const [warningMinimumNumberAllowed, setWarningMinimumNumberAllowed] =
    useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateNumberInput = (input) => {
    const numberRegex = /^\d+$/;
    return numberRegex.test(input);
  };
  function validateFloatInput(input) {
    const floatRegex = /^-?\d*(\.\d+)?$/;
    return floatRegex.test(input);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarningMinimumNumberAllowed("");
    setWarningPrice("");
    setWarningquantity("");
    setWarningName("");
    setWarningDescription("");

    if (formData.name.trim() === "") {
      setWarningName("⚠️ Please enter a name.");
      return;
    }
    if (formData.quantity.trim() === "") {
      setWarningName("⚠️ Please enter a Quantity.");
    }
    if (formData.price.trim() === "") {
      setWarningName("⚠️ Please enter a Rrice.");
    }
    if (formData.MinimumNumberAllowedInstock.trim() === "") {
      setWarningName("⚠️ Please enter a MinimumNumber Allowed In stock.");
    }
    if (!validateNumberInput(formData.quantity)) {
      setWarningquantity("⚠️ Quantity must be a number.");
      return;
    }
    if (!validateFloatInput(formData.price)) {
      setWarningPrice("⚠️ Price must be a number.");
      return;
    }
    if (!validateNumberInput(formData.MinimumNumberAllowedInstock)) {
      setWarningMinimumNumberAllowed(
        "⚠️ Minimum number allowed in stock must be a number."
      );
      return;
    }
    if (formData.description.trim() === "") {
      setWarningDescription("⚠️ Please enter a description.");
      return;
    }
    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      const response = await axios.post("/products", formData);
      dispatch(SendNotiToUpdateNumber(parseInt(countofNoti) + 1));

      const newProductId = response.data.product.id;
      SendNotification(formData, newProductId, "add");
      onEditComplete();
      console.log("Product added successfully");

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Product added successfully",
      });
      setFormData({
        name: "",
        quantity: "",
        price: "",
        description: "",
        MinimumNumberAllowedInstock: "",
      });
      document.querySelector("#add_leave").click();
    } catch (error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Error adding product",
      });
      console.error("Error adding product:", error.message);
    }
  };

  return (
    <div id="add_leave" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Product</h5>
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
                  Product Name <span className="text-danger">*</span>
                </label>
                <input
                  name="name"
                  className="form-control"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
                <p className="text-danger">{warningName}</p>
              </div>

              <div className="form-group">
                <label>
                  Quantity <span className="text-danger">*</span>
                </label>
                <input
                  name="quantity"
                  className="form-control"
                  type="text"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                {warningquantity && (
                  <p className="text-danger">{warningquantity}</p>
                )}
              </div>
              <div className="form-group">
                <label>
                  Price <span className="text-danger">*</span>
                </label>
                <input
                  name="price"
                  className="form-control"
                  type="text"
                  value={formData.price}
                  onChange={handleChange}
                />
                {warningPrice && <p className="text-danger">{warningPrice}</p>}
              </div>
              <div className="form-group">
                <label>
                  Minimum number allowed in stock{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  name="MinimumNumberAllowedInstock"
                  className="form-control"
                  type="text"
                  value={formData.MinimumNumberAllowedInstock}
                  onChange={handleChange}
                />
                {warningMinimumNumberAllowed && (
                  <p className="text-danger">{warningMinimumNumberAllowed}</p>
                )}
              </div>
              <div className="form-group">
                <label>
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                />
                <p className="text-danger">{warningDescription}</p>
              </div>
              <div className="submit-section">
                <button
                  type="submit"
                  name="add_product"
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

export default AddProductForm;
