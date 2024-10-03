import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/Images/logo-no-bg.png";
import { FaWindowClose } from "react-icons/fa";
import toast from "react-hot-toast";

const Menu = ({}) => {
  return (
    <>
      <div className="min-h-full w-[20%] absolute z-50 bg-white right-0 top-0    justify-center border text-center py-[40px] ">
        <div
          className="bg-orange3 text-white font-bold flex items-center justify-center
        flex-col py-4 relative "
        >
          <img src={Logo} alt="" className="w-10" />
          <span>Approbat</span>
          <div>
            <FaWindowClose className="absolute top-2 right-3 text-[26px]  " />
          </div>
        </div>
        <ul className=" flex flex-col gap-7 mt-10  ">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-orange underline underline-offset-4 font-medium text-nowrap"
                  : "text-bleu4 text-nowrap"
              }
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/boutique"
              className={({ isActive }) =>
                isActive
                  ? "text-orange underline underline-offset-4 font-medium text-nowrap"
                  : "text-bleu4 text-nowrap"
              }
            >
              Boutique
            </NavLink>
          </li>
          <li>
            <NavLink
              to="contact"
              className={({ isActive }) =>
                isActive
                  ? "text-orange underline underline-offset-4 font-medium text-nowrap"
                  : "text-bleu4 text-nowrap"
              }
            >
              Contactez-nous
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Menu;
