import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";

import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { recupererProduitsParCategorie } from "../utils/hooks";
const VoirPlus = ({ produit }) => {
  // console.log(produit.id);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const navigate = useNavigate();
  const {
    data: allAVis,
    error,
    isLoading,
    refetch: refetchAvis,
  } = useQuery({
    queryKey: ["allAvis"],
    queryFn: () =>
      recupererProduitsParCategorie(produit.sousCategorie, 0, 1000000),

    enabled: true,
  });

  if (isLoading) {
    return (
      <section className="flex gap-4 justify-center items-center min-h-[300px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex w-52 flex-col gap-4">
            <div className="flex items-center gap-5">
              <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
              <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
              </div>
            </div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        ))}
      </section>
    );
  }

  function navigateProduct(produit) {
    const slug = produit.nom.toLowerCase().split(" ").join("-");
    navigate(`/produit/${slug}`, { state: { produit: produit } });
  }
  if (error) {
    return (
      <section className="flex justify-center items-center min-h-[300px]">
        <p>Une erreur s'est produite lors de la récupération des données .</p>
      </section>
    );
  }

  if (!allAVis || allAVis.filter((el) => el.id !== produit.id).length === 0) {
    return (
      <div className="">
        <hr />
        <div className="max-w-[85%] mx-auto my-5">
          <p className="font-medium text-[18px] md:text-[20px]  ">
            Aucune recommandation pour le moment.
          </p>
        </div>
      </div>
    );
  }
  // console.log(allAVis);
  return (
    <div className="">
      <hr />
      <div className="max-w-[95%] md:max-w-[85%]  mx-auto ">
        <p className="font-medium text-[24px] my-2 ">
          Vous pourriez aussi aimer
        </p>
      </div>
      <hr />

      {/* SWIPER */}
      <div className=" mx-auto max-w-[95%] md:max-w-[85%] mt-10 mt:mt- mb-14 md:mb-7  ">
        <div className="relative ">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            spaceBetween={10}
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
            {allAVis
              .filter((el) => el.id !== produit.id)
              .map((product, index) => (
                <SwiperSlide className="relative slide-item" key={index}>
                  <div
                    onClick={() => navigateProduct(product)}
                    key={product.id}
                    className="border relative shadow-md rounded-md p-2  group will-change-transfor  cursor-pointer h-[220px] lg:h-[300px]  "
                  >
                    <div className=" flex items-center justify-center   relative overflow-hidden w-[90px] h-[90px]  md:w-[100px] md:h-[100px] lg:w-[150px] lg:h-[150px] object-cover rounded-md mx-auto">
                      <img
                        className="transition-all duration-500 object-cover h-full w-full group-hover:scale-105 rounded-md  "
                        src={product.image}
                        alt=""
                      />
                    </div>
                    <hr className="my-2" />

                    <div className=" h-[calc(100%-90px)] md:h-[calc(100%-100px)]  lg:h-[calc(100%-150px)]  flex flex-col justify-center  ">
                      <p className="  capitalize text-sm md:text-base text-orange3 font-medium ">
                        {product.nom}
                      </p>
                      <p className=" uppercase font-semibold ">
                        {product.prixReference} Fcfa
                      </p>
                      <div className="flex  gap-[5px] items-center  ">
                        <p className="text-[14px] text-nowrap">Qté min: </p>
                        <p className="   ">{product.quantiteMinimale}</p>{" "}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
          <div>{allAVis <= 0 && <p>Aun</p>}</div>
          {/* Navigation buttons */}
          <div
            className=" absolute
           -bottom-[45px] flex left-1/2 -translate-x-1/2 justify-between   "
          >
            <button
              ref={prevRef}
              className="arrowStyle  bg-orange3 mr-[10px]  "
            >
              <HiArrowLeft className="text-sm" />
            </button>
            <button ref={nextRef} className="arrowStyle ml-[10px] bg-orange3 ">
              <HiArrowRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoirPlus;
