import { useQuery } from "@tanstack/react-query";
import { MdDeleteForever } from "react-icons/md";
import {
  recupererProduitsAdmin,
  recupererProduitsFav,
} from "../../utils/hooks";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Aloading from "../../assets/Images/animation/ALoading.json";
import Nothing from "../../assets/Images/animation/NOFOUND1.json";

import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import { formatNumberWithDots } from "../../utils/constants";

const ListeEnvies = () => {
  const { userInfo } = useSelector((state) => state.projet);
  const navigate = useNavigate();

  async function RemoveToFav(produit) {
    if (!userInfo) {
      toast.error("Veuillez vous connectez svp !");
      navigate("/connexion");
    } else if (userInfo && !userInfo.emailVerified) {
      toast.error("Veuillez vérifiez votre compte svp!");
    } else {
      const produitsRef = doc(db, "produits", produit.id);
      try {
        const docSnap = await getDoc(produitsRef);
        const favoris = docSnap.data().favoris || [];
        // Check if the item already exists in the array based on its 'id'
        const itemExists = favoris.some((favori) => favori === userInfo.id);

        if (itemExists) {
          // Remove the item if it already exists
          await updateDoc(produitsRef, {
            favoris: arrayRemove(userInfo.id),
          });
          refetchEnvies();
          toast.error("Produit retiré des favoris ❌");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  function navigateProduct(produit) {
    const slug = produit.nom
      .toLowerCase()
      .replaceAll("/", "-")
      .split(" ")
      .join("_");
    navigate(`/produit/${slug}`, { state: { produit: produit } });
  }
  const {
    data: allProductsEnvies,
    error,
    isLoading,
    refetch: refetchEnvies,
  } = useQuery({
    queryKey: ["produitsEnvies"],
    queryFn: () => recupererProduitsFav(userInfo),

    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center h-full w-full justify-center">
        <Lottie animationData={Aloading} loop={true} className="w-[200px]" />
      </div>
    );
  }
  if (error) {
    return (
      <section className="flex justify-center items-center min-h-[300px]">
        <p>Une erreur s'est produite lors de la récupération des données.</p>
      </section>
    );
  }

  if (!allProductsEnvies || allProductsEnvies.length === 0) {
    return (
      <div className="flex   items-center h-full w-full justify-center">
        <div>
          <p className="text-center font-medium text-bleu4 text-base md:text-[20px] ">
            Aucun produit dans vos favoris{" "}
          </p>
          <Lottie
            animationData={Nothing}
            loop={true}
            className="w-[200px] mx-auto md:w-[300px]"
          />
          <Link
            to="/boutique"
            className="flex items-center justify-center gap-2 my-5 bg-orange3 text-white p-2 rounded hover:bg-bleu4 duration-500 transition-all "
          >
            <IoIosArrowBack className="md:text-[20px]" />{" "}
            <span>Retournez faire vos achats</span>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full">
      <div className="flex justify-between p-2 items-center ">
        <h3 className=" font-semibold text-lg text-md:[20px] ">
          <span> Votre liste d&apos;envies </span>
          <span>({allProductsEnvies.length})</span>
        </h3>
      </div>
      <hr />
      {allProductsEnvies.map((product) => (
        <div className=" " key={product.id}>
          <div className="border rounded-md flex flex-col md:flex-row gap-[20px] md:gap-0 justify-between p-3 m-3 ">
            <div className="flex gap-4">
              <img
                src={product.image}
                className="w-[80px] h-[80px] border md:w-[100px] md:h-[100px] object-cover rounded-md "
                alt=""
              />
              <div className="flex flex-col justify-between">
                <p>{product.nom}</p>
                <p className="font-medium">
                  {formatNumberWithDots(product.prixReference)} FCFA
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-between ">
              <button
                className="bg-orange3 text-white rounded-md px-3 py-2 uppercase font-medium hover:bg-bleu4 duration-500 transition-all "
                onClick={() => navigateProduct(product)}
              >
                acheter
              </button>
              <button
                className="flex  items-center text-orange3 duration-500  transition-all hover:text-bleu4 font-medium uppercase cursor-pointer"
                onClick={() => RemoveToFav(product)}
              >
                <MdDeleteForever className="text-[30px] " />
                <span className="cursor-pointer">supprimer</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListeEnvies;
