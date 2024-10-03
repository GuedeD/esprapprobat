// import ImgContact from "../assets/Images/cartPage.jpg";
import ImgCadi from "../assets/Images/cadi.jpg";

import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { removeToCart, resetAll, updateQuantity } from "../redux/espremium";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Empty from "../assets/Images/animation/NOFOUND1.json";
import { IoIosArrowBack, IoIosWarning } from "react-icons/io";
import { useEffect, useState } from "react";

const Cart = () => {
  const { cart, userInfo } = useSelector((state) => state.projet);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // console.log(cart);

  function formatNumberWithDots(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const [total, setTotal] = useState(0);
  // console.log(cart);
  useEffect(() => {
    let prix = cart.reduce((acc, i) => acc + i.prix * i.quantite, 0);
    setTotal(prix);
  }, [cart]);
  const changeQuantité = (e, produit) => {
    const updatedQuantite = e.target.value;
    dispatch(updateQuantity({ updatedQuantite, produit }));
  };

  function goToCheckout() {
    if (!userInfo) {
      toast.error("Veuillez vous connecter !");
      navigate("/connexion");
    } else if (userInfo && !userInfo.emailVerified) {
      toast.error("Vérifiez votre email ! ");
      navigate("/");
    } else if (
      cart.find((el) => Number(el.quantite) < Number(el.quantiteMinimale))
    ) {
      toast.custom(
        <p className="p-2 border bg-[#363636] text-white rounded-md flex items-center gap-3">
          <span>
            <IoIosWarning className="text-yellow-500 text-[24px] " />
          </span>
          <span>Quantité(s) minimale(s) non respectée(s) !</span>
        </p>
      );

      const element = cart.filter(
        (el) => Number(el.quantite) < Number(el.quantiteMinimale)
      );

      element.forEach((el) => {
        const updatedQuantite = el.quantiteMinimale;

        dispatch(updateQuantity({ updatedQuantite, produit: el }));
      });
    } else {
      navigate("/checkout", {
        state: { commande: { cart, total } },
      });
    }
  }

  return (
    <div className="">
      <div className="relative before:inset-0 before:absolute before:bg-black before:opacity-65 ">
        <img src={ImgCadi} className="object-cover h-[250px] w-full " alt="" />
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[30px] uppercase font-semibold ">
          Panier{" "}
        </p>
      </div>
      {cart.length > 0 ? (
        <div className="flex flex-col xl:flex-row items-end  mx-auto max-w-[95%] md:max-w-[85%] xl:items-start gap-5 lg:gap-7 py-[30px] ">
          {/* LEFT SIDE */}
          <div className="border rounded-md w-full xl:basis-[65%] ">
            <div className="p-4 flex justify-between items-center ">
              <h3 className="font-semibold uppercase ">Résumé des courses</h3>
              <p
                className="flex items-center gap-2 bg-red-400 text-white p-1  rounded-md
         px-2 cursor-pointer   "
                onClick={() => {
                  dispatch(
                    resetAll(),
                    toast.success("Panier vidé avec succès")
                  );
                }}
              >
                <span>Vider le Panier</span>
                <MdDelete className="text-[20px] " />
              </p>
            </div>

            <hr />
            <div>
              {cart.map((el) => (
                <div
                  key={el.id}
                  className="flex md:items-center flex-col md:flex-row items-start  justify-between   gap-[5px] md:gap-[30px] w-full    p-2 text-[14px]  "
                >
                  <div className="flex items-center justify-between flex-1 w-full ">
                    <img
                      src={el.image}
                      className="w-[80px] h-[80px]  md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] rounded object-cover border "
                      alt=""
                    />
                    <p className="flex flex-col gap-1   ">
                      <span className="capitalize font-medium text-bleu4  ">
                        {el.nom}
                      </span>
                      <span className="uppercase text-nowrap text-[14px]">
                        {el.categorie}{" "}
                      </span>
                      {el.type !== "undefined" ? (
                        <span className="font-semibold text-[13px] md:base ">
                          {el.type}{" "}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                    <div className="flex flex-col gap-2 ">
                      <p className="flex items-center gap-2">
                        <span className="text-nowrap">Qté : </span>
                        <input
                          type="number"
                          value={el.quantite}
                          onChange={(e) => changeQuantité(e, el)}
                          className="outline-none border border-gray-300 rounded-md w-[70px] md:w-[100px] py-2 mt-1 pl-2"
                        />
                      </p>
                      <p className="justify-self-end flex gap-2 items-center ">
                        <span className="italic text-nowrap  ">P.U : </span>
                        <span className="font-medium text-sm md:text-base  text-nowrap ">
                          {formatNumberWithDots(el.prix)} Fcfa{" "}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5 justify-end  w-full md:w-auto ">
                    <p className=" flex items-center gap-3 ">
                      <span className=" italic text-nowrap">S.T : </span>
                      <span className=" font-medium text-base md:text-[20px] text-nowrap">
                        {formatNumberWithDots(el.prix * el.quantite)} Fcfa{" "}
                      </span>{" "}
                    </p>
                    <p className="justify-self-end">
                      <RiDeleteBack2Fill
                        onClick={() => {
                          dispatch(removeToCart(el.id)),
                            toast.error("Article retiré");
                        }}
                        className="text-[30px] text-red-500 cursor-pointer "
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="border rounded-md  p-4 min-w-[300px] md:min-w-[350px] flex-[35%]   ">
            <div className="flex items-center justify-between font-medium text-[20px]"></div>
            <div className="mb-3">
              <p className="font-medium  text-[18px]">Expédition</p>
              <p className="text-[14px] max-w-[300px] text-slate-500 italic leading-[1.2] mt-1  ">
                Des frais de livraison peuvent être appliquées après la
                validation de votre commande en fonction de l&apos;article et de
                l&apos;adresse de livraison
              </p>
            </div>

            <div className="mt-5">
              <div className=" flex items-center justify-between ">
                <p className={`font-medium  text-[18px] `}>Total : </p>

                <p className={` font-semibold text-[24px]`}>
                  {formatNumberWithDots(total)} Fcfa
                </p>
              </div>
            </div>
            <button
              className="bg-orange3 w-full mt-5 mb-2 text-white font-semibold py-2 rounded"
              onClick={() => goToCheckout()}
            >
              Valider la commande
            </button>
          </div>
        </div>
      ) : (
        <div className="  h-full">
          <div className=" flex items-center justify-center flex-col">
            <p className="mt-4 font-semibold text-[20px] md:text-[22px] lg:text-[26px] text-bleu4">
              Panier vide, aucun article ajouté
            </p>
            <Lottie
              animationData={Empty}
              loop={true}
              className=" w-[250px] md:w-[300px] lg:w-[400px]"
            />
            <Link
              to="/boutique"
              className="flex items-center gap-2 my-5 bg-orange3 text-white p-2 rounded"
            >
              <IoIosArrowBack className="text-[20px]" />{" "}
              <span> Retournez faire vos achats</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
