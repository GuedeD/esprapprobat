import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../config/firebase";
import { useState } from "react";
import { connexion } from "../../redux/espremium";

const ModifierNumero = () => {
  const { userInfo } = useSelector((state) => state.projet);
  const [numero, setNumero] = useState(userInfo?.numero);
  const dispatch = useDispatch();

  async function changeNumero(e) {
    e.preventDefault();
    if (!numero) {
      toast.error("Champ vide ❌");
    } else if (numero.length !== 10) {
      toast.error("Vérifiez votre numéro svp !");
    } else if (numero === userInfo.numero) {
      toast.error("Numéro inchangé");
    } else {
      const docRef = doc(db, "users", userInfo.id);
      try {
        await updateDoc(docRef, { numero: numero });
        dispatch(connexion({ ...userInfo, numero: numero }));
        toast.success("Numéro changé avec succès ✅");
      } catch (error) {
        toast.error(error.message);
      }
    }
  }
  return (
    <div className=" m-5 md:m-8 text-center ">
      <p className="text-lg md:text-[20px] font-semibold">
        Modifier mon numéro de téléphone actuel
      </p>
      <p className="py-2 text-sm md:text-base ">
        Associer une nouveau numéro à votre profil
      </p>
      <form className="w-full " onSubmit={changeNumero}>
        <div className="flex gap-4 items-center my-5">
          <label htmlFor="numero" className=" md:text-[18px]">
            +225
          </label>
          <input
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            id="numero"
            className="bg-slate-50 w-full p-3 rounded-md outline-none text-sm md:text-base"
            type="tel"
            placeholder="Saisissez votre nouveau numéro"
          />
        </div>
        <input
          className="w-full bg-orange3 text-white py-1 md:py-2 rounded-md text-[18px] cursor-pointer duration-500 transition-all hover:bg-bleu4 text-sm md:text-base "
          value={"Oui, je modifie"}
          type="submit"
        />
      </form>
    </div>
  );
};

export default ModifierNumero;
