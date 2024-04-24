import React, { useEffect } from "react";

import axios from "../api/axios";

export default function SendNotification(
  formData,
  id,
  type,
  OldData,
  Username
) {
  let productid = id;
  function NotificationforLowStock(id) {
    // useEffect(() => {
    const fetchProduct = async () => {
      try {
        const csrfResponse = await axios.get("/get-csrf-token");
        const csrfToken = csrfResponse.data.token;

        axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
        const response = await axios.get(`/products/${id}`);
        const product = response.data.product;
        console.log("lowwwwww", product.MinimumNumberAllowedInstock);

        if (product.quantity < product.MinimumNumberAllowedInstock) {
          console.log("open");
          let messageLowStock = "low stock";
          const formDatanotification = {
            productId: product.id,
            message: messageLowStock,
          };
          handleSubmit(formDatanotification);
        }
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    fetchProduct();
    // }, [id]);
  }
  let message = "";
  // if (type == "addMove") {
  //   message = `added movent number" ${formData.name}" Product and quantity is ${formData.quantity} with Price ${formData.price}$ for unit.`;
  //   NotificationforLowStock(id);
  // }

  switch (type) {
    case "add":
      message = `has been added  " ${formData.name}" Product and quantity is ${formData.quantity} with Price ${formData.price}$ for unit.`;
      break;
    case "addMove":
      if (formData.movement_type == "deduction") {
        NotificationforLowStock(id);
        message = `has been deduction in  Product id   " ${formData.productId} quantity : ${formData.quantity} .`;
      } else {
        message = `has been addition in  Product id   " ${formData.productId} quantity : ${formData.quantity} .`;
      }
      break;

    case "edit":
      function compareObjects(OldData, formData) {
        const differences = [];

        for (let key in OldData) {
          if (OldData.hasOwnProperty(key) && formData.hasOwnProperty(key)) {
            if (OldData[key] !== formData[key]) {
              differences.push(
                `The product changed its ${key} from ${OldData[key]} to ${formData[key]}`
              );
            }
          }
        }

        return differences;
      }
      const diffs = compareObjects(OldData, formData);
      if (diffs.length > 0) {
        message = diffs.join(" and ");
      } else {
        message = false;
      }
      break;
    case "delete":
      message = ` has been deleted "${formData.name}" Product.`;
      break;

    case "editMovment":
      function compareObjectstomovment(OldData, formData) {
        const differences = [];

        for (let key in OldData) {
          if (OldData.hasOwnProperty(key) && formData.hasOwnProperty(key)) {
            if (OldData[key] !== formData[key]) {
              differences.push(
                `The product changed its ${key} from ${OldData[key]} to ${formData[key]}`
              );
            }
          }
        }

        return differences;
      }
      const diffMov = compareObjectstomovment(OldData, formData);
      if (diffMov.length > 0) {
        message = diffMov.join(" and ");
      } else {
        message = false;
      }

      break;
  }
  const formDatanotification = {
    productId: id,
    message: message,
  };

  const handleSubmit = async (formDatanotification) => {
    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
      await axios.post("/notifications", formDatanotification);
      console.log("notifications added successfully");
    } catch (error) {
      console.error("Error adding notifications:", error.message);
    }
  };

  if (message) {
    handleSubmit(formDatanotification);
  }

  return message;
}
