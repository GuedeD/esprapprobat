import React, { useEffect, useState } from "react";
import Logo from "../assets/Images/logo-no-bg.png";
import { communesAbidjan } from "../utils/constants";
import { GiTakeMyMoney } from "react-icons/gi";
import { ImArrowRight } from "react-icons/im";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { isWithinInterval } from "date-fns";
import { db } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { connexion, resetAll } from "../redux/espremium";
import Swal from "sweetalert2";

const Checkout = () => {
  const location = useLocation();
  const commande = location.state?.commande;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState("");
  const [newTotal, setNewTotal] = useState("");

  function formatNumberWithDots(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  // ETAT DU CLIENT ADRESSE
  const { userInfo } = useSelector((state) => state.projet);

  let communeDefaut = {
    value: userInfo?.adresse.commune,
    label: userInfo?.adresse.commune,
  };

  let districtDefaut = {
    value: userInfo?.adresse.district,
    label: userInfo?.adresse.district,
  };
  const [adresse, setAdresse] = useState(userInfo?.adresse.adresse || "");

  const [district, setDistrict] = useState(
    districtDefaut.value ? districtDefaut : ""
  );
  const [commune, setCommune] = useState(
    communeDefaut.value ? communeDefaut : ""
  );

  let choixDistrict = ["District Autonome d'Abidjan"];

  const options1 = choixDistrict.map((el) => ({
    value: el,
    label: el,
  }));
  const options2 = communesAbidjan.map((el) => ({
    value: el.commune,
    label: el.commune,
  }));
  //
  const appliquerCoupon = async (e) => {
    e.preventDefault();
    if (!coupon) {
      toast.error("Champ vide");
    } else if (newTotal) {
      toast.error("Coupon déjà appliqué ❌");
    } else {
      const couponCollection = collection(db, "coupons");
      const q = query(
        couponCollection,
        where("nom", "==", coupon.trim().toUpperCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const couponData = querySnapshot.docs[0].data();
        const currentDate = new Date();
        if (
          isWithinInterval(currentDate, {
            start: new Date(couponData.dateDebut.toDate()),
            end: new Date(couponData.dateFin.toDate()),
          })
        ) {
          toast.success("Coupon appliqué");

          // console.log(commande?.total, couponApplied);
          let calcul =
            Number(commande?.total) -
            Number((commande?.total * couponData.reduction) / 100);
          setNewTotal(calcul);
          setCouponApplied(couponData.reduction);
          setCoupon("");
        } else {
          toast.error("Coupon invalide");
        }
      } else {
        toast.error("Ce coupon n'existe pas");
      }
    }
  };

  async function validerCommande(e) {
    e.preventDefault();
    if (userInfo.role === "administrateur") {
      const data = {
        articlesAchetes: commande.cart,
        createdAt: serverTimestamp(),
        montantTotal: commande.total,
      };
      const collecionFacturesRef = collection(db, "factures");
      try {
        await addDoc(collecionFacturesRef, data);
        toast.success("Facture Prête ");
        dispatch(resetAll());

        navigate("/admin/proforma");
      } catch (error) {
        toast.error(error.message);
      }
    } else if (!adresse || !district || !commune) {
      toast.error(" Tous les champs sont obligatoires !");
    } else {
      let adresseClient = {
        district: district.label,
        commune: commune.label,
        adresse: adresse,
      };

      let infosClient = {
        nomComplet: userInfo.nomComplet,
        numero: userInfo.numero,
        adresseClient,
      };

      const data = {
        idClient: userInfo.id,
        articlesAchetes: commande.cart,
        infosClient,
        createdAt: serverTimestamp(),
        status: "en cours",
        montantTotal: newTotal ? newTotal : commande.total,
        couponApplique: couponApplied ? true : false,
      };

      const idArticlesAchetesNew = commande.cart.map((el) => el.id);

      const userRef = doc(db, "users", userInfo.id);
      try {
        const docSnap = await getDoc(userRef);
        const idArticlesAchetes = docSnap.data().idArticlesAchetes || [];
        const mergedArray = [
          ...new Set([...idArticlesAchetesNew, ...idArticlesAchetes]),
        ];
        await updateDoc(userRef, {
          idArticlesAchetes: mergedArray,
          adresse: adresseClient,
        });
        dispatch(
          connexion({
            ...userInfo,
            adresse: adresseClient,
            idArticlesAchetes: mergedArray,
          })
        );

        const commandesRef = collection(db, "commandes");
        await addDoc(commandesRef, data);

        Swal.fire({
          title: "Commande Validée",
          text: "Merci pour votre achat ! 🙏🏿",
          icon: "success",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const templateParams = {
              user_email: userInfo.email,
            };

            const templateId = "template_79sgrjw";
            const serviceID = "service_pukiqwq";
            const publicKEY = "68pXeZCvBI2EfIOS_";
            emailjs.send(serviceID, templateId, templateParams, publicKEY).then(
              () => {
                console.log("Nouvelle commande");
              },
              (error) => {
                console.log("FAILED...", error);
              }
            );
            navigate("/profil/commandes");
          }
        });

        dispatch(resetAll());
      } catch (error) {
        toast.error(error.message);
      }
    }
  }
  useEffect(() => {
    if (!location.state) {
      navigate("/cart");
    }
  }, [location]);

  // fixed top-0 left-0 bottom-0 ml-[50%]
  return (
    <div className="  flex lg:flex-row overflow-x-hidden flex-col-reverse  ">
      {/* LEFT */}
      <div className="lg:h-screen h-full overflow-x-hidden flex items-center w-[100%] lg:w-[50%]   flex-col text-bleu4 ">
        <div className="flex flex-col items-center py-5">
          <img src={Logo} className="w-[120px] " alt="" />
          <p className="font-semibold  text-[30px] ">Approbat</p>
          <p className="text-center text-[14px] mx-[40px] ">
            Leader numéro de la vente en ligne de tout matériaux et matériels de
            construction de qualité à des prix défiant toutes concurrences.
          </p>
        </div>
        <form className="p-5 space-y-6 grid w-full" onSubmit={validerCommande}>
          <div className="flex flex-col xl:flex-row gap-5  ">
            <input
              readOnly
              type="text"
              value={userInfo.nomComplet}
              placeholder="Entrez votre nom complet"
              className="capitalize basis-[65%] cursor-not-allowed outline-none border bg-slate-50 rounded pl-4 py-2 "
            />
            <input
              readOnly
              type="tel"
              value={userInfo.numero}
              placeholder="Entrez numéro"
              className="basis-[35%] outline-none cursor-not-allowed border bg-slate-50 rounded pl-4 py-2  "
            />
          </div>

          <div className="flex gap-5 flex-col xl:flex-row ">
            <Select
              value={district}
              onChange={setDistrict}
              options={options1}
              placeholder="Précisez votre district"
              className="min-w-[300px] text-nowrap  select-bordered bg-slate-50 font-sans text-[16px] "
            />
            <Select
              value={commune}
              onChange={setCommune}
              options={options2}
              placeholder="Précisez votre commune"
              className="min-w-[300px] text-nowrap  select-bordered bg-slate-50 font-sans text-[16px] "
            />
          </div>
          <div>
            <input
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              type="text"
              className="w-full outline-none border bg-slate-50 rounded pl-4 py-2 "
              placeholder="Precisez l'adresse exacte de livraison"
            />
          </div>
          <div>
            <p className="font-medium">*Options de paiement</p>
            <p className="italic text-[14px] ">
              Livraison dans un délai de 48h après validation de votre commande
            </p>
            <p></p>
            <div className="flex items-center gap-3 mt-3">
              {/* <div className="bg-orange3 w-[20px]  h-[20px] rounded-full " /> */}
              <ImArrowRight className="text-orange3 text-[25px] " />
              <div className=" rounded-md border-orange3 flex items-center gap-2 w-fit">
                <GiTakeMyMoney className="text-[30px] " />
                <p>Paiement cash à la livraison</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="   ">
            <input
              type="submit"
              value={
                userInfo.role === "administrateur"
                  ? "Valider facture Proforma"
                  : "valider votre commande"
              }
              className="bg-orange3 w-full rounded-md px-4 py-2 text-white cursor-pointer hover:bg-bleu4 uppercase transition-all duration-500 mt-1 font-medium"
            />
          </div>
          <Link
            to="/cart"
            className="flex items-center gap-2 my-5 underline text-orange3 "
          >
            <IoIosArrowBack className="text-[20px]" />{" "}
            <span> Retournez sur le site</span>
          </Link>
        </form>
      </div>
      {/* RIGHT */}
      <div className="bg-bleu4 overflow-x-hidden h-full  lg:min-h-screen opacity-90 w-[100%] lg:w-[50%] text-[14px] text-white flex flex-col justify-between">
        {/* {JSON.stringify(commande)} */}
        <div className="p-5">
          {commande?.cart.map((el) => (
            <div
              className="flex justify-between border-[0.5px] items-center gap-20  my-2 rounded-md shadow-md p-2 "
              key={el.id}
            >
              <div className="flex items-center justify-between   gap-5">
                <img
                  src={el.image}
                  className="w-[60px] h-[60px] object-cover rounded-md"
                  alt=""
                />
                <div>
                  <p>{el.nom}</p>
                  {el.type !== "undefined" ? (
                    <span className="font-semibold ">{el.type} </span>
                  ) : (
                    ""
                  )}
                  <p>Quantité: {el.quantite}</p>
                </div>
              </div>
              <p className="">
                {formatNumberWithDots(el.prix * el.quantite)} Fcfa{" "}
              </p>
            </div>
          ))}
        </div>

        <div className="p-5">
          <p className="text-center py-3 italic font-medium">
            Des frais de livraison peuvent être ajoutés par{" "}
            <span className="text-orange3">appel téléphonique</span>
          </p>
          <div>
            {commande?.cart.some((el) =>
              el.nom.toLowerCase().includes("gravier")
            ) && (
              <table className="border w-full mb-4">
                <caption className="border bg-orange3 text-white font-semibold">
                  Gravier
                </caption>
                <thead className="w-full">
                  <tr>
                    <th className="border">LOCALITES</th>
                    <th className="border ">QUANTITES (tonne)</th>
                    <th className="border ">Prix(avec transport en cfa)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="border" rowSpan={2}>
                      ABOBO-SONGON-YOPOUGON-COCODY
                    </th>
                    <td className="border ">20</td>
                    <td className="border ">210 000</td>
                  </tr>
                  <tr>
                    <td className="border ">30</td>
                    <td className="border ">285 000</td>
                  </tr>
                  <tr>
                    <th className="border" rowSpan={2}>
                      TREICHVILLE-MARCORY-KOUMASSI
                    </th>
                    <td className="border ">20</td>
                    <td className="border ">215 000</td>
                  </tr>
                  <tr>
                    <td className="border ">30</td>
                    <td className="border ">290 000</td>
                  </tr>
                  <tr>
                    <th rowSpan={2}>BASSAM-ANANI-BINGERVILLE</th>
                    <td className="border ">20</td>
                    <td className="border ">220 000</td>
                  </tr>
                  <tr>
                    <td className="border ">30</td>
                    <td className="border ">295 000</td>
                  </tr>
                  <tr>
                    <th className="border ">ASSINIE</th>
                    <td className="border ">20</td>
                    <td className="border ">220 000</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          <div className="flex flex-col mb-10 ">
            <p className="font-medium  mb-1">promotions</p>
            <form
              className="  flex items-center gap-5 "
              onSubmit={appliquerCoupon}
            >
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Entrez votre coupon"
                className="outline-none border text-black ] w-full border-gray-300 rounded-md py-2  pl-2"
              />
              <p className="">
                <input
                  type="submit"
                  className="text-white rounded-md bg-orange3  py-2 px-10 font-medium uppercase  cursor-pointer  "
                  value={"Appliquer"}
                />
              </p>
            </form>
          </div>
          <div className="my-4 text-right">
            {couponApplied && (
              <p className=" font-medium italic text-green-600 text-[14px] ">
                {couponApplied} % de réduction appliquée
              </p>
            )}
            <p
              className={` font-semibold ${
                couponApplied ? "line-through text-[18px]	" : "hidden"
              }  `}
            >
              {formatNumberWithDots(commande?.total)} Fcfa
            </p>
          </div>
          <div className="bg-white text-bleu4 flex items-center justify-between p-3 rounded">
            <p className="text-[20px] font-medium ">Total : </p>

            {couponApplied ? (
              <p className="font-semibold text-center text-[24px]">
                {formatNumberWithDots(newTotal)} Fcfa
              </p>
            ) : (
              <p className="text-[24px] font-semibold ">
                {" "}
                {formatNumberWithDots(commande?.total)} Fcfa
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
