import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/Images/logo-no-bg.png";
import { PiUserCircleLight } from "react-icons/pi";
import { SlBasket } from "react-icons/sl";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

import { PiUserCircleCheckDuotone } from "react-icons/pi";
import { FaUserSlash } from "react-icons/fa";

import { LiaBoxOpenSolid } from "react-icons/lia";
import { LuHeart } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { sendEmailVerification, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth, db } from "../config/firebase";
import { connexion, deconnexion, resetAll } from "../redux/espremium";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { BsMenuButtonWideFill } from "react-icons/bs";

const Header = ({ openDrawer }) => {
  const dispatch = useDispatch();
  const [hideConnect, setHideConnect] = useState(false);
  const { cart, userInfo } = useSelector((state) => state.projet);
  const divRef = useRef(null); // Ref to the div you want to hide
  const [nom, setNom] = useState("");
  const navigate = useNavigate();
  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setHideConnect(false); // Hide the div
    }
  };
  console.log(userInfo);
  function handleSubmit(e) {
    e.preventDefault();
    if (!nom) return;
    navigate(`/search?q=${nom}`);
  }
  async function sendEmailAgain() {
    try {
      const user = auth.currentUser;
      console.log(user);
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        toast.success("Nouveau lien renvoyé !");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

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
    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      if (user && user.emailVerified) {
        const docRef = doc(db, "users", user.uid);
        const dataSnap = await getDoc(docRef);
        const userData = dataSnap.data();
        dispatch(
          connexion({
            id: user.uid,
            nomComplet: user.displayName,
            email: userData.email,
            adresse: userData.adresse,
            idArticlesAchetes: userData.idArticlesAchetes,
            numero: userData.numero,
            role: userData.role,
            emailVerified: user.emailVerified,
          })
        );

        if (userData.emailVerified === false) {
          await updateDoc(docRef, { emailVerified: user.emailVerified });
        }
      }
    });
  }, []);

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-30 ">
      <div>
        {userInfo && !userInfo.emailVerified && (
          <p className="text-center bg-red-500 text-white py-2 flex flex-col ">
            <span className="font-medium">
              {" "}
              Vérifiez votre email, consultez vos mails.
            </span>
            <span
              className="text-[14px] underline cursor-pointer "
              onClick={() => sendEmailAgain()}
            >
              Renvoyez un nouveau lien de vérification si l'ancien a expiré !
            </span>
          </p>
        )}
      </div>

      <div className="max-w-[95%] h-full   md:max-w-[85%]  py-2 mx-auto flex justify-between items-center">
        <Link to={"/"} className="flex  gap-2 items-center ">
          <img src={Logo} alt="" className=" w-10 md:w-12 lg:w-14" />
          <p className="font-serif3 text-[20px] font-bold text-orange    ">
            <span className="">Approbat</span>
          </p>
        </Link>

        <div className=" gap-5 items-center flex-1 mx-[20px]  md:mx-[50px]  lg:mx-[80px] hidden md:flex ">
          <ul className=" gap-7  hidden xl:flex ">
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
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2  md:gap-4 w-full
            "
          >
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border outline-none  p-[2px] pl-2 md:p-2 rounded placeholder:text-[12px] md:placeholder:text-[14px] lg:placeholder:text-[16px] lg:min-w-[300px]   "
              placeholder="rechercher un produit"
            />
            <button className="text-white bg-orange3 p-[2px]  md:p-2 rounded font-bold ">
              <IoSearch className="text-[25px] font-bold  " />
            </button>
          </form>
        </div>

        <div className="flex gap-5 " ref={divRef}>
          <div
            className=" relative flex items-center gap-1  transition-all duration-500  "
            onClick={() => setHideConnect(!hideConnect)}
          >
            {userInfo && userInfo.emailVerified ? (
              <PiUserCircleCheckDuotone className="text-[30px]" />
            ) : (
              <FaUserSlash className="text-[26px]" />
            )}
            <span className="font-medium text-nowrap capitalize hidden lg:block  ">
              {userInfo && userInfo.emailVerified
                ? `Bonjour ${userInfo?.nomComplet?.split(" ")[1]} `
                : userInfo && !userInfo.emailVerified
                ? "Verifiez votre email"
                : "Se Connecter"}
            </span>
            {hideConnect ? (
              <IoIosArrowUp className="text-[18px] cursor-pointer" />
            ) : (
              <IoIosArrowDown className="text-[18px] cursor-pointer" />
            )}
            {hideConnect && (
              <div className="absolute top-8 right-0 bg-white border rounded-md  ">
                <div className="px-5">
                  {userInfo && !userInfo.emailVerified && (
                    <button
                      onClick={() => signOutUser()}
                      className="bg-orange3  text-white text-nowrap rounded-md py-2 px-6 shadow-lg my-4 hover:bg-bleu4 duration-500 transition-all "
                    >
                      SE DECONNECTER
                    </button>
                  )}
                  {!userInfo && (
                    <button
                      onClick={() => navigate("/connexion")}
                      className="bg-orange3  text-white text-nowrap rounded-md py-2 px-6 shadow-lg my-4 hover:bg-bleu4 duration-500 transition-all "
                    >
                      SE CONNECTER
                    </button>
                  )}
                </div>

                {userInfo && userInfo.emailVerified && (
                  <ul className=" flex flex-col gap-3 pt-2  ">
                    <li className="hover:bg-slate-600 px-2 py-2 hover:text-white transition-all duration-300 hover:pl-4 hover:rounded text-nowrap ">
                      <Link
                        to={"/profil"}
                        className="flex gap-2 items-center font-medium tracking-[0.5px]"
                      >
                        <PiUserCircleLight className="text-[26px]" />
                        <span className="text-[14px]">Votre compte</span>
                      </Link>
                    </li>
                    <li className="hover:bg-slate-600 px-2 py-2 hover:text-white transition-all duration-300 hover:pl-4 hover:rounded text-nowrap">
                      <Link
                        to={"/profil/commandes"}
                        className="flex gap-2 items-center font-medium tracking-[0.5px]"
                      >
                        <LiaBoxOpenSolid className="text-[26px]" />
                        <span className="text-[14px]">Vos commandes</span>
                      </Link>
                    </li>
                    <li className="hover:bg-slate-600 px-2 py-2 hover:text-white transition-all duration-300 hover:pl-2 hover:rounded text-nowrap tracking-[0.5px]">
                      <Link
                        to={"/profil/envies"}
                        className="flex gap-2 items-center font-medium"
                      >
                        <LuHeart className="text-[26px]" />
                        <span className="text-[14px]">
                          Votre liste d&apos;envies
                        </span>
                      </Link>
                    </li>
                    {userInfo.role === "administrateur" && (
                      <li className="hover:bg-slate-600 px-2 py-2 hover:text-white transition-all duration-300 hover:pl-4 hover:rounded text-nowrap tracking-[0.5px]">
                        <Link
                          to={"admin"}
                          className="flex gap-2 items-center font-medium"
                        >
                          <LuLayoutDashboard className="text-[26px]" />
                          <span className="text-[14px]">Tableau de bord</span>
                        </Link>
                      </li>
                    )}
                    <li className="bg-orange3 cursor-pointer text-center text-white py-2 rounded-b-md hover:bg-bleu4 duration-500 transition-all ">
                      <button
                        onClick={() => signOutUser()}
                        className=" font-medium"
                      >
                        DECONNECTION
                      </button>
                    </li>
                    {/* /////////////////////////////DASHBOARD /////////////////////////// */}
                  </ul>
                )}
              </div>
            )}
          </div>
          <Link className="relative" to={"/cart"}>
            <SlBasket className="text-[26px]" />
            <span className="text-[10px] absolute -top-1 -right-2 bg-orange text-white rounded-full py-[2px] px-[6px] ">
              {cart.length}
            </span>
          </Link>
          <div
            className="xl:hidden text-[28px] cursor-pointer"
            onClick={() => openDrawer()}
          >
            <BsMenuButtonWideFill />
          </div>
        </div>
      </div>

      {/* SPECIAL */}
      <div className=" max-w-[95%] mx-auto mb-2 md:hidden ">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2  md:gap-4 w-full
            "
        >
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="border outline-none w-full p-[2px] pl-2 md:p-2 rounded-full placeholder:text-[14px]  "
            placeholder="rechercher un produit"
          />
          <button className="text-white bg-orange3 p-[2px]  md:p-2 rounded font-bold ">
            <IoSearch className="text-[25px] font-bold  " />
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Header;
