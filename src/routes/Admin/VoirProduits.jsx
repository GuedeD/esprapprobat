import { useEffect, useState } from "react";
import { recupererProduit, recupererProduitsAdmin } from "../../utils/hooks";
// import { useQuery } from "@tanstack/react-query";
import Lottie from "lottie-react";
import { GrPowerReset } from "react-icons/gr";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import Swal from "sweetalert2";
import { IoSearch } from "react-icons/io5";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import toast from "react-hot-toast";

import Aloading from "../../assets/Images/animation/ALoading.json";
import ZeroPurchase from "../../assets/Images/animation/EmptyOrder.json";

import { ImEye } from "react-icons/im";
import { ImEyeBlocked } from "react-icons/im";

import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
const VoirProduits = () => {
  const navigate = useNavigate();

  function handleClick(id) {
    Swal.fire({
      title: "Voulez-vous supprimer ce produit?",
      text: "Pas de chemin arrière après!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je le supprime!",
      cancelButtonText: "J'annule",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const docRef = doc(db, "produits", id);
        try {
          await deleteDoc(docRef);
          refreshProductsAdmin();
          toast.success("Produit supprimé avec succès 😊");
        } catch (error) {
          toast.error(error.code);
        }
      }
    });
  }

  function handleVisibility(id) {
    Swal.fire({
      title: "Ce produit n'est plus en stock ?",
      text: "Après confirmation, il ne sera plus visible sur le site",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, Je confirme!",
      cancelButtonText: "J'annule",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const docRef = doc(db, "produits", id);
        try {
          await updateDoc(docRef, { enStock: false });
          refreshProductsAdmin();
          toast.error("Le produit n'est plus en stock");
        } catch (error) {
          toast.error(error.code);
        }
      }
    });
  }

  function handleVisibility2(id) {
    Swal.fire({
      title: "Ce produit est-il de nouveau en  en stock ?",
      text: "Après confirmation, il sera visible sur le site",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, Je confirme!",
      cancelButtonText: "J'annule",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const docRef = doc(db, "produits", id);
        try {
          await updateDoc(docRef, { enStock: true });
          refreshProductsAdmin();
          toast.success("Le produit est à nouveau en stock");
        } catch (error) {
          toast.error(error.code);
        }
      }
    });
  }

  const allerVersModification = (produit) => {
    navigate(`/admin/modifier/${produit.id}`, { state: { produit: produit } });
  };

  const [nom, setNom] = useState("");
  const [productsAdmin, setProductsAdmin] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const {
    data: productsAdminAll,
    error,
    isLoading,
    refetch: refreshProductsAdmin,
  } = useQuery({
    queryKey: ["allProductsAdmin"],
    queryFn: recupererProduitsAdmin,
    enabled: true, // Always fetch the full list
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: productsAdminSearch,
    error: errorSearch,
    refetch: refetchProductsAdminSearch,
  } = useQuery({
    queryKey: ["productsAdminSearch", nom],
    queryFn: () => recupererProduit(nom),
    enabled: false, // Disabled by default, will be triggered manually
    staleTime: 5 * 60 * 1000,
  });

  const handleSearch = () => {
    if (nom) {
      setSearchTriggered(true);
      refetchProductsAdminSearch();
    }
  };

  useEffect(() => {
    if (searchTriggered && productsAdminSearch) {
      setProductsAdmin(productsAdminSearch);
    } else if (!nom && productsAdminAll) {
      setProductsAdmin(productsAdminAll);
    }
  }, [productsAdminAll, productsAdminSearch, searchTriggered, nom]);
  console.log(productsAdmin);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = productsAdmin?.slice(startIdx, endIdx);

  if (error) {
    return (
      <section className="flex justify-center items-center h-full">
        <p>Une erreur s'est produite lors de la récupération des données </p>
      </section>
    );
  }

  return (
    <div className=" relative h-full ">
      <h3 className="text-bleu4 font-semibold text-[20px] md:text-[26px] p-3">
        Voir tous les produits
      </h3>
      <hr />
      <div className="">
        <div className="flex gap-2 md:gap-4 p-3 items-center">
          <form
            className="flex items-center gap-2 
        "
          >
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border outline-none p-2 h-[35px] md:h-full rounded max-w-[150px] md:min-w-[300px] placeholder:text-[14px] "
              placeholder="rechercher un produit"
            />
            <button
              className="text-white bg-orange3 p-2 rounded  "
              onClick={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <IoSearch className=" text-[18px] md:text-[25px] font-bold " />
            </button>
          </form>
          <div
            className="flex items-center gap-1 md:gap-3 "
            onClick={() => {
              refreshProductsAdmin();
              setNom("");
              setSearchTriggered(false);
            }}
          >
            <button
              className="text-white bg-bleu4 p-2 rounded font-bold text-[18px] md:text-[25px] tooltip"
              data-tip="Réinitialiser les recherches "
            >
              <GrPowerReset />
            </button>
          </div>
        </div>
        <hr />

        {isLoading ? (
          <div className="flex items-center mt-[100px] h-full w-full justify-center">
            <Lottie
              animationData={Aloading}
              loop={true}
              className="w-[200px]"
            />
          </div>
        ) : (
          <div
            className={` ${
              currentItems.length > 0 && "grid"
            } grid-cols-2  h-full w-full md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-2 mb-[80px] `}
          >
            {currentItems.length > 0 ? (
              currentItems.map((produit, i) => (
                <div
                  key={i}
                  className="border rounded-md pt-3 flex flex-col items-center shadow"
                >
                  <img
                    src={produit.image}
                    className="object-cover h-[70px] w-[80px]  md:h-[80px] md:w-[100px] lg:w-[120px] lg:h-[100px] rounded-lg"
                    alt=""
                  />
                  <div className="mt-3 mb-2">
                    <p className="font-medium text-slate-400 text-[12px] md:text-[14px] capitalize text-center ">
                      {produit.nom}
                    </p>
                    <p className="font-medium text-center text-bleu4 text-[12px] md:text-[16px] ">
                      {produit.prixReference} Fcfa{" "}
                    </p>
                  </div>
                  <div className="flex mb-3 gap-1 lg:gap-2 ">
                    <button
                      data-tip="Modifier"
                      onClick={() => allerVersModification(produit)}
                      className="tooltip rounded border  text-[17px] md:text-[20px] lg:text-[22px] p-1 md:p-2 text-bleu4  hover:bg-bleu4 hover:text-white duration-700 transition-all"
                    >
                      <MdOutlineModeEdit />{" "}
                    </button>
                    <button
                      data-tip={`${
                        produit.enStock ? "Disponible" : "Indisponible"
                      }`}
                      className=" tooltip items-center border text-green-500 rounded hover:border-green-500 hover:bg-green-500 hover:text-white duration-700 transition-all text-[17px] md:text-[20px] lg:text-[22px] p-1 md:p-2"
                      onClick={() =>
                        produit.enStock
                          ? handleVisibility(produit.id)
                          : handleVisibility2(produit.id)
                      }
                    >
                      {produit.enStock ? <ImEye /> : <ImEyeBlocked />}
                    </button>
                    <button
                      data-tip="Supprimer"
                      className="tooltip items-center border text-red-500 rounded hover:border-red-500 hover:bg-red-500 hover:text-white duration-700 transition-all text-[17px] md:text-[20px] lg:text-[22px] p-1 md:p-2"
                      onClick={() => handleClick(produit.id)}
                    >
                      <MdDeleteSweep />
                    </button>
                  </div>
                  <div className="absolute w-full bottom-2 left-0">
                    <hr className=" my-3 " />
                    <div className="w-full flex justify-center my-1   ">
                      <Pagination
                        style={{ fontWeight: "normal" }}
                        current={currentPage} // The current page
                        total={productsAdmin?.length} // Total number of products
                        pageSize={pageSize} // Number of items per page
                        onChange={onPageChange} // Handle page change
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col w-full justify-center  items-center mt-5">
                <p className="uppercase font-medium text-[16px] md:text-[20px]  font-sans2 ">
                  Aucun produit !
                </p>

                <Lottie
                  animationData={ZeroPurchase}
                  loop={true}
                  className="w-[300px]  md:w-[500px]"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoirProduits;
