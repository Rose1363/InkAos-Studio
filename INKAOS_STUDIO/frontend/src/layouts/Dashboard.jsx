import React from "react";
import UserMenu from "../components/UI/UserMenu";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto p-3 flex">
        {/* Left column for UserMenu */}
        <div className="w-[280px] py-4 sticky top-24 overflow-y-auto">
          <UserMenu />
        </div>

        {/* Right column for content */}
        <div className="flex-grow p-4">
          <Outlet></Outlet>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
