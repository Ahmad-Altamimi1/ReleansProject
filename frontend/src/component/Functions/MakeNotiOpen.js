import React, { useEffect } from "react";
import { useQuery } from "react-query";
import axios from "../api/axios";

async function updateNotification(id) {
  try {
    const csrfResponse = await axios.get("/get-csrf-token");
    const csrfToken = csrfResponse.data.token;

    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
    await axios.put(`/notifications/${id}`, {
      open: "true",
    });
  } catch (error) {
    // Handle error, e.g., show an error message
    console.error("Error updating notification:", error.message);
  }
}

const fetchNotifications = async () => {
  try {
    const response = await axios.get("notReednotifications");
    return response.data.notReednotifications;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

const MakeNotiOpen = ({ isOpen }) => {
  const {
    data: openotifications,
    isLoading,
    isError,
  } = useQuery("notReednotifications", fetchNotifications);

  useEffect(() => {
    if (openotifications && openotifications.length > 0) {
      openotifications.forEach((notification) => {
        updateNotification(notification.id);
      });
    }
  }, [openotifications]);

  return null;
};

export default MakeNotiOpen;
