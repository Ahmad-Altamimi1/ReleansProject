import React, { useState } from "react";
import axios from "../../api/axios";
import { useDispatch } from "react-redux";

const ImageUploadForm = ({ id ,onEditComplete }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("product_id", id);

      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
      await axios.post("/images", formData);

      document.querySelector("#edit-icon").click();
      onEditComplete();

      const imagefiled = document.querySelector("#imagefiled");
      const Preview = document.querySelector("#Preview");
      imagefiled.value = "";
      Preview.src = "";
      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error.message);
    }
  };

  return (
    <div
      id="add-product-image"
      className="modal custom-modal fade"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Upload Product Image</h5>
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
                  Product Image <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="imagefiled"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>
              {previewUrl && (
                <div className="form-group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="img-fluid"
                    id="Preview"
                  />
                </div>
              )}
              <div className="submit-section">
                <button
                  type="submit"
                  name="add_product"
                  className="btn btn-primary submit-btn"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadForm;
