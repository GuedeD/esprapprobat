import { Rating } from "@smastrom/react-rating";
import React, { useEffect, useState } from "react";
import { PiUserCircleCheckDuotone } from "react-icons/pi";
import "@smastrom/react-rating/style.css";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { format } from "date-fns";
import { frCA } from "date-fns/locale";
import { TbEdit } from "react-icons/tb";
import { TbEditOff } from "react-icons/tb";
import { v4 as uuidv4 } from "uuid";
import { FaDeleteLeft } from "react-icons/fa6";
import Swal from "sweetalert2";

import toast from "react-hot-toast";

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

const Commentaires = ({ produit, allCom, error, refecthProduitId }) => {
  useEffect(() => {
    let validNotes = allCom?.commentaires.filter(
      (i) => typeof i.note === "number" && !isNaN(i.note)
    );
    let avisNote = Math.round(
      validNotes?.length > 0
        ? validNotes.reduce((acc, i) => i.note + acc, 0) / validNotes.length
        : 0
    );

    setRating(avisNote);
  }, [allCom?.commentaires]);
  // console.log("---------", allCom).comm?.commentaires;
  let avisNote1 = allCom?.commentaires.filter((el) => el.note === 1).length;
  let moyenne1 = (avisNote1 / allCom?.commentaires.length) * 100;
  let avisNote2 = allCom?.commentaires.filter((el) => el.note === 2).length;
  let moyenne2 = (avisNote2 / allCom?.commentaires.length) * 100;
  let avisNote3 = allCom?.commentaires.filter((el) => el.note === 3).length;
  let moyenne3 = (avisNote3 / allCom?.commentaires.length) * 100;
  let avisNote4 = allCom?.commentaires.filter((el) => el.note === 4).length;
  let moyenne4 = (avisNote4 / allCom?.commentaires.length) * 100;
  let avisNote5 = allCom?.commentaires.filter((el) => el.note === 5).length;
  let moyenne5 = (avisNote5 / allCom?.commentaires.length) * 100;
  const [rating, setRating] = useState(0);

  const [ratingPut, setRatingPut] = useState(0);
  const [titre, setTitre] = useState("");
  const [details, setDetails] = useState("");
  const { userInfo } = useSelector((state) => state.projet);
  const [jModifier, setJModifier] = useState(false);
  const [idModif, setIdModif] = useState(0);
  const navigate = useNavigate();

  async function sendAvis(e) {
    e.preventDefault();
    if (!userInfo) {
      toast.error("Veuillez vous connectez svp !");
      navigate("/connexion");
    } else if (userInfo && !userInfo.emailVerified) {
      toast.error("Veuillez vérifiez votre compte svp!");
    } else if (!ratingPut || !titre || !details) {
      toast.error(" Tous les champs sont obligatoires ");
    } else {
      if (jModifier) {
        const produitsRef = doc(db, "produits", produit.id);

        const updatedCommentaires = allCom?.commentaires.map((commentaire) => {
          if (commentaire.id === idModif) {
            return {
              id: commentaire.id,
              nomComplet: commentaire.nomComplet,
              idClient: commentaire.idClient,
              note: ratingPut,
              titre: titre,
              details: details,
              date: new Date(),
            };
          }
          return commentaire;
        });
        await updateDoc(produitsRef, {
          commentaires: updatedCommentaires,
        });

        toast.success("Commentaire mis à jour avec succès!");
        refecthProduitId();
        setRatingPut(0);
        setTitre("");
        setDetails("");
        setIdModif(0);
        setJModifier(false);
      } else {
        const commandeRef = doc(db, "users", userInfo.id);

        const docSnap = await getDoc(commandeRef);
        const data = docSnap.data();

        if (
          data.idArticlesAchetes &&
          data.idArticlesAchetes.includes(produit.id)
        ) {
          try {
            const data = {
              id: uuidv4(),
              nomComplet: userInfo.nomComplet,
              idClient: userInfo.id,
              note: ratingPut,
              titre: titre,
              details: details,
              date: new Date(),
            };

            const produitsRef = doc(db, "produits", produit.id);
            const itemExists = allCom?.commentaires.some(
              (commentaire) => commentaire.idClient === userInfo.id
            );
            if (itemExists) {
              toast.error("Avis déjà laissé, modifiez-le!");
            } else {
              // Add new comment to the array
              await updateDoc(produitsRef, {
                commentaires: arrayUnion(data),
              });
              setRatingPut(0);
              setTitre("");
              setDetails("");
              refecthProduitId();
              toast.success("Merci pour votre avis !");
            }
          } catch (error) {
            console.error("Error submitting comment: ", error);
            toast.error("Erreur lors de la soumission de votre avis.");
          }
        } else {
          toast.error("Action non autorisée ❌");
        }
      }
    }
  }

  // MODIFIER PRODUIT
  function envoyerAModifier(commentaire) {
    setJModifier(true);
    setIdModif(commentaire.id);
    setRatingPut(commentaire.note);
    setTitre(commentaire.titre);
    setDetails(commentaire.details);

    e.preventDefault();

    const element = document.getElementById("ajoutAvis");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function supprimerAvis(id) {
    Swal.fire({
      title: "Voulez-vous supprimer votre avis?",
      text: "Action définitive",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, Je confirme!",
      cancelButtonText: "J'annule",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const produitsRef = doc(db, "produits", produit.id);
          const updatedCommentaires = allCom?.commentaires.filter(
            (commentaire) => commentaire.id !== id
          );
          await updateDoc(produitsRef, {
            commentaires: updatedCommentaires,
          });
          refecthProduitId();
          toast.success("Commentaire supprimé avec succès!");
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = allCom?.commentaires.slice(startIdx, endIdx);

  if (error) {
    return (
      <section className="flex justify-center items-center min-h-[300px]">
        <p>Error loading recent products.</p>
      </section>
    );
  }

  return (
    <div className="relative" id="ajoutAvis">
      <hr />
      <div className="max-w-[85%] mx-auto">
        <p className="font-medium  text-[24px] my-2 ">Votre avis</p>
      </div>
      <hr />
      <div className="max-w-[95%] md:max-w-[85%]  mx-auto gap-[70px] flex md:items-start mt-[20px] mb-[70px] flex-col md:flex-row items-center ">
        {/* LEFT */}
        <div>
          <div className=" flex flex-col items-center">
            <p className="font-medium">Moyenne du produit </p>
            <p className="text-[50px] font-semibold text-orange3 ">{rating} </p>
            <Rating
              readOnly
              style={{ maxWidth: 160 }}
              value={rating}
              onChange={setRating}
              itemStyles={customStyles}
              radius="large"
              spaceBetween="small"
              spaceInside="large"
            />
          </div>
          <div className="space-y-[10px] mt-4 ">
            <div className="flex items-center gap-[30px] justify-between ">
              <div className="flex items-center gap-[5px]">
                <p className="text-nowrap">5 ⭐️ </p>
                <p>({avisNote5})</p>
              </div>
              <p
                className={`bg-slate-200 w-[200px] h-[18px] relative before:absolute
               before:bg-orange3  before:h-full before:w-[${moyenne5}%]  left-0  `}
              >
                {" "}
              </p>
            </div>
            <div className="flex items-center justify-between   ">
              <div className="flex items-center gap-[5px]">
                <p>4 ⭐️ </p>
                <p>({avisNote4})</p>
              </div>
              <p
                className={`bg-slate-200 w-[200px] h-[18px] relative before:absolute
               before:bg-orange3  before:h-full before:w-[${moyenne4}%]  left-0  `}
              >
                {" "}
              </p>
            </div>
            <div className="flex items-center justify-between  ">
              <div className="flex items-center gap-[5px]">
                <p>3 ⭐️ </p>
                <p>({avisNote3})</p>
              </div>
              <p
                className={`bg-slate-200 w-[200px] h-[18px] relative before:absolute
               before:bg-orange3  before:h-full before:w-[${moyenne3}%]  left-0  `}
              >
                {" "}
              </p>
            </div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-[5px]">
                <p>2 ⭐️ </p>
                <p>({avisNote2})</p>
              </div>
              <p
                className={`bg-slate-200 w-[200px] h-[18px] relative before:absolute
               before:bg-orange3  before:h-full before:w-[${moyenne2}%]  left-0  `}
              >
                {" "}
              </p>
            </div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-[5px]">
                <p>1 ⭐️ </p>
                <p>({avisNote1})</p>
              </div>
              <p
                className={`bg-slate-200 w-[200px] h-[18px] relative before:absolute
               before:bg-orange3  before:h-full before:w-[${moyenne1}%]  left-0  `}
              >
                {" "}
              </p>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div>
          <p className="uppercase font-semibold  ">ajouter un avis </p>

          <div className="flex items-center gap-[20px] my-[20px] ">
            <p>Votre évaluation du produit</p>
            <Rating
              style={{ maxWidth: 160 }}
              value={ratingPut}
              onChange={setRatingPut}
              itemStyles={customStyles}
              radius="large"
              spaceBetween="small"
              spaceInside="large"
            />
          </div>
          <form className=" space-y-6 grid " onSubmit={sendAvis}>
            <div className="flex gap-10 ">
              <input
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                type="text"
                placeholder="Titre de l'avis"
                className="flex-1 outline-none border bg-slate-50 rounded pl-4 py-2 "
              />
            </div>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={7}
              cols={100}
              name=""
              className="flex-1 outline-none border bg-slate-50 rounded pl-4 py-2 "
              id=""
              placeholder="Dites-nous plus sur ce produit"
            ></textarea>

            <hr />
            <div className=" w-full ">
              <input
                type="submit"
                value={jModifier ? "MODIFIER" : "ENREGISTRER"}
                className="bg-orange3  w-full rounded-md px-4 py-2 text-white cursor-pointer hover:bg-bleu4 transition-all duration-500  font-medium"
              />
            </div>
          </form>
        </div>
      </div>
      <hr />
      {/* COMMENTAIRES CLIENTS VERIFIES  */}
      {allCom?.commentaires.length > 0 ? (
        <p className="max-w-[85%] mx-auto font-medium text-[24px] my-2 ">
          Avis clients vérifiés ({allCom?.commentaires.length})
        </p>
      ) : (
        <p className="max-w-[85%] mx-auto font-medium text-[24px] my-2 ">
          Aucun Avis pour le moment
        </p>
      )}
      <hr />
      <div className=" max-w-[85%] mx-auto my-[30px] relative pb-[30px] ">
        {/* <div className="border rounded-md p-4 flex flex-col gap-[20px] relative"> */}
        {produit && allCom?.commentaires.length > 0
          ? currentItems.map((commentaire, i) => (
              <div
                key={i}
                className="flex items-center gap-[10px] bg-slate-100 p-5 my-[10px] rounded-md "
              >
                <div className="flex items-center justify-between w-full gap-[20px]">
                  <PiUserCircleCheckDuotone className="text-[60px]  " />
                  <div className=" flex flex-col w-full space-y-1 ">
                    <p className=" flex flex-col md:flex-row gap-0 md:gap-2">
                      <span className="capitalize">
                        par {commentaire.nomComplet}
                      </span>
                      <span className="hidden md:block">
                        {" "}
                        {"  "}|{"     "}
                      </span>
                      <span>
                        {format(
                          new Date(
                            commentaire.date.seconds * 1000 +
                              commentaire.date.nanoseconds / 1000000
                          ),
                          "d MMMM yyyy", // Day, full month name, year
                          { locale: frCA } // French locale
                        )}
                      </span>
                    </p>
                    <Rating
                      readOnly
                      style={{ maxWidth: 120 }}
                      value={commentaire.note}
                      itemStyles={customStyles}
                      radius="large"
                      spaceBetween="small"
                      spaceInside="large"
                    />
                    <div />
                    <p className="text-[18px] font-medium capitalize ">
                      {commentaire.titre}
                    </p>
                    <p>{commentaire.details}</p>
                  </div>
                  {userInfo?.id === commentaire.idClient ? (
                    <div className="flex items-center gap-3">
                      <button
                        className="cursor-pointer tooltip	"
                        data-tip="Modifier"
                        onClick={() => envoyerAModifier(commentaire)}
                      >
                        <TbEdit className=" text-orange3 text-[30px]  " />
                      </button>
                      <button
                        data-tip="Supprimer"
                        className="cursor-pointer tooltip  "
                      >
                        <FaDeleteLeft
                          className="text-[30px]  text-orange3 "
                          onClick={() => supprimerAvis(commentaire.id)}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button disabled className="cursor-not-allowed	">
                        <TbEditOff className=" text-slate-500 text-[30px]  " />
                      </button>
                      <button disabled className="cursor-not-allowed	">
                        <FaDeleteLeft className=" text-slate-500 text-[30px]  " />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          : ""}

        {/* </div> */}
      </div>
      {allCom?.commentaires.length > 0 && (
        <div className="absolute w-full -bottom-4  ">
          <div className="w-full flex justify-center my-1   ">
            <Pagination
              style={{ fontWeight: "normal" }}
              current={currentPage} // The current page
              total={allCom?.commentaires.length} // Total number of products
              pageSize={pageSize} // Number of items per page
              onChange={onPageChange} // Handle page change
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Commentaires;
