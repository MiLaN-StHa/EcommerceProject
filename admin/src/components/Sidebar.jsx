import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-gray-300 border-r-1">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[13px] md:text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1"
          to="/add"
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1"
          to="/list"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">List Items</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1"
          to="/orders"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Orders</p>
        </NavLink>

        <NavLink
          to="/supplies"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1"
        >
          <img className="w-6 h-6" src={assets.supply} alt="" />
          <p className="hidden md:block text-[13px]">Supply Management</p>
        </NavLink>

        <NavLink
          to="/customization-management"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1"
        >
          <img className="w-6 h-6" src={assets.order_icon} alt="" />
          <p className="hidden md:block text-[13px]">Customization Requests</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
