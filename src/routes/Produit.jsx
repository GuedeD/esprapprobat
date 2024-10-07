import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";

import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import toast from "react-hot-toast";
import { IoIosWarning } from "react-icons/io";
import { CgHeart } from "react-icons/cg";
import { ImHeart } from "react-icons/im";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
import { Helmet } from "react-helmet";

import {
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";
import Commentaires from "../components/Commentaires";
import VoirPlus from "../components/VoirPlus";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/espremium";
import DevisButton from "../components/DevisButton";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Rating } from "@smastrom/react-rating";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { recuperProduitParId } from "../utils/hooks";

const Star = (
  <path d="M62 25.154H39.082L32 3l-7.082 22.154H2l18.541 13.693L13.459 61L32 47.309L50.541 61l-7.082-22.152L62 25.154z" />
);

const customStyles = {
  itemShapes: Star,
  boxBorderWidth: 2,

  activeFillColor: ["#FEE2E2", "#FFEDD5", "#FEF9C3", "#ECFCCB", "#D1FAE5"],
  activeBoxColor: ["#da1600", "#db711a", "#dcb000", "#61bb00", "#009664"],
  activeBoxBorderColor: ["#c41400", "#d05e00", "#cca300", "#498d00", "#00724c"],

  inactiveFillColor: "white",
  inactiveBoxColor: "#dddddd",
  inactiveBoxBorderColor: "#a8a8a8",
};

const Produit = () => {
  const { cart, userInfo } = useSelector((state) => state.projet);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  // const [produit, setProduit] = useState(() => {
  //   return (
  //     location.state?.produit || JSON.parse(localStorage.getItem("produit"))
  //   );
  // });

  const produitID = location.state?.produit.id;
  // console.log(produitID);

  const [rating, setRating] = useState(0);
  const queryClient = useQueryClient(); // Get QueryClient instance

  const {
    data: produit,
    error,
    isLoading,
    refetch: refecthProduitId,
  } = useQuery({
    queryKey: ["produit", produitID],
    queryFn: () => recuperProduitParId(produitID),
    enabled: true,
    staleTime: 0, // Data is always considered stale
    cacheTime: 0, // Data cache will be garbage collected as soon as it's inactive
  });
  // console.log(produit);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["produit", produitID]); // Remove query from cache on unmount
    };
  }, [location.pathname, queryClient, produitID]);

  const [quantite, setQuantite] = useState("");
  const [prix, setPrix] = useState("");
  const [type, setType] = useState("");
  const [options, setOptions] = useState("");
  // const [categorie, setCategorie] = useState(produit?.categorie);

  useEffect(() => {
    setType("");
    if (produit) {
      setPrix(Number(produit.prixReference));
      setQuantite(Number(produit.quantiteMinimale));
      const option = produit?.types.map((type) => ({
        value: type.type,
        label: type.type,
      }));

      setOptions(option);
    }
  }, [produit, produitID]);

  function addToCartFn(item) {
    if (produit?.types.length > 0 && !type) {
      toast.error("Veuillez sélectionner un type ");
    } else if (quantite < produit?.quantiteMinimale) {
      toast.custom(
        <p className="p-2 border bg-[#363636] text-white rounded-md flex items-center gap-3">
          <span>
            <IoIosWarning className="text-yellow-500 text-[24px] " />
          </span>
          <span>Quantité minimale exigée ({produit?.quantiteMinimale}) </span>
        </p>
      );
      setQuantite(produit?.quantiteMinimale);
    } else {
      const newProduit = {
        id: item.id,
        image: item.image,
        nom: item.nom,
        prix: prix,
        quantite: quantite,
        quantiteMinimale: item.quantiteMinimale,
        categorie: item.categorie,
        type: String(type.label),
        livraisonGratuite: item.livraisonGratuite,
      };
      dispatch(addToCart(newProduit));
      toast.success(`${item.nom} ajouté au panier`);
    }
  }

  async function addOrRemoveToFav(product) {
    if (!userInfo) {
      toast.error("Veuillez vous connectez svp !");
      navigate("/connexion");
    } else if (userInfo && !userInfo.emailVerified) {
      toast.error("Veuillez vérifiez votre compte svp!");
    } else {
      const produitsRef = doc(db, "produits", product.id);
      try {
        const docSnap = await getDoc(produitsRef);
        const favoris = docSnap.data().favoris || [];
        const itemExists = favoris.some((favori) => favori === userInfo.id);
        if (itemExists) {
          await updateDoc(produitsRef, {
            favoris: arrayRemove(userInfo.id),
          });
          refecthProduitId();
          toast.error("Produit retiré des favoris ❌");
        } else {
          await updateDoc(produitsRef, {
            favoris: arrayUnion(userInfo.id),
          });
          refecthProduitId();

          toast.success("Produit ajouté aux favoris ✅");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  function checkQuantite(e) {
    setQuantite(e.target.value);
  }
  useEffect(() => {
    if (type) {
      const findEl = produit.types.find((el) => el.type === type.label);
      setPrix(Number(findEl.prix));
    }
  }, [type]);

  useEffect(() => {
    let validNotes = produit?.commentaires.filter(
      (i) => typeof i.note === "number" && !isNaN(i.note)
    );
    let avisNote = Math.round(
      validNotes?.length > 0
        ? validNotes.reduce((acc, i) => i.note + acc, 0) / validNotes.length
        : 0
    );

    setRating(avisNote);
  }, [produit?.commentaires]);

  // useEffect(() => {
  //   // Save produit in localStorage whenever it changes
  //   if (location.state?.produit) {
  //     setProduit(location.state.produit);
  //     localStorage.setItem("produit", JSON.stringify(location.state.produit));
  //   }
  // }, [location.state?.produit]);

  const productUrl = window?.location.href;

  if (error) {
    return (
      <section className="flex justify-center items-center h-full">
        <p>Une erreur s'est produite lors de la récupération des données </p>
      </section>
    );
  }

  return (
    <div>
      {isLoading ? (
        <section className="flex flex-col md:flex-row max-w-[80%] mx-auto gap-[50px] justify-center items-center min-h-[700px]">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="skeleton h-[270px] w-[270px] md:h-[400px] md:w-[400px] "
            ></div>
          ))}
        </section>
      ) : (
        produit && (
          <>
            <div className="max-w-[95%]  md:max-w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 items-center py-10  gap-[40px] md:gap-0  ">
              {/* LEFT SIDE */}

              <Helmet>
                <title>{produit?.nom || "Product Name"}</title>
                <meta
                  name="description"
                  content={produit?.description || "Product description"}
                />

                {/* Open Graph */}
                <meta property="og:url" content={productUrl} />
                <meta property="og:type" content="product" />
                <meta
                  property="og:title"
                  content={produit?.nom || "Product Name"}
                />
                <meta
                  property="og:description"
                  content={produit?.description || "Product description"}
                />
                <meta
                  property="og:image"
                  content={produit?.image || "default-image.jpg"}
                />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                  name="twitter:title"
                  content={produit?.nom || "Product Name"}
                />
                <meta
                  name="twitter:description"
                  content={produit?.description || "Product description"}
                />
                <meta
                  name="twitter:image"
                  content={produit?.image || "default-image.jpg"}
                />
              </Helmet>
              <div className=" justify-self-center flex flex-col items-center mt-5 md:mt-0 	 ">
                <Zoom>
                  <img
                    src={produit?.image}
                    className=" w-[290px] h-[290px] xl:w-[400px] xl:h-[400px]    object-cover rounded-lg "
                    alt=""
                  />
                </Zoom>
                <div className="flex items-center gap-4 mt-5 md:mt-10">
                  <p className="italic text-[14px] text-slate-500 ">
                    Partager sur :{" "}
                  </p>
                  <FacebookShareButton url={productUrl}>
                    <FacebookIcon size={38} round={true} />
                  </FacebookShareButton>

                  <LinkedinShareButton url={productUrl}>
                    <LinkedinIcon size={38} round={true} />
                  </LinkedinShareButton>

                  <TelegramShareButton url={productUrl}>
                    <TelegramIcon size={38} round={true} />
                  </TelegramShareButton>
                  <WhatsappShareButton url={productUrl}>
                    <WhatsappIcon size={38} round={true} />
                  </WhatsappShareButton>
                </div>
              </div>
              {/* RIGHT SIDE */}
              <div className="space-y-[20px] ">
                {produit?.livraisonGratuite ? (
                  <p className="uppercase font-semibold text-[12px] bg-green-600 w-fit text-white p-1 ">
                    livraison gratuite
                  </p>
                ) : (
                  ""
                )}
                <div>
                  <p className=" text-[25px] md:text-[30px] capitalize font-medium ">
                    {produit?.nom}{" "}
                  </p>
                  <p className="mb-2 ">
                    <span className="">Catégorie</span>
                    <span className="uppercase font-medium">
                      : {produit?.categorie}
                    </span>{" "}
                  </p>
                  <div className="flex items-center gap-3 ">
                    <Rating
                      readOnly
                      style={{ maxWidth: 160 }}
                      value={rating}
                      itemStyles={customStyles}
                      radius="large"
                      spaceBetween="small"
                      spaceInside="large"
                    />
                    <p className="text-[14px]">
                      ({produit?.commentaires.length} Avis vérifiés)
                    </p>
                  </div>
                </div>
                <p className="  ">{produit?.description}</p>
                {produit?.types.length > 0 && (
                  <div className="flex items-center gap-2">
                    <p className="font-medium uppercase">Type : </p>
                    <Select
                      value={type}
                      onChange={setType}
                      options={options}
                      placeholder="Selectionner le type"
                      className=" w-[250px]  select-bordered bg-slate-50 font-sans text-[16px] "
                    />
                  </div>
                )}
                <div>
                  <p className="italic text-[14px] ">
                    {produit?.types.length > 0
                      ? "*le prix s'ajustera en fonction du type choisi"
                      : "Prix du produit"}
                  </p>

                  <div className="flex items-center gap-1 mt-1">
                    <p className="font-semibold text-[20px] "> {prix} Fcfa</p>
                    <p className="text-[14px]">l&apos;unité</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium italic text-[14px] mb-2 text-orange4">
                    <span>Quantité minimale</span> :{" "}
                    <span>{produit?.quantiteMinimale}</span>{" "}
                  </p>
                  <div
                    className=" grid grid-cols-2  items-center gap-5 
          "
                  >
                    <div className="border grid grid-cols-2 h-[60px] items-center rounded-md   ">
                      <div className="h-full flex items-center ">
                        <p className="uppercase font-medium w-full text-center text-[14px] md:text-base ">
                          Quantité
                        </p>
                        <div className="w-[0.5px] h-full  bg-black  " />
                      </div>
                      <div className="h-full flex items-center ">
                        <input
                          type="number"
                          value={quantite}
                          onChange={(e) => checkQuantite(e)}
                          className="outline-none border-none bg-transparent ml-4  h-full  w-full "
                        />
                        {/* <div className="w-[0.5px] h-full  bg-black " /> */}
                      </div>
                    </div>
                    {cart.find((el) => el.id === produit.id) ? (
                      <button
                        className="text-white bg-bleu4 h-full rounded-md w-[140px] md:w-[180px]  transition-all duration-500 shadow-md"
                        onClick={() => addToCartFn(produit)}
                      >
                        {" "}
                        Déjà ajouté
                      </button>
                    ) : (
                      <button
                        className="text-white bg-orange3 h-full rounded-md w-[140px] md:w-[180px] hover:bg-bleu4 transition-all text-[14px] md:text-base duration-500 shadow-md "
                        onClick={() => addToCartFn(produit)}
                      >
                        Ajouter au panier
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center max-w-[83%] gap-7 ">
                  <DevisButton />
                  <span
                    className=" text-orange3 rounded-md flex items-center justify-center
   cursor-pointer hover:bg-orange3 hover:text-white  duration-500 transition-all  "
                  >
                    {produit?.favoris.length > 0 &&
                    produit.favoris.find((res) => res === userInfo?.id) ? (
                      <div
                        className="p-[6px] tooltip"
                        data-tip="Retirer des favoris"
                      >
                        <ImHeart
                          className="text-[32px] "
                          onClick={() => addOrRemoveToFav(produit)}
                        />
                      </div>
                    ) : (
                      <div
                        className=" p-[6px] tooltip "
                        data-tip="Ajouter aux favoris"
                      >
                        <CgHeart
                          className="text-[32px]"
                          onClick={() => addOrRemoveToFav(produit)}
                        />
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <VoirPlus produit={produit} />
            </div>
            <div>
              <Commentaires
                produit={produit}
                // allCom={allCom}
                error={error}
                refecthProduitId={refecthProduitId}
              />
            </div>
          </>
        )
      )}
    </div>
  );

  //   return (
  //     <>
  //       <div className="max-w-[95%]  md:max-w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 items-center py-10  gap-[40px] md:gap-0  ">
  //         {/* LEFT SIDE */}

  //         <Helmet>
  //           <title>{produit?.nom || "Product Name"}</title>
  //           <meta
  //             name="description"
  //             content={produit?.description || "Product description"}
  //           />

  //           {/* Open Graph */}
  //           <meta property="og:url" content={productUrl} />
  //           <meta property="og:type" content="product" />
  //           <meta property="og:title" content={produit?.nom || "Product Name"} />
  //           <meta
  //             property="og:description"
  //             content={produit?.description || "Product description"}
  //           />
  //           <meta
  //             property="og:image"
  //             content={produit?.image || "default-image.jpg"}
  //           />

  //           {/* Twitter Cards */}
  //           <meta name="twitter:card" content="summary_large_image" />
  //           <meta name="twitter:title" content={produit?.nom || "Product Name"} />
  //           <meta
  //             name="twitter:description"
  //             content={produit?.description || "Product description"}
  //           />
  //           <meta
  //             name="twitter:image"
  //             content={produit?.image || "default-image.jpg"}
  //           />
  //         </Helmet>
  //         <div className=" justify-self-center flex flex-col items-center mt-5 md:mt-0 	 ">
  //           <Zoom>
  //             <img
  //               src={produit?.image}
  //               className=" w-[290px] h-[290px] xl:w-[400px] xl:h-[400px]    object-cover rounded-lg "
  //               alt=""
  //             />
  //           </Zoom>
  //           <div className="flex items-center gap-4 mt-5 md:mt-10">
  //             <p className="italic text-[14px] text-slate-500 ">
  //               Partager sur :{" "}
  //             </p>
  //             <FacebookShareButton url={productUrl}>
  //               <FacebookIcon size={38} round={true} />
  //             </FacebookShareButton>

  //             <LinkedinShareButton url={productUrl}>
  //               <LinkedinIcon size={38} round={true} />
  //             </LinkedinShareButton>

  //             <TelegramShareButton url={productUrl}>
  //               <TelegramIcon size={38} round={true} />
  //             </TelegramShareButton>
  //             <WhatsappShareButton url={productUrl}>
  //               <WhatsappIcon size={38} round={true} />
  //             </WhatsappShareButton>
  //           </div>
  //         </div>
  //         {/* RIGHT SIDE */}
  //         <div className="space-y-[20px] ">
  //           {produit?.livraisonGratuite ? (
  //             <p className="uppercase font-semibold text-[12px] bg-green-600 w-fit text-white p-1 ">
  //               livraison gratuite
  //             </p>
  //           ) : (
  //             ""
  //           )}
  //           <div>
  //             <p className=" text-[25px] md:text-[30px] capitalize font-medium ">
  //               {produit?.nom}{" "}
  //             </p>
  //             <p className="mb-2 ">
  //               <span className="">Catégorie</span>
  //               <span className="uppercase font-medium">: {categorie}</span>{" "}
  //             </p>
  //             <div className="flex items-center gap-3 ">
  //               <Rating
  //                 readOnly
  //                 style={{ maxWidth: 160 }}
  //                 value={rating}
  //                 itemStyles={customStyles}
  //                 radius="large"
  //                 spaceBetween="small"
  //                 spaceInside="large"
  //               />
  //               <p className="text-[14px]">
  //                 ({produit?.commentaires.length} Avis vérifiés)
  //               </p>
  //             </div>
  //           </div>
  //           <p className="  ">{produit?.description}</p>
  //           {produit?.types.length > 0 && (
  //             <div className="flex items-center gap-2">
  //               <p className="font-medium uppercase">Type : </p>
  //               <Select
  //                 value={type}
  //                 onChange={setType}
  //                 options={options}
  //                 placeholder="Selectionner le type"
  //                 className=" w-[250px]  select-bordered bg-slate-50 font-sans text-[16px] "
  //               />
  //             </div>
  //           )}
  //           <div>
  //             <p className="italic text-[14px] ">
  //               {produit?.types.length > 0
  //                 ? "*le prix s'ajustera en fonction du type choisi"
  //                 : "Prix de l'produit"}
  //             </p>

  //             <div className="flex items-center gap-1 mt-1">
  //               <p className="font-semibold text-[20px] "> {prix} Fcfa</p>
  //               <p className="text-[14px]">l&apos;unité</p>
  //             </div>
  //           </div>

  //           <div>
  //             <p className="font-medium italic text-[14px] mb-2 text-orange4">
  //               <span>Quantité minimale</span> :{" "}
  //               <span>{produit?.quantiteMinimale}</span>{" "}
  //             </p>
  //             <div
  //               className=" grid grid-cols-2  items-center gap-5
  //         "
  //             >
  //               <div className="border grid grid-cols-2 h-[60px] items-center rounded-md   ">
  //                 <div className="h-full flex items-center ">
  //                   <p className="uppercase font-medium w-full text-center text-[14px] md:text-base ">
  //                     Quantité
  //                   </p>
  //                   <div className="w-[0.5px] h-full  bg-black  " />
  //                 </div>
  //                 <div className="h-full flex items-center ">
  //                   <input
  //                     type="number"
  //                     value={produit}
  //                     onChange={(e) => checkQuantite(e)}
  //                     className="outline-none border-none bg-transparent ml-4  h-full  w-full "
  //                   />
  //                   {/* <div className="w-[0.5px] h-full  bg-black " /> */}
  //                 </div>
  //               </div>
  //               {cart.find((el) => el.id === produit.id) ? (
  //                 <button
  //                   className="text-white bg-bleu4 h-full rounded-md w-[140px] md:w-[180px]  transition-all duration-500 shadow-md"
  //                   onClick={() => addToCartFn(produit)}
  //                 >
  //                   {" "}
  //                   Déjà ajouté
  //                 </button>
  //               ) : (
  //                 <button
  //                   className="text-white bg-orange3 h-full rounded-md w-[140px] md:w-[180px] hover:bg-bleu4 transition-all text-[14px] md:text-base duration-500 shadow-md "
  //                   onClick={() => addToCartFn(produit)}
  //                 >
  //                   Ajouter au panier
  //                 </button>
  //               )}
  //             </div>
  //           </div>
  //           <div className="flex items-center max-w-[83%] gap-7 ">
  //             <DevisButton />
  //             <span
  //               className=" text-orange3 rounded-md flex items-center justify-center
  //  cursor-pointer hover:bg-orange3 hover:text-white  duration-500 transition-all  "
  //             >
  //               {produit?.favoris.length > 0 &&
  //               produit.favoris.find((res) => res === userInfo?.id) ? (
  //                 <div className="p-[6px] tooltip" data-tip="Retirer des favoris">
  //                   <ImHeart
  //                     className="text-[32px] "
  //                     onClick={() => addOrRemoveToFav(produit)}
  //                   />
  //                 </div>
  //               ) : (
  //                 <div
  //                   className=" p-[6px] tooltip "
  //                   data-tip="Ajouter aux favoris"
  //                 >
  //                   <CgHeart
  //                     className="text-[32px]"
  //                     onClick={() => addOrRemoveToFav(produit)}
  //                   />
  //                 </div>
  //               )}
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //       <div>
  //         <VoirPlus produit={produit} />
  //       </div>
  //       <div>
  //         {/* <Commentaires
  //           produit={produit}
  //           allCom={allCom}
  //           error={error}
  //           refecthProduitId={refecthProduitId}
  //         /> */}
  //       </div>
  //     </>
  //   );
};

export default Produit;
