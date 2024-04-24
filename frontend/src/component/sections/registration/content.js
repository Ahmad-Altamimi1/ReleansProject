import React, { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { SendNotiToUpdateNumber, userdata } from "../../Redux/action";
import { useSelector, useDispatch } from "react-redux";
export default function Registration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);

      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      const response = await axios.post("/registration", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Registration response:", response.data);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setImage(null);

      localStorage.setItem("token", response.data.token);
      dispatch(userdata(response.data.user));

      navigate("/");
    } catch (error) {
      console.log("Registration error:", error);
    }
  };

  return (
    <>
      <div className="main-wrapper">
        <div className="account-content">
          <div className="container">
            <div className="account-logo">
              <a href="/">
                <img src="assets/img/logo2.png" alt="Company Logo" />
              </a>
            </div>
            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Registration</h3>
                <form onSubmit={handleRegistration}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      className="form-control"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      type="text"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      type="password"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      className="form-control"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      type="password"
                    />
                  </div>
                  <div className="form-group">
                    <label>Profile Picture</label>
                    <input
                      className="form-control"
                      name="image"
                      onChange={(e) => setImage(e.target.files[0])}
                      type="file"
                    />
                  </div>
                  <div className="form-group text-center">
                    <button
                      className="btn btn-primary account-btn"
                      type="submit"
                    >
                      Register
                    </button>
                  </div>
                  <div className="account-footer">
                    <p>
                      Already have an account?{" "}
                      <a
                        target="http://localhost:3000/login"
                        href="http://localhost:3000/login"
                      >
                        Login
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
