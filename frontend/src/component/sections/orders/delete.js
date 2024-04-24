import { Link } from "react-router-dom";
import axios from "../../api/axios";
import SendNotification from "../../Functions/SendNotification";
import { SendNotiToUpdateNumber, userdata } from "../../Redux/action";
export default function ({ id, onEditComplete }) {
  const deleteProduct = async () => {
    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
      const response = await axios.delete(`/products/${id}`);
      console.log("response", response);
      const newProductId = response.data.product.id;
      const formData = response.data.product;
      SendNotification(formData, newProductId, "delete");
      onEditComplete();
      document.querySelector("#delete_approve").click();

      return response.data;
    } catch (error) {
      throw new Error("Network response was not ok");
    }
  };

  return (
    <>
      <div
        className={`modal custom-modal fade show`}
        id="delete_approve"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Product</h3>
                <p>Are you sure want to delete this Product?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <Link
                      className="btn btn-primary continue-btn"
                      onClick={() => {
                        deleteProduct();
                      }}
                    >
                      Delete
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="javascript:void(0);"
                      data-dismiss="modal"
                      className="btn btn-primary cancel-btn"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
