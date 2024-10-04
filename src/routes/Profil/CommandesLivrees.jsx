import { NavLink } from "react-router-dom";

import ZeroPurchase from "../../assets/Images/animation/ZeroPurchase.json";
import Aloading from "../../assets/Images/animation/ALoading.json";

import Lottie from "lottie-react";
import { recuperCommandesLivre } from "../../utils/hooks";
import { useQuery } from "@tanstack/react-query";
import CommandesCardLI from "../../components/CommandesCardLI";
import { useSelector } from "react-redux";
const CommandesLivrees = () => {
  const { userInfo } = useSelector((state) => state.projet);
  const {
    data: allCommandes,
    error,
    isLoading: isLoading,
    refetch: refetchCommandes,
  } = useQuery({
    queryKey: ["CommandesLivrees"],
    queryFn: () => recuperCommandesLivre(userInfo.id),
    // directly use recupererRecents function

    enabled: true,
  });
  if (error) {
    return (
      <section className="flex justify-center items-center h-full">
        <p>Une erreur s'est produite lors de la récupération des données </p>
      </section>
    );
  }

  return (
    <div className="h-full">
      <div className="flex justify-between p-2 items-center ">
        <h3 className=" font-semibold text-lg text-md:[20px] ">
          Vos commandes
        </h3>
      </div>
      <hr />
      <div className=" flex gap-5 border-b pl-2 ">
        <NavLink
          to={"/profil/commandes"}
          end
          className={({ isActive }) =>
            isActive
              ? "text-orange3 border-b-4 border-orange3 pb-2 pt-2 "
              : "pb-2 pt-2"
          }
        >
          <span>EN COURS</span>
        </NavLink>
        <NavLink
          to={"/profil/commandes/okay"}
          end
          className={({ isActive }) =>
            isActive
              ? "text-orange3 border-b-4 border-orange3 pb-2 pt-2 "
              : "pb-2 pt-2"
          }
        >
          <span className="uppercase">livrées</span>
        </NavLink>
      </div>
      {isLoading ? (
        <div className="flex items-center h-full w-full justify-center">
          <Lottie animationData={Aloading} loop={true} className="w-[200px]" />
        </div>
      ) : allCommandes?.length > 0 ? (
        <CommandesCardLI allCommandes={allCommandes} />
      ) : (
        <div className="h-full flex flex-col justify-center  items-center -mt-5">
          <p className="uppercase p-2 text-center font-medium text-xs md:text-sm lg:text-[20px] font-sans2 ">
            Aucune commande en cours pour le moment.
          </p>

          <Lottie
            animationData={ZeroPurchase}
            loop={true}
            className="w-[200px] lg:w-[500px]"
          />
        </div>
      )}
    </div>
  );
};

export default CommandesLivrees;
