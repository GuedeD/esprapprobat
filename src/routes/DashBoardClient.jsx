import { TiEdit } from "react-icons/ti";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashBoardClient = () => {
  const { userInfo } = useSelector((state) => state.projet);
  return (
    <div>
      <h3 className="p-2 font-semibold text-lg text-md:[20px] ">
        Votre compte
      </h3>
      <hr />
      <div className="flex flex-col md:flex-row px-4  gap-5 mt-5 p-3">
        <div className="border rounded-md flex-1 ">
          <p className="uppercase font-medium p-2 text-[18px]">
            Informations personnelles
          </p>
          <hr />
          <div className="p-2 text-[14px]">
            <p className="capitalize ">{userInfo?.nomComplet}</p>
            <p>{userInfo?.email}</p>
          </div>
        </div>
        <div className="border rounded-md flex-1">
          <p className="flex justify-between items-center p-2">
            <span className="font-medium text-[18px] ">ADRESSE</span>
            <Link to={"/profil/adresse/creer"}>
              <TiEdit className="text-orange3 text-[30px] " />
            </Link>
          </p>
          <hr />
          <p className="p-2">Adresse par défault : </p>
          <div className="pl-2 text-nowrap text-[14px] pb-4 capitalize ">
            <p> {userInfo?.adresse.district}</p>
            {userInfo?.adresse.commune && (
              <p>
                {userInfo?.adresse.commune} -{userInfo?.adresse.adresse}
              </p>
            )}
            <p>+225 {userInfo?.numero}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardClient;
