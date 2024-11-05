import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";

import { CiCircleChevRight } from "react-icons/ci";
import { CgHeart } from "react-icons/cg";
import { ImHeart } from "react-icons/im";

import { FaRegHandPointRight } from "react-icons/fa";

import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { recupererRecentsGO } from "../../utils/hooks";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { formatNumberWithDots } from "../../utils/constants";

const Recents = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { userInfo } = useSelector((state) => state.projet);
  const navigate = useNavigate();
  // Fetch recent products using React Query
  const {
    data: allProductsRecents,
    error,
    isLoading: isLoadingAll,
    refetch: refetchGO,
  } = useQuery({
    queryKey: ["allProductsGO"],
    queryFn: recupererRecentsGO,
    // directly use recupererRecents function
    staleTime: 10 * 60 * 500,
    enabled: true,
  });

  function navigateProduct(produit) {
    const slug = produit.nom
      .toLowerCase()
      .replaceAll("/", "-")
      .split(" ")
      .join("-");
    navigate(`/produit/${slug}`, { state: { produit: produit } });
  }
  // console.log(userInfo);
  async function addOrRemoveToFav(produit) {
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
        // console.log(favoris);
        // console.log(itemExists);
        if (itemExists) {
          // Remove the item if it already exists
          await updateDoc(produitsRef, {
            favoris: arrayRemove(userInfo.id),
          });
          refetchGO();
          toast.error("Produit retiré des favoris ❌");
        } else {
          // Add the item if it doesn't exist
          await updateDoc(produitsRef, {
            favoris: arrayUnion(userInfo.id),
          });
          refetchGO();

          toast.success("Produit ajouté aux favoris ✅");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  // Handle loading state
  if (isLoadingAll) {
    return (
      <section className="flex gap-4 justify-center items-center min-h-[300px]">
        {[0, 1].map((i) => (
          <div key={i} className="flex w-[100px] md:w-52 flex-col gap-[40px] ">
            <div className="flex items-center gap-5">
              <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
              <div className="flex flex-col gap-4">
                {/* <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div> */}
              </div>
            </div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        ))}
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section className="flex justify-center items-center min-h-[300px]">
        <p>Une erreur s'est produite lors de la récupération des données.</p>
      </section>
    );
  }

  // Handle case where no products are found
  if (!allProductsRecents || allProductsRecents.length === 0) {
    return (
      <section className="flex justify-center items-center min-h-[300px]">
        <p> Aucun produit pour le moment..</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-t-[40px] md:rounded-t-[60px] -mt-[70px] z-20 relative">
      <div className=" mx-auto max-w-[83%]  ">
        <h2 className="pt-[30px] text-[16px] md:text-[22px] flex flex-col items-center">
          <span>Articles Récemment Ajoutés : </span>
          <span className=" text-[22px] md:text-[26px] font-bold ">
            Gros Oeuvre{" "}
          </span>
        </h2>

        <div className="relative h-full">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            spaceBetween={1}
            breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 2,
              },
              // when window width is >= 640px
              640: {
                slidesPerView: 2,
              },
              // when window width is >= 768px
              768: {
                slidesPerView: 3,
              },
              // when window width is >= 1024px
              1024: {
                slidesPerView: 4,
              },
              // when window width is >= 1200px
              1300: {
                slidesPerView: 5,
              },
            }}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => {
              // Ensure swiper updates its navigation buttons
              setTimeout(() => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
              });
            }}
          >
            {allProductsRecents.map((product, index) => (
              <SwiperSlide className=" relative slide-item" key={index}>
                <div className=" flex flex-col items-center border rounded-t-md p-2 m-2 h-[170px] lg:h-[220px] ">
                  <img
                    src={product.image}
                    className="w-full h-[100px]   md:h-[100px]  lg:h-[150px] object-cover rounded-md"
                    alt={product.nom}
                  />
                  <p className="text-sm md:text-base text-center mt-2   flex items-center h-full">
                    {product.nom.length > 25
                      ? `${product.nom.slice(0, 25)}...`
                      : product.nom}
                  </p>{" "}
                </div>
                <div className="mt-2 p-3 flex items-center justify-between rounded-b-md bg-bleu4 text-white m-2">
                  <div className="flex flex-col items-center">
                    <p className="font-semibold">
                      {formatNumberWithDots(product.prixReference)}f
                    </p>
                  </div>
                  <div className="flex text-[26px] gap-2">
                    <span data-tip="Voir" className="tooltip ">
                      <CiCircleChevRight
                        className="cursor-pointer hover:font-bold  "
                        onClick={() => navigateProduct(product)}
                      />
                    </span>
                  </div>
                </div>
                <span
                  className="absolute top-4 right-5 text-orange3
 cursor-pointer hover:bg-orange3 hover:text-white rounded-full duration-500 transition-all  "
                >
                  {product?.favoris.length > 0 &&
                  product?.favoris.find((res) => res === userInfo?.id) ? (
                    <div className="p-[6px]">
                      <ImHeart
                        className="text-[25px] "
                        onClick={() => addOrRemoveToFav(product)}
                      />
                    </div>
                  ) : (
                    <div className=" p-[6px] ">
                      <CgHeart
                        className="text-[30px]"
                        onClick={() => addOrRemoveToFav(product)}
                      />
                    </div>
                  )}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          <div className="absolute flex justify-between w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              ref={prevRef}
              className="arrowStyle -ml-[27px] md:-ml-[40px]"
            >
              <HiArrowLeft className="text-sm" />
            </button>
            <button
              ref={nextRef}
              className="arrowStyle md:-mr-[40px] -mr-[27px]"
            >
              <HiArrowRight className="text-sm md:text-base " />
            </button>
          </div>
        </div>
        <Link
          to="/boutique"
          className="my-2 justify-end items-center gap-2  cursor-pointer underline underline-offset-2 text-orange font-medium flex "
        >
          <span>Voir Tous les produits Ici</span>
          <FaRegHandPointRight />
        </Link>
      </div>
    </section>
  );
};

export default Recents;
