import React from 'react';
import Header from "./Components/3_Header";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
};

export default Layout;
