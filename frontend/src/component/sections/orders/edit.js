import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import SendNotification from "../../Functions/SendNotification";
import { SendNotiToUpdateNumber, userdata } from "../../Redux/action";
import { useSelector, useDispatch } from "react-redux";
const EditProductForm = ({ id, onEditComplete }) => {
  const dispatch = useDispatch();
  const countofNoti = useSelector((state) => state.NotiCount);

  const [formData, setFormData] = useState({
    user_id: "",
    total_price: "",
    status: "",
  });
  const [OldData, setOldData] = useState({
    user_id: "",
    total_price: "",
    status: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const csrfResponse = await axios.get("/get-csrf-token");
        const csrfToken = csrfResponse.data.token;

        axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
        const response = await axios.get(`/orders/${id}`);
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
              </div>

              <div className="form-group">
                <label>
                  Quantity <span className="text-danger">*</span>
                </label>
                <input
                  name="quantity"
                  className="form-control"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>
                  Price <span className="text-danger">*</span>
                </label>
                <input
                  name="price"
                  className="form-control"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                />
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
