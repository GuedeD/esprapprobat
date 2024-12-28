import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { ImHeart } from "react-icons/im";
import { CgHeart } from "react-icons/cg";
import toast from "react-hot-toast";

import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { RiMenuFold3Fill } from "react-icons/ri";
import { formatNumberWithDots } from "../utils/constants";

// eslint-disable-next-line react/prop-types
const BoutiqueRightSide = ({ produits, refetchPriceProducts, openDrawer }) => {
  //   const { products } = useSelector((state) => state.projet);
  const { userInfo } = useSelector((state) => state.projet);
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage") || 1
  );
  const [pageSize, setPageSize] = useState(20); // You can adjust the number of items per page

  // Function to handle the page change
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  // Calculate the starting and ending indices for slicing the data
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = produits.slice(startIdx, endIdx);
  const navigate = useNavigate();

  function navigateProduct(produit) {
    const slug = produit.nom.toLowerCase().split(" ").join("_");
    navigate(`/produit/${slug}`, { state: { produit: produit } });
  }

  async function addOrRemoveToFav(e, product) {
    e.stopPropagation();
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
        // Check if the item already exists in the array based on its 'id'
        const itemExists = favoris.some((favori) => favori === userInfo.id);
        // console.log(favoris);
        // console.log(itemExists);
        if (itemExists) {
          // Remove the item if it already exists
          await updateDoc(produitsRef, {
            favoris: arrayRemove(userInfo.id),
          });
          refetchPriceProducts();
          toast.error("Produit retiré des favoris ❌");
        } else {
          // Add the item if it doesn't exist
          await updateDoc(produitsRef, {
            favoris: arrayUnion(userInfo.id),
          });
          refetchPriceProducts();

          toast.success("Produit ajouté aux favoris ✅");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <div className="w-full pt-8 md:pt-0">
      <div className="p-5 border shadow-md rounded-md mb-4 ">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[18px]">Nos articles</h3>
          <RiMenuFold3Fill
            className="md:hidden text-orange3 font-semibold text-[25px] "
            onClick={() => openDrawer()}
          />
        </div>
        <hr className="my-3" />
        <p className="text-[14px]">{produits.length} résultats</p>
      </div>
      <div className="border rounded-md relative">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] p-5  mb-[60px]  ">
          {currentItems?.map((produit) => (
            <div
              onClick={() => navigateProduct(produit)}
              key={produit.id}
              className="border relative shadow-md rounded-md p-2  group will-change-transfor  cursor-pointer "
            >
              <div className=" rounded-md  relative overflow-hidden h-[100px] md:h-[150px] w-full">
                <img
                  className="transition-all duration-500 object-cover h-full w-full group-hover:scale-105 rounded-md  "
                  src={produit.image}
                  alt=""
                />

                <span
                  className="absolute top-1 right-3 text-orange3
 cursor-pointer hover:bg-orange3 hover:text-white rounded-full duration-500 transition-all  "
                >
                  {produit?.favoris.length > 0 &&
                  produit?.favoris.find((res) => res === userInfo?.id) ? (
                    <div className="p-[6px]">
                      <ImHeart
                        className="text-[25px] "
                        onClick={(e) => addOrRemoveToFav(e, produit)}
                      />
                    </div>
                  ) : (
                    <div className=" p-[6px] ">
                      <CgHeart
                        className="text-[30px]"
                        onClick={(e) => addOrRemoveToFav(e, produit)}
                      />
                    </div>
                  )}
                </span>
              </div>
              <hr className="my-2" />

              <div>
                <p className="  capitalize ">
                  {produit.nom.length > 30
                    ? `${produit.nom.slice(0, 29)}...`
                    : produit.nom}
                </p>
                <p className=" uppercase font-semibold ">
                  {formatNumberWithDots(produit.prixReference)} Fcfa
                </p>
                <div className="flex flex-col md:flex-row  gap-[5px] md:items-center  ">
                  <p className="text-[12px]  md:text-[14px] text-nowrap">
                    Quantité min:{" "}
                  </p>
                  <p className=" text-[14px] md:text-base  ">
                    {produit.quantiteMinimale}
                  </p>{" "}
                </div>
                <p></p>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute w-full bottom-2">
          <hr className=" my-3 " />
          <div className="w-full flex justify-center my-1   ">
            <Pagination
              style={{ fontWeight: "normal" }}
              current={currentPage} // The current page
              total={produits.length} // Total number of products
              pageSize={pageSize} // Number of items per page
              onChange={onPageChange} // Handle page change
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoutiqueRightSide;
