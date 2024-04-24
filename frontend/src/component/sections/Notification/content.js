import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Add from "./add";
import Edit from "./edit";
import Delete from "./delete";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useSelector, useDispatch } from "react-redux";
const fetchNotifications = async () => {
  const accessToken = localStorage.getItem("token");
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/allnotification",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.notifications;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export default function () {
  const userInfo = useSelector((state) => state.userData);
  const [editpage, seteditpage] = useState(false);
  const [deletePage, setdeletePage] = useState(false);
  const {
    data: Notifications,
    isLoading,
    error,
    refetch,
  } = useQuery("allnotifications", fetchNotifications);
  const handleRefetch = () => {
    refetch();
  };
  if (isLoading)
    return (
      <div>
        <Box sx={{ width: "100%" }} height={208} style={{ marginTop: "60px" }}>
          <Skeleton animation="wave" height={"100vh"} />
        </Box>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <>
        <div className="page-wrapper">
          {/* Page Content */}
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col">
                  <h3 className="page-title">Notifications</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="index.php">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Notifications</li>
                  </ul>
                </div>
                <div className="col-auto float-right ml-auto">
                  {JSON.parse(userInfo).role == "admin" && (
                    <Link
                      to="javascript:void(0)"
                      className="btn add-btn"
                      data-toggle="modal"
                      data-target="#add_Noti"
                    >
                      <i className="fa fa-plus" /> Add Notification
                    </Link>
                  )}
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-striped custom-table mb-0 datatable">
                    <thead>
                      <tr>
                        <th>Send By</th>
                        <th>message</th>
                        <th>Send To</th>
                        {/* <th>Quantity</th> */}
                        {JSON.parse(userInfo).role == "admin" && (
                          <th className="text-right">Actions</th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {Notifications &&
                        Notifications.map((Notification) => (
                          <>
                            <tr key={Notification.id}>
                              <td>{Notification.userName}</td>
                              <td>{Notification.notification.message}</td>
                              <td>{Notification.notification.receiver}</td>
                              {JSON.parse(userInfo).role == "admin" && (
                                <>
                                  <td className="text-right">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="javascript:void(0)"
                                        className="action-icon dropdown-toggle"
                                        data-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        {/* <Link
                                      className="dropdown-item"
                                      to={`/Notifications/${Notification.id}`}
                                    >
                                      <i className="fa fa-eye m-r-5" /> More
                                      Info
                                    </Link> */}

                                        <Link
                                          className="dropdown-item"
                                          to="javascript:void(0)"
                                          data-toggle="modal"
                                          data-target="#edit_Noti"
                                          data-id={Notification.notification.id}
                                          onClick={() => {
                                            seteditpage(
                                              Notification.notification.id
                                            );
                                          }}
                                        >
                                          <i className="fa fa-pencil m-r-5" />{" "}
                                          Edit
                                        </Link>
                                        <Link
                                          className="dropdown-item"
                                          to="javascript:void(0)"
                                          data-toggle="modal"
                                          data-target="#delete_approve"
                                          onClick={() => {
                                            setdeletePage(
                                              Notification.notification.id
                                            );
                                          }}
                                        >
                                          <i className="fa fa-trash-o m-r-5" />{" "}
                                          Delete
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          </>
                        ))}
                    </tbody>
                    {/*?php $cnt+=1;
										}
									}?*/}
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* /Page Content */}
          {/* Add Leave Modal */}
          {/* /Delete Leave Modal */}
        </div>
      </>
      <Add onEditComplete={handleRefetch} />
      {editpage && <Edit id={editpage} onEditComplete={handleRefetch} />}
      {deletePage && <Delete id={deletePage} onEditComplete={handleRefetch} />}
    </>
  );
}
