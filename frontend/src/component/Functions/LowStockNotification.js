import axios from "../api/axios";

export const LowStockNotification = (id) => {
  const fetchProduct = async () => {
    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
      const response = await axios.get(`/products/${id}`);
      const product = response.data.product;

      if (product.quantity < product.MinimumNumberAllowedInstock) {
        let messageLowStock = "low stock";
        const formDatanotification = {
          productId: product.id,
          message: messageLowStock,
        };
        // handleSubmit(formDatanotification);
      }
    } catch (error) {
      console.error("Error fetching product:", error.message);
    }
  };

  fetchProduct();
};
