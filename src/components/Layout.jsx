import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LuUserCircle } from "react-icons/lu";
import { LiaBoxOpenSolid } from "react-icons/lia";
import { LuHeart } from "react-icons/lu";
import { auth } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { deconnexion, resetAll } from "../redux/espremium";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { BiLogOutCircle } from "react-icons/bi";
import { MdPhonelinkSetup } from "react-icons/md";
import { FaMapLocation } from "react-icons/fa6";
import { useEffect } from "react";

const Layout = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.projet);
  const navigate = useNavigate();
  async function signOutUser() {
    await signOut(auth)
      .then(() => {
        toast.error("Vous espérons vous revoir vite 🥲");
        dispatch(deconnexion());
        dispatch(resetAll());
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/connexion");
    }
  }, [userInfo]);

  return (
    <div className="max-w-[95%] md:max-w-[85%]  mx-auto py-[30px] ">
      <div className="flex min-h-[55vh]  relative mt-9 md:mt-4  ">
        {/* LEFT */}
        <div className=" w-[15%] md:w-[25%] bg-white rounded-md border  grid fixed min-h-[55vh]   ">
          <ul className="flex flex-col 	">
            <li>
              <NavLink
                to={"/profil"}
                end
                className={({ isActive }) =>
                  isActive
                    ? "bg-bleu4 md:justify-start justify-center text-white w-full text-[15px] transition-all duration-500   rounded-t-md px-2 py-3 flex items-center gap-5"
                    : " md:justify-start justify-center  flex items-center gap-5 px-2 py-3 hover:bg-orange3 hover:rounded-t-md  hover:text-white duration-300 transition-all text-[14px]"
                }
              >
                {" "}
                <LuUserCircle className="text-[25px] will-change-auto   " />
                <span className="hidden md:flex">Votre Compte</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/profil/commandes"}
                className={({ isActive }) =>
                  isActive
                    ? "bg-bleu4 md:justify-start justify-center text-white w-full text-[15px] transition-all duration-500    px-2 py-3 flex items-center gap-5"
                    : " md:justify-start justify-center flex items-center gap-5 px-2 py-3 hover:bg-orange3 hover:text-white duration-300 transition-all text-[14px]"
                }
              >
                {" "}
                <LiaBoxOpenSolid className="text-[25px]  " />
                <span className="hidden md:flex">Vos Commandes</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/profil/envies"}
                className={({ isActive }) =>
                  isActive
                    ? "bg-bleu4 text-white w-full text-[15px] transition-all duration-500    px-2 py-3 flex items-center gap-5  md:justify-start justify-center"
                    : "md:justify-start justify-center flex items-center gap-5 px-2 py-3 hover:bg-orange3 hover:text-white duration-300 transition-all text-[14px]"
                }
              >
                {" "}
                <LuHeart className="text-[25px] " />
                <span className="hidden md:flex">
                  Votre liste d&apos;envies
                </span>
              </NavLink>
            </li>

            <hr className="my-4" />
          </ul>

          <ul className="flex flex-col gap-1  -mt-4 ">
            <li>
              <NavLink
                to={"/profil/adresse"}
                className={({ isActive }) =>
                  isActive
                    ? "bg-bleu4 md:justify-start justify-center text-white w-full text-[15px] transition-all duration-500    px-2 py-3 flex items-center gap-5"
                    : "md:justify-start justify-center flex items-center gap-5 px-2 py-3 hover:bg-orange3 hover:text-white duration-300 transition-all text-[14px]"
                }
              >
                <FaMapLocation className="text-[25px] " />

                <span className="hidden md:flex">
                  Votre adresse de livraison
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/profil/modifierNumero"}
                className={({ isActive }) =>
                  isActive
                    ? "bg-bleu4 md:justify-start justify-center text-white w-full text-[15px] transition-all duration-500    px-2 py-3 flex items-center gap-5"
                    : "md:justify-start justify-center flex items-center gap-5 px-2 py-3 hover:bg-orange3 hover:text-white duration-300 transition-all text-[14px]"
                }
              >
                <MdPhonelinkSetup className="text-[25px] " />
                <span className="hidden md:flex">Modifier votre numéro</span>
              </NavLink>
            </li>
            <hr className="my-4" />
          </ul>
          <button
            className="text-orange3	 justify-center gap-2 items-center	 w-full  uppercase hover:text-white hover:bg-orange3 duration-500 cursor-pointer transition-all p-2 hover:rounded-b-md flex"
            onClick={() => signOutUser()}
          >
            <span className="hidden md:flex"> Déconnexion</span>

            <BiLogOutCircle className="text-[25px]" />
          </button>
        </div>
        {/* RIGHT */}

        <div className="w-[83%] md:w-[70%] ml-[22%] md:ml-[34%] rounded-md border  ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
