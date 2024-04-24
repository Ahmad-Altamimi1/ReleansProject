import React, { useEffect , useState } from "react";
import axios from "../../api/axios";
import SendNotification from "../../Functions/SendNotification";
import { useSelector, useDispatch } from "react-redux";

import {
  SendNotiToUpdateNumber,
  SendNotiToUpdateData,
} from "../../Redux/action";

const EditUserForm = ({ onEditComplete , user }) => {

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: "",
    confirmPassword: "",
    role: user.role,
    image: user.image,
  });
  const [test, setTest] = useState('test');
  useEffect(()=>{
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
      role: user.role,
      image: user.image,
    })
  },[user])
  console.log(formData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSelectOption = (option) => {
    setFormData({
      ...formData,
      role: option,
    });
  };


  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      const response = await axios.put(`/users/${user.id}`,formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      

      onEditComplete();
      console.log("User edited successfully");
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
        role: user.role,
        image: user.image,
      });
      document.querySelector("#edit_user_x").click();
    } catch (error) {
      console.error("Error adding user:", error.message);
    }
  };

  return (
    <div id="edit_user" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button
              id="edit_user_x"
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
                  Name <span className="text-danger">*</span>
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
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  name="email"
                  className="form-control"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  name="password"
                  className="form-control"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  name="confirmPassword"
                  className="form-control"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>
                  Profile Picture <span className="text-danger">*</span>
                </label>
                <input
                  name="image"
                  className="form-control"
                  type="file"
                  onChange={handleImageChange}
                />
              </div>
              <div class="w100  form-control">
              <label>
                  User Role <span className="text-danger">*</span> :
                </label>
                <div className=" dropdown action-label float-right ">
                  <a
                    className={`py-2 px-5 btn btn-white btn-sm btn-rounded dropdown-toggle ${`badge ${formData.role == 'admin' ? "bg-inverse-danger" : formData.role == 'manager' ? "bg-inverse-warning" : formData.role == 'regular' ? "bg-inverse-primary" : ""}`}`}
                    href="#"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                     {formData.role}
                  </a>
                  <div className="dropdown-menu dropdown-menu-right text-center">

                    <a className="dropdown-item badge bg-inverse-primary" href="#" onClick={() => handleSelectOption('regular')}>
                      Regular
                    </a>

                    <a className="dropdown-item badge bg-inverse-warning" href="#" onClick={() => handleSelectOption('manager')}>
                      Manager
                    </a>

                    <a className="dropdown-item badge bg-inverse-danger" href="#" onClick={() => handleSelectOption('admin')}>
                      Admin
                    </a>
                  </div>
                </div>
              </div>
              <div className="submit-section">
                <button
                  type="submit"
                  name="add_user"
                  className="btn btn-primary submit-btn"
                >
                  Submit User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
