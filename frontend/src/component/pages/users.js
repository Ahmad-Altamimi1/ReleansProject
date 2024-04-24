import React, { createContext, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Header from "../layouts/Header";
import Sidebar from "../layouts/sidebar";
import Content from "../sections/users/content";

// Create the UserContext

export default function () {
  return (
    <>
      <Header />
      <Sidebar />
      <Content />
    </>
  );
}
