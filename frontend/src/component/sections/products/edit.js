import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import SendNotification from "../../Functions/SendNotification";
import { SendNotiToUpdateNumber, userdata } from "../../Redux/action";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";

const EditProductForm = ({ id, onEditComplete }) => {
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

  const validateNumberInput = (input) => {
    const numberRegex = /^\d+$/;
    return numberRegex.test(input);
  };
  function validateFloatInput(input) {
    const floatRegex = /^-?\d*(\.\d+)?$/;
    return floatRegex.test(input);
  }
  const [OldData, setOldData] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    MinimumNumberAllowedInstock: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const csrfResponse = await axios.get("/get-csrf-token");
        const csrfToken = csrfResponse.data.token;

        axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
        const response = await axios.get(`/products/${id}`);
        const product = response.data.product;
        setOldData({
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          description: product.description,
        });

        setFormData({
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          description: product.description,
          MinimumNumberAllowedInstock: product.MinimumNumberAllowedInstock,
        });
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    fetchProduct();
  }, [id, onEditComplete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
      const response = await axios.put(`/products/${id}`, formData);
      document.querySelector("#edit_leave").click();
      onEditComplete();
      const newProductId = response.data.product.id;

      const notificationResult = SendNotification(
        formData,
        newProductId,
        "edit",
        OldData
      );

      if (notificationResult) {
        dispatch(SendNotiToUpdateNumber(parseInt(countofNoti) + 1));
      }

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
        title: "Product updated successfully",
      });
      console.log("Product updated successfully");
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Error updating product:", error.message);
    }
  };

  return (
    <div id="edit_leave" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Product</h5>
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
                  readOnly
                />
                <p className="text-danger">{warningquantity}</p>
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
                  Minimum Number Allowed In stock{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  name="MinimumNumberAllowedInstock"
                  className="form-control"
                  type="text"
                  value={formData.MinimumNumberAllowedInstock}
                  onChange={handleChange}
                />
                <p className="text-danger">{warningMinimumNumberAllowed}</p>
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
