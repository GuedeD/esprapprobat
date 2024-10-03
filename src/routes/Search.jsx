import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { useLoaderData, useNavigate } from "react-router-dom";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import Lottie from "lottie-react";
import Nothing from "../assets/Images/animation/NOFOUND1.json";

const Search = () => {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the starting and ending indices for slicing the data
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = data.slice(startIdx, endIdx);

  function navigateProduct(produit) {
    const slug = produit.nom.toLowerCase().split(" ").join("-");
    navigate(`/produit/${slug}`, { state: { produit: produit } });
  }
  return (
    <div
      className=" max-w-[95%] md:max-w-[85%] mx-auto border rounded-md
    mt-[120px] mb-[100px] relative "
    >
      <div className="flex justify-center items-center gap-2   rounded-t-md text-[22px] bg-slate-500 text-white p-2 py-4 font-medium">
        <p> {data.length} </p>
        <h3> {data.length > 1 ? "Articles trouvés" : "Article trouvé"} </h3>
      </div>
      <hr />
      {currentItems.length === 0 && (
        <div className="flex items-center justify-center flex-col w-full ">
          <Lottie animationData={Nothing} loop={true} className="w-[400px]" />
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] p-3  mb-[60px]  ">
        {currentItems.length > 0 &&
          currentItems.map((produit) => (
            <div
              onClick={() => navigateProduct(produit)}
              key={produit.id}
              className="border relative shadow-md rounded-md p-2  group will-change-transfor  cursor-pointer "
            >
              <div className=" rounded-md  relative overflow-hidden h-[120px] md:h-[170px] w-full">
                <img
                  className="transition-all duration-500 object-cover h-full w-full group-hover:scale-105 rounded-md  "
                  src={produit.image}
                  alt=""
                />
              </div>
              <hr className="my-2" />

              <div>
                <p className="  capitalize ">{produit.nom}</p>
                <p className=" uppercase font-semibold ">
                  {produit.prixReference} Fcfa
                </p>
                <div className="flex  gap-[5px] items-center  ">
                  <p className="text-[14px] text-nowrap">Quantité min : </p>
                  <p className="   ">{produit.quantiteMinimale}</p>{" "}
                </div>
              </div>
            </div>
          ))}
      </div>
      {currentItems.length > 0 && (
        <div className="absolute w-full bottom-2">
          <hr className=" my-3 " />
          <div className="w-full flex justify-center my-1   ">
            <Pagination
              style={{ fontWeight: "normal" }}
              current={currentPage} // The current page
              total={data.length} // Total number of products
              pageSize={pageSize} // Number of items per page
              onChange={onPageChange} // Handle page change
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
