import { useEffect, useState } from "react";
import {
  categories,
  sousCategories1,
  sousCategories2,
} from "../../utils/constants";
import SimpleLoader from "../../components/SimpleLoader";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { db, storage } from "../../config/firebase";
import Resizer from "react-image-file-resizer";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast from "react-hot-toast";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";
import { Link, useLocation } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";

const ModifierProduit = () => {
  const location = useLocation();
  const produit = location.state.produit;

  ///////////////// STATE DEBUT /////////////////
  const [nom, setNom] = useState(produit.nom);
  const [description, setDescription] = useState(produit.description);

  let livraisonDefaut = {
    value: produit.livraisonGratuite ? "oui" : "non",
    label: produit.livraisonGratuite ? "oui" : "non",
  };
  const [livraisonGratuite, setLivraisonGratuite] = useState(livraisonDefaut);

  let enStockDefaut = {
    value: produit.enStock ? "oui" : "non",
    label: produit.enStock ? "oui" : "non",
  };
  const [enStock, setEnStock] = useState(enStockDefaut);

  const [quantitéMinimale, setQuantitéMinimale] = useState(
    produit.quantiteMinimale
  );

  let categorieDefaut = {
    value: produit.categorie,
    label: produit.categorie,
  };
  const [categorie, setCategorie] = useState(categorieDefaut);

  let sousCategorieDefaut = {
    value: produit.sousCategorie,
    label: produit.sousCategorie,
  };
  const [sousCategorie, setSousCategorie] = useState(sousCategorieDefaut);

  let typesDefaut = produit.types.map((pro) => ({
    value: pro.type,
    label: pro.type,
  }));
  const [types, setTypes] = useState(typesDefaut);

  let prixDefaut = produit.types.map((pro) => pro.prix);
  const [prixTypes, setPrixTypes] = useState(prixDefaut);

  const [prixReference, setPrixReference] = useState(produit.prixReference);

  const [imageAsset, setImageAsset] = useState(produit.image);
  const [loader, setLoader] = useState(false);

  const [inputValue, setInputValue] = useState("");
  ///////////////// STATE FIN /////////////////

  ///////////////// OPTIONS DEBUT /////////////////
  let choixLivraison = ["oui", "non"];
  const optionsLivraison = choixLivraison.map((livraison) => ({
    value: livraison,
    label: livraison,
  }));

  let choixEnStock = ["oui", "non"];
  const optionsEnStock = choixEnStock.map((stock) => ({
    value: stock,
    label: stock,
  }));

  const optionsCategorie = categories.map((categorie) => ({
    value: categorie,
    label: categorie,
  }));

  const optionsSousCategorieGO = sousCategories1.map((souscategorie) => ({
    value: souscategorie,
    label: souscategorie,
  }));

  const optionsSousCategorieSO = sousCategories2.map((souscategorie) => ({
    value: souscategorie,
    label: souscategorie,
  }));
  ///////////////// OPTIONS FIN /////////////////

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        500, // max width
        500, // max height
        "JPEG", // format (can be PNG, JPEG, WEBP)
        90, // quality percentage
        0, // rotation
        (blob) => {
          resolve(blob);
        },
        "blob" // output type as blob
      );
    });

  const deleteImage = () => {
    const deleteRef = ref(storage, imageAsset);
    deleteObject(deleteRef).then(() => {
      setImageAsset(null);
      setLoader(false);
    });
  };

  async function uploadImage(e) {
    setLoader(true);

    const imageFile = e.target.files[0];

    const storageRef = ref(
      storage,
      `ImagesProduits/${Date.now()}-${imageFile.name}`
    );

    const image = await resizeFile(imageFile);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        toast.error(error);
        setTimeout(() => {
          setLoader(false);
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageAsset(downloadURL);
          setLoader(false);
        });
      }
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !nom ||
      !description ||
      !categorie ||
      !sousCategorie ||
      !prixReference ||
      !imageAsset ||
      !quantitéMinimale ||
      !livraisonGratuite
    ) {
      toast.error(" Tous les champs sont obligatoires sauf le type");
    } else {
      const types = transform();
      const data = {
        nom: nom.toLowerCase(),
        description: description,
        livraisonGratuite:
          String(livraisonGratuite.label) === "oui" ? true : false,
        enStock: String(enStock.label) === "oui" ? true : false,
        quantiteMinimale: Number(quantitéMinimale),
        categorie: String(categorie.label).toLowerCase(),
        sousCategorie: String(sousCategorie.label).toLowerCase(),
        types: types,
        prixReference: Number(prixReference),
        image: imageAsset,
        commentaires: [],
        favoris: [],
        createdAt: serverTimestamp(),
      };
      const dataToCheck = {
        ...data,
        description: undefined,
        image: undefined,
        commentaires: undefined,
        favoris: undefined,
        createdAt: undefined,
      };

      const jsonString = JSON.stringify(dataToCheck, null, 2);
      // console.log(data);
      Swal.fire({
        title: "Vérifier modification",
        html: `<pre style="text-align:left;font-size: 14px;">${jsonString}</pre>`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, tout est correct!",
        cancelButtonText: "J'annule",
        customClass: {
          popup: "format-pre",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          saveItem(data);
        }
      });
    }
  }

  async function saveItem(data) {
    toast.loading("Modification du produit en cours");
    const refProduit = doc(db, "produits", produit.id);

    try {
      await updateDoc(refProduit, data);
      toast.success("Produit modifié avec succès 😊");
      clearData();
    } catch (error) {
      toast.error(error);
    }
  }

  const clearData = () => {
    setNom("");
    setDescription("");
    setQuantitéMinimale("");
    setPrixReference("");
    setCategorie("");
    setImageAsset(null);
    setTypes([]);
    setInputValue("");
    setPrixTypes([]);
    setLivraisonGratuite("");
    setSousCategorie("");
    setEnStock("");
  };

  function transform() {
    // let arrayTypes = [];

    const newTypes = types.map((type) => type.value);
    const arr = newTypes.map((type, index) => ({
      type,
      prix: Number(prixTypes[index]),
    }));

    // Display the JSON string in a SweetAlert2 popup
    return arr;
  }
  const components = {
    DropdownIndicator: null,
  };
  const createOption = (label) => ({
    label,
    value: label,
  });
  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setTypes((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
    }
  };
  // console.log(livraisonGratuite);
  const handleInputChange = (index, value) => {
    const values = [...prixTypes];
    values[index] = value;
    setPrixTypes(values);
  };
  useEffect(() => {
    if (types.length > 0 && types.length !== prixTypes.length) {
      let index = types.length - 1;

      const values = [...prixTypes];
      values.splice(index, 1); // Remove the input at the given index
      setPrixTypes(values);
    }
    if (types.length < 1) {
      setPrixTypes([]);
    }
  }, [types.length]);

  return (
    <div>
      <div className="flex gap-5 p-2 items-center ">
        <Link to={"/admin/produits"} className="text-[26px] ml-2">
          <FaArrowCircleLeft />
        </Link>
        <h3 className="text-slate-500 font-semibold text-[20px] md:text-[26px] p-3">
          Modifier le produit
        </h3>
      </div>
      <hr />
      <div className=" h-full flex items-center justify-center flex-col my-4 ">
        <form
          action=""
          className="border  rounded shadow-md w-[95%] mx-auto  "
          onSubmit={handleSubmit}
        >
          <div className="flex items-center flex-col lg:flex-row justify-between gap-5">
            <div className="p-3 ml-3 basis-1/3">
              <p className="text-center mb-[10px] font-medium ">
                Image de produit
              </p>

              <label htmlFor="photo" className="">
                {!imageAsset ? (
                  <>
                    <div className=" border-dashed  cursor-pointer bg-slate-50 rounded-lg border border-bleu4 flex items-center justify-center flex-col  h-[300px] w-[300px] mx-auto mb-5">
                      {loader ? (
                        <SimpleLoader />
                      ) : (
                        <>
                          <BsFillCloudUploadFill className="text-[40px]" />
                          <p className="mt-2 text-[14px] font-medium">
                            Sélectionner une photo
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="photo"
                      className="hidden"
                      onChange={uploadImage}
                    />
                  </>
                ) : (
                  <div className=" relative w-fit mx-auto ">
                    <img
                      className="h-[200px] w-[200px] md:h-[300px] md:w-[300px] overflow-hidden object-cover mx-auto mb-5 rounded-md"
                      src={imageAsset}
                      alt=""
                    />
                    <div
                      className="bg-red-500 text-white p-2 w-fit rounded-full absolute right-6 bottom-6 cursor-pointer"
                      onClick={() => deleteImage()}
                    >
                      <MdDelete className="text-[24px]" />
                    </div>
                  </div>
                )}
              </label>
            </div>
            <div className="bg-slate-200 w-[1px] h-[600px] hidden lg:block" />{" "}
            <div className="p-2 py-5 mx-1 basis-2/3">
              <p className="text-center mb-[10px] font-medium ">
                Details sur le produit
              </p>
              {/* titre */}
              <div>
                <label
                  htmlFor=""
                  className="font-medium italic text-slate-500 "
                >
                  Nom du produit
                </label>
                <input
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  type="text"
                  id="nom"
                  className="outline-none border bg-slate-50 border-gray-300 rounded-md w-full py-2 mt-1 pl-2"
                />
              </div>
              {/* description */}
              <div className="my-3">
                <label
                  htmlFor=""
                  className="font-medium italic text-slate-500 "
                >
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  cols={40}
                  className="outline-none border bg-slate-50  border-gray-300 rounded-md w-full py-2 mt-1 pl-2"
                  name="description"
                  id=""
                ></textarea>
              </div>
              <div className="my-3 flex flex-col lg:flex-row gap-3 items-center">
                <div className="w-full ">
                  <label
                    htmlFor=""
                    className="font-medium italic text-slate-500 "
                  >
                    Livraison Gratuite
                  </label>
                  <Select
                    value={livraisonGratuite}
                    onChange={setLivraisonGratuite}
                    options={optionsLivraison}
                    className=" select-bordered bg-slate-50  font-sans text-[16px] "
                  />
                </div>
                <div className="w-full ">
                  <label
                    htmlFor=""
                    className="font-medium italic text-slate-500 "
                  >
                    En stock
                  </label>

                  <Select
                    value={enStock}
                    onChange={setEnStock}
                    options={optionsEnStock}
                    className="  select-bordered bg-slate-50  mt-1 font-sans text-[16px] "
                  />
                </div>
                <div className="w-full ">
                  <label
                    htmlFor=""
                    className="font-medium italic text-slate-500 "
                  >
                    Quantité Minimale
                  </label>

                  <input
                    value={quantitéMinimale}
                    onChange={(e) => setQuantitéMinimale(e.target.value)}
                    type="number"
                    name=""
                    id=""
                    className=" outline-none border bg-slate-50 border-gray-300 rounded-md w-full py-2 mt-1 pl-2"
                  />
                </div>
              </div>
              {/* categories */}
              <div className="my-3 flex  flex-col lg:flex-row gap-3 items-center">
                <div className=" w-full ">
                  <label
                    htmlFor=""
                    className="font-medium italic text-slate-500 "
                  >
                    Catégories
                  </label>{" "}
                  <Select
                    value={categorie}
                    onChange={setCategorie}
                    options={optionsCategorie}
                    placeholder="Categories"
                    className=" w-full select-bordered bg-slate-50 font-sans text-[16px] "
                  />
                </div>
                <div className="w-full  ">
                  <label
                    htmlFor=""
                    className="font-medium italic text-slate-500 "
                  >
                    Sous Catégories
                  </label>{" "}
                  <Select
                    value={sousCategorie}
                    onChange={setSousCategorie}
                    options={
                      categorie.label === "Gros oeuvre"
                        ? optionsSousCategorieGO
                        : categorie.label === "Second oeuvre"
                        ? optionsSousCategorieSO
                        : ""
                    }
                    placeholder="Categories"
                    className=" w-full select-bordered bg-slate-50 font-sans text-[16px] "
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-3">
                <div className="w-full  lg:basis-2/3">
                  <label
                    htmlFor=""
                    className="font-medium italic text-slate-500 "
                  >
                    Precisez tous les types
                  </label>
                  <CreatableSelect
                    className=""
                    components={components}
                    inputValue={inputValue}
                    isClearable
                    isMulti
                    menuIsOpen={false}
                    onChange={(newValue) => setTypes(newValue)}
                    onInputChange={(newValue) => setInputValue(newValue)}
                    onKeyDown={handleKeyDown}
                    value={types}
                  />{" "}
                </div>
                <div className="w-full  lg:basis-1/3 ">
                  <label
                    htmlFor=""
                    className="font-medium italic text-slate-500 "
                  >
                    Prix de référence
                  </label>{" "}
                  <input
                    value={prixReference}
                    onChange={(e) => setPrixReference(e.target.value)}
                    placeholder="Prix de référence"
                    type="number"
                    name=""
                    id=""
                    className="outline-none border bg-slate-50 border-gray-300 rounded-md w-full py-2 mt-1 pl-2"
                  />
                </div>
              </div>
              <br />
              {/* ////////////////////////////essaye */}
              <div className="grid grid-cols-3 gap-5 w-full ">
                {types.length > 0
                  ? types.map((type, index) => (
                      <label key={index}>
                        <p
                          htmlFor=""
                          className="font-medium italic text-slate-500 "
                        >
                          prix type {index + 1}
                        </p>
                        <input
                          value={prixTypes[index]}
                          // value={prixTypes.map((de) => de)}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          type="number"
                          placeholder={`prix du type ${index + 1}`}
                          className="outline-none border bg-slate-50 border-gray-300 rounded-md w-full py-2 mt-1 pl-2"
                        />
                      </label>
                    ))
                  : ""}
              </div>
              {/* prix */}
              <div className="flex justify-end mt-5">
                <input
                  type="submit"
                  value={"Enregistrer"}
                  className="bg-orange3 text-white rounded px-3 py-2 cursor-pointer text-right"
                />
              </div>
            </div>
            {/* image */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifierProduit;
