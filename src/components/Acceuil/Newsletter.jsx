// import { useState } from "react";
import { TfiEmail } from "react-icons/tfi";
// import Illustration from "../../assets/Images/illustration.jpg";
import Illustration from "../../assets/Images/acheterIllu.jpg";

import { SlBasket } from "react-icons/sl";
import { Link } from "react-router-dom";
const Newsletter = () => {
  //   const [first, setfirst] = useState("");
  return (
    <section>
      <div className="md:max-w-[85%] max-w-[95%] mx-auto flex items-center gap-[50px] lg:gap-[120px] text-bleu4 flex-col-reverse md:flex-row ">
        <div>
          <h3 className="font-semibold text-[24px]">Faites vos achats </h3>
          <p className="my-[10px]  leading-[1.7] ">
            Plus besoin de fournir des efforts pour obtenir vos matériaux et
            matériels de construction de qualité à des prix défiant toutes
            concurrences.{" "}
            <span className="font-medium">
              Visitez dès à présent notre boutique !
            </span>
          </p>
          <Link
            to={"/boutique"}
            className="flex bg-bleu4 w-fit items-center mt-5 text-white py-2 px-6 gap-4 rounded-[20px] font-medium hover:bg-orange3 duration-500 transition-all "
          >
            <span>Commencez</span>
            <SlBasket className="text-[26px]" />
          </Link>
        </div>
        <div>
          <img
            src={Illustration}
            className=" md:w-[1400px] w-[2000px]"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
