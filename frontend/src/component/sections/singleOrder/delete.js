import { Link } from "react-router-dom";
import axios from "../../api/axios";

export default function ({ id, onEditComplete }) {

  const deleteImage = async () => {
    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;
      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
      const response = await axios.delete(`/orderItem/${id}`);
      console.log("response", response);
      onEditComplete();
      document.querySelector("#delete_order_item_x").click();
      return response.data;
    } catch (error) {
      throw new Error("Network response was not ok");
    }
  };

  return (
    <>
      <div
        className={`modal custom-modal fade show`}
        id="delete_order_item"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Order Item</h3>
                <p>Are you sure want to delete this Order Item?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <Link
                      className="btn btn-danger delete-btn"
                      onClick={() => {
                        deleteImage();
                      }}
                    >
                      Delete
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      id="delete_order_item_x"
                      to="javascript:void(0);"
                      data-dismiss="modal"
                      className="btn btn-secondary cancel-btn"
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
