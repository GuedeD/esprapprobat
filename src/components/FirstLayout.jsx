import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./Acceuil/BackToTop";
import ScrollToTop from "./ScrollToTop";
import { useSelector } from "react-redux";
import { useState } from "react";
import Menu from "./Menu";
import { NavLink } from "react-router-dom";

import { FaWindowClose } from "react-icons/fa";

import Logo from "../assets/Images/logo-no-bg.png";

import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css"; // Import default drawer styles

const FirstLayout = () => {
  const { userInfo } = useSelector((state) => state.projet);
  const [openMenu, setOpenMenu] = useState(false);

  const openDrawer = () => {
    setOpenMenu(true);
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setOpenMenu(false);
  };

  const getDrawerWidth = () => {
    if (window.innerWidth < 768) {
      return "60%"; // Set smaller width for mobile screens
    }
    return "30%"; // Default width for larger screens
  };
  return (
    <div className="min-h-screen relative">
      <Drawer
        open={openMenu}
        onClose={closeDrawer}
        width={getDrawerWidth()} // Dynamically set the width

        // Adjust the width of the drawer
      >
        {/* <Menu /> */}

        <div>
          <div
            className="bg-orange3 text-white font-bold flex items-center justify-center
        flex-col py-6 relative     "
          >
            <img src={Logo} alt="" className="w-10" />
            <span>Approbat</span>
            <div onClick={closeDrawer}>
              <FaWindowClose className="absolute top-2 right-3 text-[26px]  " />
            </div>
          </div>
          <ul className=" flex flex-col gap-7 mt-10 text-center  ">
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
      </Drawer>
      <div>
        <Header openDrawer={openDrawer} />
      </div>
      {/* mt-[10vh] min-h-[73vh] md:mt-[5vh] md:min-h-[73vh]  lg:mt-[5vh] lg:min-h-[73vh] xl:mt-[10vh] */}
      <div
        className={` ${
          userInfo && !userInfo.emailVerified
            ? "mt-[20vh] min-h-[61vh] md:mt-[12vh] md:min-h-[70vh] lg:mt-[10vh] lg:min-h-[71vh xl:mt-[13vh] xl:min-h-[78vh] "
            : " min-h-[82vh] mt-[8vh] md:mt-[5vh] "
        }  `}
      >
        <div className="h-full">
          <Outlet />
        </div>
        <BackToTop />
      </div>
      <div className="min-h-[18vh]">
        <Footer />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default FirstLayout;
