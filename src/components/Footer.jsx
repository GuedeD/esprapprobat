import { CiFacebook } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";

import Logo from "../assets/Images/logo-no-bg.png";
import { Link } from "react-router-dom";
import ContactMe from "./ContactMe";

const Footer = () => {
  const phoneNumber = "+2250500769696";
  const message = "Bonjour Approbat !";
  return (
    <footer className="h-full text-white py-[11px]    backgroundFooter relative ">
      <div className="max-w-[95%]  md:max-w-[85%] mx-auto ">
        <div className="flex justify-between  items-center text-[14px] md:text-base ">
          <div className="flex items-center gap-10 ">
            <Link to="/" className="flex flex-col items-center">
              <img src={Logo} alt="" className="w-10 md:w-12 lg:w-14" />
              <p>Approbat</p>
            </Link>
            <div className="h-[70px] bg-white w-[2px]" />
            <p className="hidden md:block">
              Fournisseur de matériaux de construction
            </p>
          </div>
          <ul className=" flex gap-2 font-medium">
            <Link
              to={"/boutique"}
              className="hover:text-orange3 transition-all duration-500"
            >
              Boutique
            </Link>
            <Link
              to={"/contact"}
              className="hover:text-orange3 transition-all duration-500 hidden lg:block"
            >
              Contactez-Nous
            </Link>
            <Link
              to={"/profil"}
              className="hover:text-orange3 transition-all duration-500"
            >
              Mon Profil
            </Link>
          </ul>
        </div>
        {/* <hr className="my-6 max-w-[500px] mx-auto" /> */}
        <div className="flex-col flex gap-2 md:flex-row justify-between mt-5">
          <p className="text-nowrap text-[14px] md:text-base ">
            Fais Avec Amour Par <ContactMe>Guede Dema R.A.C</ContactMe> 🥷
          </p>
          <ul className="flex gap-5 pb-2 text-[30px]">
            <li>
              <Link
                to={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                  message
                )}`}
              >
                <FaWhatsapp className="hover:text-orange3 transition-all duration-500" />
              </Link>
            </li>

            <li>
              <Link
                to={"https://www.facebook.com/profile.php?id=61565884556628"}
                target="_blank"
              >
                <CiFacebook className="hover:text-orange3 transition-all duration-500" />
              </Link>
            </li>
            <li>
              <Link
                to={"https://www.linkedin.com/in/approbat-approbat-8212b2331/"}
                target="_blank"
              >
                <CiLinkedin className="hover:text-orange3 transition-all duration-500" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
