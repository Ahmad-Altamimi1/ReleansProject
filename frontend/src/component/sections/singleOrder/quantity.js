import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const QuantityOrderItemForm = ({ onEditComplete, item }) => {
  console.log(item);
  const [formData, setFormData] = useState({
    quantity: item.quantity,
  });
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
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
      console.log(formData);
      const response = await axios.put(`/orderItem/${item.id}`, formData);
      onEditComplete();
      console.log("Order item added successfully");
      setFormData({
        quantity: item.quantity,
      });
      document.querySelector("#Update_order_item_x").click();
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  return (
    <div id="Update_order_item" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            {/* <h5 className="modal-title">Update Quantity</h5> */}
            <h5 className="modal-title">{item.product.name}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span id="Update_order_item_x" aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                Update Quantit <span className="text-danger">*</span>
                </label>
                <input
                min={1}
                  required
                  name="quantity"
                  className="form-control"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              {item.id && (
                  <div className="form-group">Price: $
                  {
                    item.price_for_unit* formData.quantity
                  }</div>
                )}

              <div className="submit-section">
                <button
                  type="submit"
                  name="add_product"
                  className="btn btn-primary submit-btn"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};

export default QuantityOrderItemForm;
