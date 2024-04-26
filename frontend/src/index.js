import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { store } from "./component/Redux/store";
import "./index.css";
import Home from "./component/pages/index";
import Product from "./component/pages/products";
import Notification from "./component/pages/Notification";
import SingleProduct from "./component/pages/singleProduct";
import Login from "./component/pages/login";
import Registration from "./component/pages/registration";
import StockMovements from "./component/pages/stockMovements";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import Orders from "./component/pages/orders";
import SingleOrder from "./component/pages/singleOrder";
import SingleUser from "./component/pages/singleUser";
import Users from "./component/pages/users";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();
const accessToken = localStorage.getItem("token") !== null;
const NavigateWhenOpenLogin = () => {
  if (accessToken) {
    window.history.back();
    return null;
  } else {
    return <Login />;
  }
};
root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={accessToken ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/users"
            element={accessToken ? <Users /> : <Navigate to="/login" />}
          />
          <Route
            path={"/users/:id"}
            element={accessToken ? <SingleUser /> : <Navigate to="/login" />}
          />
          <Route
            path="/products"
            element={accessToken ? <Product /> : <Navigate to="/login" />}
          />
          <Route
            path="/AllNotification"
            element={accessToken ? <Notification /> : <Navigate to="/login" />}
          />

          <Route path="/login" element={<NavigateWhenOpenLogin />} />

          <Route
            path="/registration"
            element={accessToken ? <Registration /> : <Navigate to="/login" />}
          />
          <Route
            path={"/products/:id"}
            element={accessToken ? <SingleProduct /> : <Navigate to="/login" />}
          />
          <Route
            path="/stockMovements"
            element={
              accessToken ? <StockMovements /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/orders"
            element={accessToken ? <Orders /> : <Orders />}
          />
          <Route
            path="/orders/:id"
            element={accessToken ? <SingleOrder /> : <SingleOrder />}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);

reportWebVitals();
