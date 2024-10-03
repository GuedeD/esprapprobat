import { Link } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { communesAbidjan } from "../../utils/constants";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { connexion } from "../../redux/espremium";
import toast from "react-hot-toast";

const AMAdresse = () => {
  const { userInfo } = useSelector((state) => state.projet);
  const dispatch = useDispatch();

  let communeDefaut = {
    value: userInfo?.adresse.commune,
    label: userInfo?.adresse.commune,
  };

  let districtDefaut = {
    value: userInfo?.adresse.district,
    label: userInfo?.adresse.district,
  };

  const [adresse, setAdresse] = useState(userInfo?.adresse.adresse || "");
  const [district, setDistrict] = useState(
    districtDefaut.value ? districtDefaut : ""
  );
  const [commune, setCommune] = useState(
    communeDefaut.value ? communeDefaut : ""
  );

  async function applyChange(e) {
    e.preventDefault();
    if (!adresse || !district || !commune) {
      toast.error(" Tous les champs sont obligatoires !");
    } else {
      const userRef = doc(db, "users", userInfo.id);

      let adresseClient = {
        district: district.label,
        commune: commune.label,
        adresse: adresse,
      };
      try {
        await updateDoc(userRef, {
          adresse: adresseClient,
        });
        dispatch(
          connexion({
            ...userInfo,
            adresse: adresseClient,
          })
        );
        toast.success("Adresse modifiée avec succès ✅");
        setDistrict("");
        setCommune("");
        setAdresse("");
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  let choixDistrict = ["District Autonome d'Abidjan"];
  const options1 = choixDistrict.map((el) => ({
    value: el,
    label: el,
  }));

  const options2 = communesAbidjan.map((el) => ({
    value: el.commune,
    label: el.commune,
  }));

  return (
    <div className="h-full">
      <div className="flex gap-5 p-2 items-center ">
        <Link to={"/profil/adresse"} className="text-[24px] ml-5">
          <FaArrowCircleLeft />
        </Link>
        <h3 className=" font-semibold text-lg text-md:[20px] ">
          Modifier votre adresse
        </h3>
      </div>
      <hr />
      <div className=" ">
        <form className="p-3 space-y-6 grid " onSubmit={applyChange}>
          <div className="flex flex-col xl:flex-row gap-4 lg:gap-7 ">
            <Select
              value={district}
              onChange={setDistrict}
              options={options1}
              placeholder="Précisez votre district"
              className=" xl:min-w-[300px] text-nowrap  select-bordered bg-slate-50 font-sans text-sm md:text-base "
            />
            <Select
              value={commune}
              onChange={setCommune}
              options={options2}
              placeholder="Précisez votre commune"
              className=" xl:min-w-[300px] text-nowrap  select-bordered bg-slate-50 font-sans text-sm md:text-base "
            />
          </div>
          <div>
            <input
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              type="text"
              className="w-full outline-none border bg-slate-50 rounded pl-4 py-2 text-sm md:text-base "
              placeholder="Precisez l'adresse exacte de livraison"
            />
          </div>
          <hr />
          <div className=" flex justify-end ">
            <input
              type="submit"
              value={"ENREGISTRER"}
              className="bg-orange3 rounded-md px-4 py-2 text-white cursor-pointer hover:bg-bleu4 transition-all duration-500 md:mt-3 font-medium"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AMAdresse;
