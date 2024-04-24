import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import SendNotification from "../../Functions/SendNotification";
import { useSelector, useDispatch } from "react-redux";
import { SendNotiToUpdateNumber, userdata } from "../../Redux/action";
import Swal from "sweetalert2";
const AddOrderForm = ({ onEditComplete, allProducts }) => {
  const dispatch = useDispatch();
  const countofNoti = useSelector((state) => state.NotiCount);

  const [products, setProducts] = useState([{ productId: "", quantity: 1 }]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleProductChange = (index, productId) => {
    const updatedProducts = [...products];
    updatedProducts[index].productId = productId;
    setProducts(updatedProducts);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = quantity;
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { productId: "", quantity: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  useEffect(() => {
    let totalPrice = 0;
    products.forEach((product) => {
      const selectedProduct = allProducts.find(
        (p) => p.id == product.productId
      );
      if (selectedProduct) {
        totalPrice += selectedProduct.price * product.quantity;
        totalPrice = parseFloat(totalPrice.toFixed(2));
      }
    });
    setTotalPrice(totalPrice);
  }, [products, allProducts]);

  const handleSubmit = async () => {
    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      const response = await axios.post("/orders", products);
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
        title: "Order added successfully",
      });
      setProducts([{ productId: "", quantity: 1 }]);
      onEditComplete();
      document.querySelector("#add_order").click();
    } catch (error) {
      console.error("Error adding Order:", error.message);
    }
  };
  return (
    <div id="add_order" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Order</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body rtr">
            {products.map((product, index) => (
              <div className="row" key={index}>
                <select
                  className="form-control col-6"
                  value={product.productId}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                >
                  <option value="">Select Product</option>
                  {allProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  className="form-control col-2"
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    handleQuantityChange(index, parseInt(e.target.value))
                  }
                />
                {product.productId && (
                  <span className="col-2">
                    Price: $
                    {(allProducts.find((p) => p.id == product.productId)
                      ?.price || 0) * product.quantity}
                  </span>
                )}
                <button
                  className="btn btn-danger col-2"
                  onClick={() => handleRemoveProduct(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <hr />
            <div className="submit-section">
              <button
                type="submit"
                name="add_product"
                className="btn btn-secondary submit-btn"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>
            <div className="submit-section">
              <h4>Total Price: ${totalPrice}</h4>
              <button
                className="btn btn-primary submit-btn"
                onClick={handleSubmit}
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrderForm;
