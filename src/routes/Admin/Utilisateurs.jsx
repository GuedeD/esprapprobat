import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { recuperUtilisateurs } from "../../utils/hooks";
import Aloading from "../../assets/Images/animation/ALoading.json";
import ZeroPurchase from "../../assets/Images/animation/EmptyOrder.json";
import { MdAdminPanelSettings } from "react-icons/md";
import { frCA } from "date-fns/locale";
import { MdRemoveModerator } from "react-icons/md";

import Lottie from "lottie-react";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import toast from "react-hot-toast";
import Pagination from "rc-pagination/lib/Pagination";
const Utilisateurs = () => {
  const {
    data: allUsers,
    error,
    isLoading,
    refetch: refreshUsers,
  } = useQuery({
    queryKey: ["allUtilisateurs"],
    queryFn: recuperUtilisateurs,
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = allUsers?.slice(startIdx, endIdx);

  async function updateAdmin(id) {
    const docRef = doc(db, "users", id);
    try {
      await updateDoc(docRef, { role: "administrateur" });
      toast.success("Nouveau Administrateur Ajouté");
      refreshUsers();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function RemoveAdmin(id) {
    const docRef = doc(db, "users", id);
    try {
      await updateDoc(docRef, { role: "client" });
      toast.error("Role d'Administrateur retiré ❌");
      refreshUsers();
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (error) {
    return (
      <section className="flex justify-center items-center h-full">
        <p>Une erreur s'est produite lors de la récupération des données </p>
      </section>
    );
  }
  return (
    <div className="h-full  ">
      <h3 className="text-bleu4 font-semibold text-[20px] md:text-[26px] p-3">
        Les utilisateurs
      </h3>

      <hr />
      <div className="h-full ">
        {isLoading ? (
          <div className="flex items-center h-full w-full justify-center">
            <Lottie
              animationData={Aloading}
              loop={true}
              className="w-[200px]"
            />
          </div>
        ) : currentItems?.length > 0 ? (
          <div className=" p-2 md:p-5">
            <table className="border-collapse border border-slate-500  w-full mt-2">
              <thead>
                <tr className="bg-bleu4 text-white text-center">
                  <th className=" hidden md:table-cell border border-slate-600 text-[12px] md:text-[16px]">
                    Nom complet
                  </th>
                  <th className="border border-slate-600 text-[12px] md:text-[16px]">
                    Email
                  </th>
                  <th className="border border-slate-600 text-[12px] md:text-[16px]">
                    Role
                  </th>
                  <th className=" hidden md:table-cell border border-slate-600 text-[12px] md:text-[16px]">
                    Crée
                  </th>
                  <th className="border border-slate-600 text-[12px] md:text-[16px]">
                    Action
                  </th>
                </tr>
              </thead>
              {currentItems?.map((el, i) => (
                <tbody key={i}>
                  <tr className="text-center">
                    <td className="border border-slate-600 hidden md:table-cell text-[12px] md:text-[16px]">
                      {el.nomComplet}
                    </td>
                    <td className="border border-slate-600 text-[11px] md:text-[16px]">
                      {el.email}{" "}
                    </td>
                    <td
                      className={`border  border-slate-600 font-semibold uppercase text-[10px] md:text-[16px] ${
                        el.role === "administrateur"
                          ? "bg-green-500 text-white "
                          : ""
                      } `}
                    >
                      {el.role.slice(0, 2)}.{" "}
                    </td>
                    <td className=" hidden md:table-cell border border-slate-600 text-[12px] md:text-[16px]">
                      {format(el.createdAt.toDate(), "d MMMM yyyy", {
                        locale: frCA,
                      })}
                    </td>
                    <td className=" border-slate-600 border cursor-pointer  text-[12px] md:text-[16px] ">
                      {el.role === "client" ? (
                        <p
                          className="tooltip-success tooltip"
                          data-tip="Ajouter comme Admin"
                        >
                          <MdAdminPanelSettings
                            className="mx-auto text-[22px] md:text-[30px] cursor-pointer tooltip hover:text-3  "
                            onClick={() => updateAdmin(el.id)}
                            data-tip="Ajouter comme Admin"
                          />
                        </p>
                      ) : (
                        <p
                          data-tip="Retirer comme Admin ❌"
                          className="tooltip tooltip-error "
                        >
                          <MdRemoveModerator
                            className="mx-auto text-[18px] md:text-[24px] cursor-pointer   "
                            onClick={() => RemoveAdmin(el.id)}
                          />
                        </p>
                      )}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>

            <div className=" w-full ">
              <hr className=" my-3 " />
              <div className="w-full flex justify-center my-1   ">
                <Pagination
                  style={{ fontWeight: "normal" }}
                  current={currentPage} // The current page
                  total={allUsers.length} // Total number of products
                  pageSize={pageSize} // Number of items per page
                  onChange={onPageChange} // Handle page change
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center  items-center mt-5">
            <p className="uppercase font-medium text-[20px] font-sans2 ">
              Aucun utilisateur enregistré
            </p>

            <Lottie
              animationData={ZeroPurchase}
              loop={true}
              className="w-[500px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Utilisateurs;
