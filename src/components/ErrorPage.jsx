import React from "react";
import { Link, useNavigate, useRouteError } from "react-router-dom";
import Lottie from "lottie-react";
import Error from "../assets/Images/animation/404.json";
import { FaArrowCircleLeft } from "react-icons/fa";
const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  return (
    <div className="max-w-[80%] my-10 mx-auto text-center  flex items-center justify-center  ">
      <div>
        <div className="flex items-center h-full w-full justify-center">
          <Lottie animationData={Error} loop={true} className="w-lg:[500px]" />
        </div>
        <p className=" text-[30px] -mt-10 relative ">
          Erreur : <span className="font-bold">{error.status}</span>
        </p>

        <p className="my-3">{error.data}</p>
        <div className="flex items-center justify-center mb-5 ">
          <button
            onClick={() => navigate("/")}
            className="bg-orange3 p-2 flex items-center  text-white font-medium  gap-3 rounded-md "
          >
            <FaArrowCircleLeft className="text-[20px] " />

            <span>Retour à la page d'acceuil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
