import { format } from "date-fns";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { FcCalendar } from "react-icons/fc";
import { db } from "../../config/firebase";
import { compareAsc } from "date-fns";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { startOfTomorrow } from "date-fns";
import { FaDeleteLeft } from "react-icons/fa6";
import { getCoupons } from "../../utils/hooks";
import { useQuery } from "@tanstack/react-query";

const Coupons = () => {
  const [nom, setNom] = useState("");
  const [reduction, setReduction] = useState("");
  // const [coupons, setCoupons] = useState([]);
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(startOfTomorrow());
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      compareAsc(dateFin, dateDebut) === -1 ||
      compareAsc(dateFin, dateDebut) === 0
    ) {
      setDateDebut(new Date());
      setDateFin(startOfTomorrow());
      // console.log(dateDebut.getDate());
      toast.error("Les dates choisies ne sont pas correctes");
    } else if (!nom || !dateDebut || !daterigin || !reduction) {
      toast.error("Certains champs sont vides ");
    } else if (Number(reduction) < 1 || Number(reduction) > 100) {
      toast.error("la réduction doit être comprise entre 1 et 100%");
    } else {
      const couponRef = collection(db, "coupons");

      try {
        const newCoupon = {
          nom: nom.toUpperCase(),
          dateDebut: dateDebut,
          dateFin: dateFin,
          reduction: Number(reduction),
        };
        await addDoc(couponRef, newCoupon);

        toast.success(`Coupon ${nom} crée`);
        clearData();
        refreshCoupons();
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const clearData = () => {
    setNom("");
    setDateDebut(new Date());
    setDateFin(startOfTomorrow());
    setReduction("");
  };

  async function deleteCoupon(id) {
    const docRef = doc(db, "coupons", id);
    try {
      await deleteDoc(docRef);
      toast.success("Coupon supprimée");
      refreshCoupons();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const {
    data: coupons,
    error,
    isLoading,
    refetch: refreshCoupons,
  } = useQuery({
    queryKey: ["allCoupons"],
    queryFn: getCoupons,
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
  // console.log(coupons);

  if (error) {
    return (
      <section className="flex justify-center items-center h-full">
        <p>Une erreur s'est produite lors de la récupération des données </p>
      </section>
    );
  }

  return (
    <div>
      <h3 className="text-bleu4 font-semibold text-[20px] md:text-[26px] p-3">
        Coupons{" "}
      </h3>
      <hr />

      <div className="border rounded m-2 md:m-5 p-2 px-4 ">
        <h4 className=" md:text-[18px] pt-2 pb-4 font-medium ">
          Créer un coupon
        </h4>
        <form className=" space-y-5" onSubmit={handleSubmit}>
          <div className="flex">
            <label
              className="bg-bleu4 p-2 px-5 text-sm md:text-[18px]  rounded-l-md text-white"
              htmlFor=""
            >
              Code
            </label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              type="text"
              className="outline-none border rounded-r w-full pl-2 text-sm md:text-base  "
              placeholder="Entrez le code du coupon"
            />
          </div>
          <div className="flex items-center">
            <label className="bg-bleu4 p-2 px-5  text-sm md:text-[18px] rounded-l-md text-white">
              Réduction
            </label>
            <input
              placeholder="Pourcentage de réduction"
              type="number"
              className="outline-none text-sm md:text-base  border w-full p-2 rounded-r "
              value={reduction}
              onChange={(e) => setReduction(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-[10px] lg:flex-row lg:gap-[30px]  lg:items-center items-start ">
            <div>
              <fieldset className="w-[5pusn0px] md:w-[120px] border-[1.5px] p-2 rounded border-bleu4">
                <legend
                  className="px-3 text-[14px] text-bleu4 font-medium "
                  htmlFor=""
                >
                  Date de début
                </legend>
                <div className="flex items-center text-sm md:text-[18px] ml-2 h-full gap-4 ">
                  <FcCalendar className="text-[25px] md:text-[35px]  " />
                  <DatePicker
                    selected={dateDebut} ////
                    onChange={(date) => setDateDebut(date)}
                    selectsStart /////
                    value={format(dateDebut, "dd/MM/yyyy")}
                    className=" outline-none  py-2"
                    startDate={dateDebut} ////
                    endDate={dateFin} ////
                    minDate={new Date()} ////
                  />
                </div>
              </fieldset>
            </div>
            <div>
              <fieldset className="w-[50px] md:w-[12 ri0px] border-[1.5px] p-2 rounded border-bleu4">
                <legend
                  htmlFor=""
                  className="px-3 text-[14px] text-bleu4 font-medium "
                >
                  Date de fin
                </legend>
                <div className="flex items-center text-sm md:text-[18px] ml-2 h-full gap-4 ">
                  <FcCalendar className=" text-[25px] md:text-[35px]  " />

                  <DatePicker
                    selected={dateFin} //////
                    onChange={(date) => setDateFin(date)}
                    value={format(dateFin, "dd/MM/yyyy")}
                    className=" outline-none   py-2"
                    selectsEnd ////
                    startDate={dateDebut} /////
                    endDate={dateFin} //////
                    minDate={startOfTomorrow()} /////
                  />
                </div>
              </fieldset>
            </div>
          </div>
          <p className="my-3">
            <input
              type="submit"
              className="cursor-pointer text-white bg-orange3 my-2 text-sm md:text-base rounded p-2 px-3 font-medium"
              value={"Créer le coupon"}
            />
          </p>
        </form>
      </div>

      <div className="border rounded m-5 p-2 px-4  ">
        <h4 className=" text-[18px] pt-2 pb-4 font-medium ">Voir coupons</h4>
        {coupons?.length > 0 ? (
          <div>
            <table className="border w-full hidden md:table">
              <thead>
                <tr className="border ">
                  <th className="p-2">Nom</th>
                  <th>Réduction</th>
                  <th>Début</th>
                  <th>Fin</th>
                  <th>Action</th>
                </tr>
              </thead>
              {coupons?.map((coupon, index) => (
                <tbody key={index}>
                  <tr className="border odd:bg-gray-100">
                    <td className="text-center py-4 font-medium ">
                      {coupon.nom}
                    </td>
                    <td className="text-center">{coupon.reduction}%</td>
                    <td className="text-center">
                      {format(coupon.dateDebut.toDate(), "dd/MM/yyyy")}
                    </td>
                    <td className="text-center">
                      {format(coupon.dateFin.toDate(), "dd/MM/yyyy")}
                    </td>
                    <td>
                      <p className="transition-all duration-500 hover:text-red-500 text-[26px] cursor-pointer ">
                        <FaDeleteLeft
                          className="mx-auto"
                          onClick={() => deleteCoupon(coupon.id)}
                        />
                      </p>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>

            <div className="text-center mt-2 md:hidden ">
              <hr className="mb-2" />
              <span className="  text-[40px]">⚠️</span>
              <p className="text-sm md:text-lg">
                Pour voir les coupons, connectez vous sur un appareil d'au moins
                <span className="font-semibold"> 7 pouces !</span>{" "}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p>Pas de coupons !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;
