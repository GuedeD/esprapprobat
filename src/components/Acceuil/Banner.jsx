import { useEffect } from "react";

const Banner = ({ allImages }) => {
  useEffect(() => {
    localStorage.removeItem("catSelectionner");
    localStorage.removeItem("produits");
    localStorage.removeItem("minPrice");
  }, []);

  return (
    <div className=" mx-auto  relative z-10 ">
      <div className="relative before:absolute before:bg-black before:inset-0 before:opacity-40">
        {/* <img
          className="h-[100px] md:h-[100px] lg:h-[100px] xl:h-[300px] w-full  mt-10    "
          src={allImages?.banner}
          alt=""
        /> */}

        {/* bg-[url('${allImages?.banner}')] */}
        <div
          className="h-[300px] md:h-[350px] lg:h-[400px] xl:h-[550px] w-full  "
          style={{
            backgroundImage: `url(${allImages?.banner})`,
            backgroundSize: "cover", // Adjust to your needs
            backgroundPosition: "60% 30%", // Adjust to your needs
          }}
        ></div>
      </div>
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white max-w-[510px] text-center font-sans2 lg:text-[25px]  font-semibold leading-[30px] -mt-3 text-nowrap flex flex-col">
        <span className=" text-[25px] md:text-[35px] lg:text-[40px] xl:text-[50px] py-1 md:py-4 lg:py-5 ">
          Approbat
        </span>
        <span className="text-sm md:text-base lg:text-lg xl:text-xl">
          votre partenaire fiable pour un chantier réussi{" "}
        </span>
      </p>
    </div>
  );
};

export default Banner;
