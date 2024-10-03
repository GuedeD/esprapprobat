import { useEffect, useState } from "react";
import BoutiqueLeftSide from "../components/BoutiqueLeftSide";
import BoutiqueRightSide from "../components/BoutiqueRightSide";
import {
  // getProductsByPriceRange,
  recupererProduits,
  recupererProduitsParCategorie,
} from "../utils/hooks";
import Lottie from "lottie-react";
import Aloading from "../assets/Images/animation/ALoading.json";
import Nothing from "../assets/Images/animation/NOFOUND1.json";
import { useQuery } from "@tanstack/react-query";
import { RiMenuFold3Fill } from "react-icons/ri";
import { useLocation } from "react-router-dom";

const Boutique = () => {
  const location = useLocation();
  const [categorieSelectionner, setCategorieSelectionner] = useState(
    location?.state?.cat ? location.state.cat : ""
  );
  const [priceRange, setPriceRange] = useState([100, 1000000]);

  async function fetchProducts(min, max) {
    const res = await recupererProduits(min, max);
    return res;
  }

  async function fetchCategoryProducts(categorie, min, max) {
    const res = await recupererProduitsParCategorie(categorie, min, max);
    return res;
  }

  // console.log(priceRange);
  const {
    data: allProducts,
    error,
    isLoading: isLoadingAll,
    refetch: refetchPriceProducts,
  } = useQuery({
    queryKey: ["allProducts"],

    queryFn: () => fetchProducts(priceRange[0], priceRange[1]),
    staleTime: 60 * 60 * 500,
  });

  const {
    data: categoryProducts,
    isLoading: isLoadingCategory,
    refetch: refetchCategory,
  } = useQuery({
    queryKey: ["categoryProducts", categorieSelectionner],

    queryFn: () =>
      fetchCategoryProducts(
        categorieSelectionner,
        priceRange[0],
        priceRange[1]
      ),
    enabled: !!categorieSelectionner,
    staleTime: 60 * 60 * 500,
  });

  // const [produits, setProduits] = useState([])
  const produits = categorieSelectionner ? categoryProducts : allProducts;

  const isLoading = isLoadingAll || isLoadingCategory;
  const [resetBtn, setResetBtn] = useState(false);

  useEffect(() => {
    refetchPriceProducts(); // Trigger refetch when priceRange changes
  }, [resetBtn, refetchPriceProducts]);

  const [openCat, setOpenCat] = useState(false);

  const openDrawer = () => {
    setOpenCat(true);
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setOpenCat(false);
  };

  return (
    <div className="flex gap-[30px] max-w-[95%]  md:max-w-[85%] mx-auto py-6   min-h-[80vh] md:pt-[50px]">
      <BoutiqueLeftSide
        openDrawer={openDrawer}
        openCat={openCat}
        closeDrawer={closeDrawer}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        categorieSelectionner={categorieSelectionner}
        setCategorieSelectionner={setCategorieSelectionner}
        // setPriceLaunch={setPriceLaunch}
        setResetBtn={setResetBtn}
        resetBtn={resetBtn}
        refetchPriceProducts={refetchPriceProducts}
        refetchCategory={refetchCategory}
      />
      {isLoading ? (
        <div className="flex items-center w-full justify-center">
          <Lottie animationData={Aloading} loop={true} className="w-[200px]" />
        </div>
      ) : produits?.length > 0 ? (
        <BoutiqueRightSide
          openDrawer={openDrawer}
          produits={produits}
          refetchPriceProducts={refetchPriceProducts}
        />
      ) : (
        <div className="flex flex-col w-full  h-full  mt-8 md:mt-0">
          <div className="p-5 border shadow-md rounded-md mb-4  ">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[18px]">Nos articles</h3>
              <RiMenuFold3Fill
                className="md:hidden text-orange3 font-semibold text-[25px] "
                onClick={() => openDrawer()}
              />
            </div>
            <hr className="my-3" />
            <p className="text-[14px]">{produits?.length} résultats</p>
          </div>
          <div className="flex  p-4  items-center border rounded-md justify-center flex-col  ">
            <p className="text-bleu4   text-[14px] md:text-[18px] flex flex-col">
              <span>Aucun produit trouvé pour cette catégorie </span>
              <span className="text-center font-medium">
                {" "}
                {categorieSelectionner}{" "}
              </span>
            </p>
            <Lottie
              animationData={Nothing}
              loop={true}
              className=" w-[250px] lg:w-[400px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Boutique;
