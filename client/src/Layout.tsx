//Here Layout component serves as a layout template that includes a common header (presumably used across multiple pages) and a main content area.

import React from 'react';
import Header from "./Components/3_Header";
import { Outlet } from "react-router-dom"; //In React Router, the <Outlet> component is used as a placeholder where child routes will be rendered.
const Layout: React.FC = () => {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
};

export default Layout;
