import { useEffect } from "react";
import axios from "../axios/axios";
import { loginSuccess } from "./action";
import { useDispatch } from "react-redux";
function YourComponent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/user");
        console.log("response", response.data.user);

        dispatch(loginSuccess(response.data.user));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
}

export default YourComponent;
