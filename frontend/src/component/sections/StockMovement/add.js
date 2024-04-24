import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import SendNotification from "../../Functions/SendNotification";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";

import { SendNotiToUpdateNumber, userdata } from "../../Redux/action";

const fetchSingleProduct = async (id) => {
  const accessToken = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.product;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

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
const AddMovementForm = ({ onEditComplete }) => {
  const [warning, setwarning] = useState("");

  const dispatch = useDispatch();
  const countofNoti = useSelector((state) => state.NotiCount);
  const {
    data: products,
    isLoading,
    error,
  } = useQuery("products", fetchProducts);

  const [formData, setFormData] = useState({
    movement_type: "",
    quantity: 0,
    productId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
    if (formData.movement_type == "deduction" && formData.productId) {
      const Singleproduct = fetchSingleProduct(formData.productId);

      if (
        Singleproduct.quantity - formData.quantity <
        Singleproduct.MinimumNumberAllowedInstock
      ) {
        setwarning(
          `The max quantity to deduction is ${
            Singleproduct.quantity - formData.quantity
          }  `
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      const response = await axios.post("/movements", formData);
      dispatch(SendNotiToUpdateNumber(parseInt(countofNoti) + 1));

      const Username = response.data.Movement.productId;
      const newMovementType = response.data.Movement.type;
      SendNotification(formData, Username, "addMove", formData, Username);
      console.log("Movement added successfully");
      setFormData({
        movement_type: "",
        quantity: "",
        productId: "",
      });
      document.querySelector("#add_Movment").click();
      // onEditComplete();
    } catch (error) {
      console.error("Error adding Movement:", error.message);
    }
  };
  if (isLoading) return <div className="loader"></div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div id="add_Movment" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Movement</h5>
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
                  Movement Name <span className="text-danger">*</span>
                </label>
                <select
                  name="movement_type"
                  className="form-control "
                  id="movettype"
                  type="text"
                  value={formData.movement_type}
                  onChange={handleChange}
                >
                  <option value="">--------</option>
                  <option value="deduction">Deduction</option>
                  <option value="addition">Addition</option>
                </select>
              </div>
              <div className="form-group">
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

                  {products.map((product) => (
                    <>
                      <option value={product.id}>{product.name}</option>
                    </>
                  ))}
                </select>
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
                <div>{warning}</div>
              </div>

              <div className="submit-section">
                <button
                  type="submit"
                  name="add_Movement"
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

export default AddMovementForm;
