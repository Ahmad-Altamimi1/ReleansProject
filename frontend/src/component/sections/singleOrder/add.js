import React, { useEffect, useState } from "react";
import axios from "../../api/axios";


const AddOrderItemForm = ({ onEditComplete, orderData }) => {
  const [allProducts, setAllProducts] = useState(orderData.allProducts)
  const [formData, setFormData] = useState({
    orderId: orderData.order.id,
    productId: "",
    quantity: "1",
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
      const response = await axios.post("/orderItem", formData);
      onEditComplete();
      console.log("Order item added successfully");
      setFormData({
        orderId: orderData.order.id,
        productId: "",
        quantity: "1",
      });
      document.querySelector("#add_order_item_x").click();
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  return (
    <div id="add_order_item" className="modal custom-modal fade" role="dialog">
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
              <span id="add_order_item_x" aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Product Name <span className="text-danger">*</span>
                </label>
                <select
                  required
                  name="productId"
                  className="form-control"
                  onChange={handleChange}
                >
                  <option value="">Select Product</option>
                  {allProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Quantity <span className="text-danger">*</span>
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
              {formData.productId && (
                  <div className="form-group">Price: ${
                    (allProducts.find(p => p.id == formData.productId)?.price || 0) * formData.quantity
                  }</div>
                )}

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

export default AddOrderItemForm;
