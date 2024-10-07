import { Link, NavLink, Outlet } from "react-router-dom";
import Logo from "../assets/Images/logo-no-bg.png";
import { useState } from "react";
import { IoHome } from "react-icons/io5";
import { TbDoorExit } from "react-icons/tb";
import { TbDoorEnter } from "react-icons/tb";
import { RiProductHuntFill } from "react-icons/ri";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { PiUsersFourFill } from "react-icons/pi";
import { RiBillFill } from "react-icons/ri";
import { MdDashboardCustomize } from "react-icons/md";

import { BsFillBoxSeamFill } from "react-icons/bs";
import { RiCoupon3Fill } from "react-icons/ri";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const { userInfo } = useSelector((state) => state.projet);

  const [hideDashboard, setHideDashboard] = useState(false);
  const adminRoutes = [
    { path: "/admin", icon: <IoHome />, label: "Tableau de bord" },
    {
      path: "/admin/produits",
      icon: <RiProductHuntFill />,
      label: "Produits",
    },
    {
      path: "/admin/ajouter",
      icon: <BiSolidMessageSquareAdd />,
      label: "Ajouter produit",
    },
    {
      path: "/admin/commandes",
      icon: <BsFillBoxSeamFill />,
      label: "Commandes",
    },

    {
      path: "/admin/coupons",
      icon: <RiCoupon3Fill />,
      label: "Coupons",
    },
    {
      path: "/admin/utilisateurs",
      icon: <PiUsersFourFill />,
      label: "Utilisateurs",
    },
    {
      path: "/admin/proforma",
      icon: <RiBillFill />,
      label: "Proforma",
    },
    {
      path: "/admin/personnaliser",
      icon: <MdDashboardCustomize />,
      label: "Personnaliser",
    },
  ];
  return (
    <div className="">
      <nav className=" flex items-center fixed top-0 left-0 right-0 z-50 justify-between p-3 px-5 bg-bleu4 text-white">
        <Link to={"/"} className="flex  gap-2 items-center  ">
          <img
            src={Logo}
            alt=""
            className="w-[40px]   sm:w-[50px] lg:w-[60px]  "
          />
          <span className="font-serif3 text-[20px] font-bold text-orange transition-all duration-500">
            {/* Etoiles Services Prémium */}
            Approbat
          </span>
        </Link>
        <p className="capitalize">
          Bon retour {userInfo.nomComplet.split(" ")[1]} 👋🏾
        </p>
      </nav>
      <div className="max-w-[95%] mt-[12vh] md:mt-[12vh]  lg:mt-[15vh] xl:mt-[15vh]  mx-auto my-10 flex min-h-[60vh] sm:min-h-[60vh]  md:min-h-[70vh]  md2:min-h-[70vh] lg:min-h-[70vh] xl:min-h-[70vh] transition-all duration-500">
        {/* LEFT */}
        <div
          className={`border bg-bleu4 flex  fixed  min-h-[60vh] md:min-h-[70vh] px-2 md:px-5      text-white p-3 rounded ${
            hideDashboard
              ? "w-[60px] sm:w-[75px] md:w-[90px] md2:w-[100px] lg:w-[100px] xl:w-[100px]     "
              : "w-[60px] sm:w-[60px] md:w-[240px] md2:w-[240px] lg:w-[240px] xl:w-[250px]    "
          }`}
        >
          <div className="space-y-4 h-full w-full ">
            {adminRoutes.map((adminRoute, index) => (
              <NavLink
                key={index}
                to={adminRoute.path}
                onClick={(e) => console.log(e)}
                end
                className={({ isActive }) =>
                  isActive
                    ? " flex  items-center bg-white w-full mx-auto text-bleu4 p-1 sm:p-2  rounded  "
                    : " flex w-full items-center text-[14px] md:w-fit mx-auto  "
                }
                style={{
                  gap: hideDashboard ? "0px" : "12px",
                  marginLeft: hideDashboard ? "auto" : "0px",
                }}
              >
                <p
                  className={`text-[24px] md:text-[28px] ${
                    hideDashboard ? "mx-auto" : "mx-0"
                  }      `}
                >
                  {adminRoute.icon}
                </p>
                <div className="transition-all duration-500 ">
                  <span
                    className={
                      hideDashboard
                        ? "  hidden "
                        : "hidden md:block text-nowrap w-full  "
                    }
                  >
                    {adminRoute.label}
                  </span>
                </div>
              </NavLink>
            ))}

            <div
              className={`pt-20 text-right flex justify-end absolute bottom-10 ${
                hideDashboard ? " right-3" : "right-5"
              }    `}
            >
              {hideDashboard ? (
                <TbDoorExit
                  className=" hidden md:block text-[35px] text-right mx-auto cursor-pointer "
                  onClick={() => setHideDashboard(!hideDashboard)}
                />
              ) : (
                <TbDoorEnter
                  className="hidden md:block text-[35px]  text-right  cursor-pointer "
                  onClick={() => setHideDashboard(!hideDashboard)}
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div
          className={`border rounded  ${
            hideDashboard
              ? "w-[75vw] ml-[18vw] sm:w-[85vw] sm:ml-[12vw] md:w-[80vw] md:ml-[14vw] md2:w-[82vw] md2:ml-[14vw] lg:w-[84vw]  lg:ml-[12vw] xl:w-[85vw]  xl:ml-[8vw] "
              : "w-[75vw] ml-[18vw] sm:w-[85vw] sm:ml-[12vw] md:w-[60vw]  md:ml-[33vw] md2:w-[64vw] md2:ml-[30vw] lg:w-[74vw]  lg:ml-[24vw] xl:w-[75vw]  xl:ml-[21vw]     "
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
