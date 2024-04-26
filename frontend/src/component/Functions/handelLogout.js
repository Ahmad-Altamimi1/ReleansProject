import { useSelector, useDispatch } from "react-redux";
import axios from "../api/axios";
import { SendNotiToUpdateNumber, userdata } from "../Redux/action";
export default function () {
  const dispatch = useDispatch();
  const HandleLogout = async (e) => {
    try {
      const csrfResponse = await axios.get("/get-csrf-token");
      const csrfToken = csrfResponse.data.token;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      const response = await axios.post("/logout");
      window.sessionStorage.clear();
      window.localStorage.clear();
      dispatch(userdata(response.data.user));
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  };
  return HandleLogout();
}
