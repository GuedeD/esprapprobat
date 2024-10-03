import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Addresse = () => {
  const { userInfo } = useSelector((state) => state.projet);
  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row gap-2 justify-between p-2 items-center ">
        <h3 className=" font-semibold text-lg md:text-[20px] ">
          Votre adresse de livraison
        </h3>
        <Link
          to={"/profil/adresse/creer"}
          className="uppercase bg-orange3 rounded-md text-white text-[14px] px-3 py-2 hover:bg-bleu4 duration-500 transition-all "
        >
          ajouter une adresse
        </Link>
      </div>
      <hr />
      <div className=" flex items-center justify-center mt-10 ">
        <div className="border rounded-md ">
          <div className="text-nowrap text-[14px] py-4 px-8 space-y-2 ">
            <p className=" text-[18px] uppercase ">{userInfo?.nomComplet} </p>
            <p>{userInfo?.adresse.district}</p>
            {userInfo?.adresse.commune && (
              <p>
                {userInfo?.adresse.commune} - {userInfo?.adresse.adresse}
              </p>
            )}
            <p>+225 {userInfo?.numero} </p>
          </div>
          <hr />
          <p className="uppercase pl-5 p-3 text-[14px] text-bleu4≤ ">
            votre adresse par défault
          </p>
        </div>
      </div>
    </div>
  );
};

export default Addresse;
