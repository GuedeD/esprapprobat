import { useEffect, useState } from "react";
import {
  categories,
  sousCategories1,
  sousCategories2,
} from "../utils/constants";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { BiReset } from "react-icons/bi";
import { MdArrowDropDown } from "react-icons/md";
import { MdOutlineArrowDropUp } from "react-icons/md";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";

import { FaWindowClose } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const BoutiqueLeftSide = ({
  setMinPrice,
  priceRange,
  setPriceRange,
  categorieSelectionner,
  setCategorieSelectionner,
  refetchCategory,
  setResetBtn,
  resetBtn,
  refetchPriceProducts,
  openDrawer,
  openCat,
  closeDrawer,
}) => {
  // Ensure priceRange is always an array of two numbers
  const handleRangeChange = (range) => {
    if (range) {
      setPriceRange(range);
      setMinPrice(range[0]);
    }
    localStorage.setItem("minPrice", JSON.stringify(range[0]));
  };
  const { pathname } = useLocation();

  const [showGO, setShowGO] = useState(true);
  const [showSO, setShowSO] = useState(false);

  function refetchFn() {
    if (categorieSelectionner) {
      refetchCategory();
    } else {
      refetchPriceProducts();
    }
  }

  function resetProduits() {
    setResetBtn(!resetBtn);
    setCategorieSelectionner("");
    setPriceRange([100, 1000000]);
    localStorage.removeItem("catSelectionner");
    localStorage.removeItem("catSelectionner2");

    localStorage.removeItem("produits");
    localStorage.removeItem("minPrice");
  }

  useEffect(() => {
    closeDrawer();
    localStorage.setItem("currentPage", 1);
  }, [categorieSelectionner]);
  return (
    <>
      <div className="border hidden md:block max-w-[280px] shadow-md rounded-md sticky h-fit">
        <div className="flex items-center justify-between px-5 pt-5  mb-[20px]">
          <h3 className=" font-medium text-[18px]">CATEGORIES</h3>
          <BiReset
            onClick={() => resetProduits()}
            className="hover:text-orange3 transition-all duration-500 cursor-pointer text-[25px] rounded-md mx-2 "
          />
        </div>
        <div>
          <div>
            <p
              className="flex justify-between items-center px-3 p-1
          "
            >
              <span className="  font-semibold text-[20px] ">Gros Oeuvre</span>
              {showGO ? (
                <MdOutlineArrowDropUp
                  className="text-[30px] cursor-pointer "
                  onClick={() => setShowGO(!showGO)}
                />
              ) : (
                <MdArrowDropDown
                  className="text-[30px] cursor-pointer "
                  onClick={() => setShowGO(!showGO)}
                />
              )}
            </p>
            {showGO &&
              sousCategories1.map((categorie, index) => (
                <form
                  className="hover:text-bleu4 px-5 flex items-center gap-2 duration-500 transition-all  py-[6px] capitalize"
                  key={index}
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    id={categorie}
                    name="categorie"
                    value={categorie}
                    checked={categorieSelectionner === categorie}
                    onChange={() => {
                      setCategorieSelectionner(categorie),
                        setPriceRange([100, 1000000]);
                    }}
                  />
                  <label className="cursor-pointer " htmlFor={categorie}>
                    {categorie}
                  </label>
                </form>
              ))}
          </div>
          <div>
            <p
              className="flex justify-between items-center px-3 p-1
          "
            >
              <span className="  font-semibold text-[20px] ">
                Second Oeuvre
              </span>
              {showSO ? (
                <MdOutlineArrowDropUp
                  className="text-[30px] cursor-pointer "
                  onClick={() => setShowSO(!showSO)}
                />
              ) : (
                <MdArrowDropDown
                  className="text-[30px] cursor-pointer "
                  onClick={() => setShowSO(!showSO)}
                />
              )}
            </p>
            {showSO &&
              sousCategories2.map((categorie, index) => (
                <form
                  className="hover:text-bleu4 px-5 flex items-center gap-2 duration-500 transition-all py-[6px] capitalize"
                  key={index}
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    id={categorie}
                    name="categorie"
                    value={categorie}
                    checked={categorieSelectionner === categorie}
                    onChange={() => {
                      setCategorieSelectionner(categorie),
                        setPriceRange([100, 1000000]);
                    }}
                  />
                  <label className="cursor-pointer " htmlFor={categorie}>
                    {categorie}
                  </label>
                </form>
              ))}
          </div>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between items-center px-5 mb-[20px]">
          <h3 className="font-medium text-[18px] hover:bg-bleu4 hover:text-white transition-all duration-500">
            PRIX
          </h3>
          <p
            className="hover:bg-orange3 hover:text-white transition-all duration-500 cursor-pointer px-3 py-2 rounded-md"
            onClick={() => refetchFn()}
          >
            OK
          </p>
        </div>
        <div className="px-5">
          {/* Render the slider */}
          <Slider
            range
            min={0}
            max={1000000}
            step={100}
            defaultValue={[100, 1000000]}
            value={priceRange || [100, 1000000]} // Fallback if priceRange is undefined
            onChange={handleRangeChange}
            trackStyle={[{ backgroundColor: "#FE8E3C" }]}
            handleStyle={[
              { borderColor: "#FE8E3C", backgroundColor: "#fff" },
              { borderColor: "#FE8E3C", backgroundColor: "#fff" },
            ]}
            railStyle={{ backgroundColor: "lightgray" }}
          />

          {/* Display the selected price range dynamically */}
          <form className="flex gap-2 w-full my-3 items-center">
            <input
              type="number"
              placeholder="Min"
              value={priceRange[0] > 0 ? priceRange[0] : ""}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="border focus:border-1 rounded-md p-2 w-full outline-none"
            />
            -
            <input
              type="number"
              value={priceRange[1]} // Ensure this is always a number
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="border rounded-md p-2 w-full outline-none"
            />
          </form>
        </div>
      </div>
      <Drawer
        open={openCat}
        onClose={closeDrawer}
        width="60%"
        // Adjust the width of the drawer
      >
        {/* <Menu /> */}

        <div className="border max-w-[280px] min-h-[130vh] shadow-md rounded-md sticky h-fit ">
          <div className="flex items-center justify-between px-5 pt-5  mb-[20px]">
            <FaWindowClose
              className="text-[22px] text-orange3"
              onClick={closeDrawer}
            />
            <h3 className=" font-medium text-base">CATEGORIES</h3>
            <BiReset
              onClick={() => resetProduits()}
              className="hover:text-orange3 transition-all duration-500 cursor-pointer text-[22px] rounded-md mx-2 "
            />
          </div>
          <div>
            <div>
              <p
                className="flex justify-between items-center px-3 p-1
          "
              >
                <span className="  font-semibold text-[18px] ">
                  Gros Oeuvre
                </span>
                {showGO ? (
                  <MdOutlineArrowDropUp
                    className="text-[30px] cursor-pointer "
                    onClick={() => setShowGO(!showGO)}
                  />
                ) : (
                  <MdArrowDropDown
                    className="text-[30px] cursor-pointer "
                    onClick={() => setShowGO(!showGO)}
                  />
                )}
              </p>
              {showGO &&
                sousCategories1.map((categorie, index) => (
                  <form
                    className="hover:text-bleu4 px-3 flex items-center gap-2 duration-500 transition-all  py-[6px] capitalize"
                    key={index}
                  >
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={categorie}
                      name="categorie"
                      value={categorie}
                      checked={categorieSelectionner === categorie}
                      onChange={() => {
                        setCategorieSelectionner(categorie),
                          setPriceRange([100, 1000000]);
                      }}
                    />
                    <label
                      className="cursor-pointer text-[14px] "
                      htmlFor={categorie}
                    >
                      {categorie}
                    </label>
                  </form>
                ))}
            </div>
            <div>
              <p
                className="flex justify-between items-center px-3 p-1
          "
              >
                <span className="  font-semibold text-[18px] ">
                  Second Oeuvre
                </span>
                {showSO ? (
                  <MdOutlineArrowDropUp
                    className="text-[30px] cursor-pointer "
                    onClick={() => setShowSO(!showSO)}
                  />
                ) : (
                  <MdArrowDropDown
                    className="text-[30px] cursor-pointer "
                    onClick={() => setShowSO(!showSO)}
                  />
                )}
              </p>
              {showSO &&
                sousCategories2.map((categorie, index) => (
                  <form
                    className="hover:text-bleu4 px-3 flex items-center gap-2 duration-500 transition-all py-[6px] capitalize"
                    key={index}
                  >
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={categorie}
                      name="categorie"
                      value={categorie}
                      checked={categorieSelectionner === categorie}
                      onChange={() => {
                        setCategorieSelectionner(categorie),
                          setPriceRange([100, 1000000]);
                      }}
                    />
                    <label
                      className="cursor-pointer text-[14px] "
                      htmlFor={categorie}
                    >
                      {categorie}
                    </label>
                  </form>
                ))}
            </div>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center px-3 mb-[10px]">
            <h3 className="font-medium text-[18px] hover:bg-bleu4 hover:text-white transition-all duration-500">
              PRIX
            </h3>
            <p
              className="hover:bg-orange3 hover:text-white transition-all duration-500 cursor-pointer px-3 py-2 rounded-md"
              onClick={() => refetchFn()}
            >
              OK
            </p>
          </div>
          <div className="px-3 ">
            {/* Render the slider */}
            <Slider
              range
              min={100}
              max={1000000}
              step={100}
              defaultValue={[100, 1000000]}
              value={priceRange || [100, 1000000]} // Fallback if priceRange is undefined
              onChange={handleRangeChange}
              trackStyle={[{ backgroundColor: "#FE8E3C" }]}
              handleStyle={[
                { borderColor: "#FE8E3C", backgroundColor: "#fff" },
                { borderColor: "#FE8E3C", backgroundColor: "#fff" },
              ]}
              railStyle={{ backgroundColor: "lightgray" }}
            />

            {/* Display the selected price range dynamically */}
            <form className="flex gap-2 w-full my-3 items-center">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0] > 0 ? priceRange[0] : ""}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="border focus:border-1 rounded-md text-sm p-2 w-full outline-none"
              />
              -
              <input
                type="number"
                value={priceRange[1]} // Ensure this is always a number
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="border rounded-md p-2 w-full text-sm outline-none"
              />
            </form>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default BoutiqueLeftSide;
