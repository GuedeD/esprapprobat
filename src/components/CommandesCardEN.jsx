import React, { useState } from "react";
import { format } from "date-fns";
import { frCA } from "date-fns/locale";
import Pagination from "rc-pagination/lib/Pagination";
const CommandesCardEN = ({ allCommandes }) => {
  function formatNumberWithDots(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = allCommandes.slice(startIdx, endIdx);
  return (
    <div>
      {currentItems?.length > 0 &&
        currentItems.map((el, i) => (
          <div key={el.id}>
            <div className=" border p-2 m-4 rounded-md">
              <div className="text-[14px] mt-1 text-slate-400">
                <p className="text-black font-semibold ">
                  {el.articlesAchetes.length}{" "}
                  {el.articlesAchetes.length > 1 ? "Articles" : "Article"}
                </p>
                <p>
                  effectué le{" "}
                  {format(el.createdAt.toDate(), "d MMMM yyyy", {
                    locale: frCA,
                  })}
                </p>
                <p>Total : {formatNumberWithDots(el.montantTotal)} Fcfa</p>
                <p className="">Id: {el.id}</p>
              </div>
              <p className=" hidden md:block text-sm md:text-base uppercase mt-4 ">
                {" "}
                {el.articlesAchetes.length > 1 ? "Articles" : "Article"} dans
                votre commande
              </p>
              <hr className="my-2" />
              <div className=" rounded-md grid grid-cols-1 lg:grid-cols-2 gap-[20px] xl:gap-[50px] m-2 ">
                {el.articlesAchetes.map((item, i) => (
                  <div className="flex gap-4 items-center" key={i}>
                    <img
                      src={item.image}
                      className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] object-cover border rounded-md "
                      alt=""
                    />

                    <div className="flex flex-col justify-between gap-2 ">
                      <div className="">
                        <p className="text-sm md:text-[18px]">{item.nom}</p>
                        <p className="text-slate-500 text-[12px]">
                          quantité: <span> {item.quantite} </span>
                        </p>
                      </div>
                      <div>
                        <p className="font-medium uppercase bg-orange4 gap-1 text-nowrap text-white rounded-md w-fit py-[2px] px-1 text-[10px]  flex">
                          <span>en cours </span>
                          <span className="hidden md:flex">de livraison </span>
                        </p>
                        {item.type !== "undefined" && (
                          <p className="font-medium  text-[13px] mt-1 ">
                            Type: {item.type}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {currentItems?.length === i + 1 ? (
              ""
            ) : (
              <div className=" border-slate-400 border-dashed border w-full h-[1px] my-2 " />
            )}
          </div>
        ))}
      <div className=" w-full bottom-2">
        <hr className=" mt-6 " />
        <div className="w-full flex justify-center my-2   ">
          <Pagination
            style={{ fontWeight: "normal" }}
            current={currentPage} // The current page
            total={allCommandes.length} // Total number of products
            pageSize={pageSize} // Number of items per page
            onChange={onPageChange} // Handle page change
          />
        </div>
      </div>
    </div>
  );
};

export default CommandesCardEN;
