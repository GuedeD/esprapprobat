import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { connexion } from "../redux/espremium";
import { doc, getDoc } from "firebase/firestore";

const Connexion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwoldRevealed, setPasswoldRevealed] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  async function signIn(e) {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        toast.success("Bon retour 👋🏾");
        const docRef = doc(db, "users", res.user.uid);
        const data = await getDoc(docRef);
        // console.log(data);
        const user = data.data();
        // const userInfo = {
        //   id: user.uid,
        //   fullName: user.displayName,
        //   photo: user.photoURL,
        //   email: user.email,
        //   emailVerified: user.emailVerified,
        //   role: "client",
        // };
        const userInfo = {
          id: res.user.uid,
          nomComplet: user.nomComplet,
          numero: user.numero,
          adresse: user.adresse,
          idArticlesAchetes: user.idArticlesAchetes,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        };
        dispatch(connexion(userInfo));
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }

  function showHidePassword() {
    setPasswordType(passwoldRevealed ? "password" : "text");
    setPasswoldRevealed(!passwoldRevealed);
  }

  return (
    <div className="mx-auto max-w-[80%] text-bleu4 text-center   h-full  py-10 ">
      <h1 className=" text-[20px] pt-5 md:mt-0 md:text-[30px] font-semibold ">
        Bienvenue chez Approbat
      </h1>
      <p className=" text-[14px] md:text-base py-5 font-medium">
        Saisissez vos informations pour vous connecter, si vous avez déjà un
        compte ici.
      </p>

      <form className="  text-left max-w-[500px] mx-auto" onSubmit={signIn}>
        <div>
          <label htmlFor="" className="font-medium text-[14px] md:text-base">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="outline-none border border-gray-300 rounded-md w-full py-2 mt-1 pl-2 placeholder:text-[14px] md:placeholder:text-[16px]
            "
            placeholder="Entrez votre email"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="font-medium text-[14px] md:text-base">
            Mot de passe
          </label>
          <div className="flex items-center">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={passwordType}
              className="outline-none border border-gray-300 rounded-md w-full py-2 mt-1 pl-2 placeholder:text-[14px] md:placeholder:text-[16px] "
              placeholder="Entrez votre mot de passe"
            />
            {!passwoldRevealed ? (
              <IoMdEye
                className="text-[20px] -ml-8 cursor-pointer"
                onClick={() => showHidePassword()}
              />
            ) : (
              <IoMdEyeOff
                className="text-[20px] -ml-8 cursor-pointer"
                onClick={() => showHidePassword()}
              />
            )}
          </div>
        </div>
        <p className="my-[16px]  text-right font-medium  text-[14px] md:text-base ">
          <Link to={"/mdpoublie"}>Mot de passe oublié ? </Link>
        </p>
        <input
          className="bg-orange3 text-white font-medium w-full  py-2 rounded-md cursor-pointer "
          type="submit"
          value={"Connexion"}
        />

        <p className="text-center mt-5   text-[14px] md:text-base">
          Vous n'avez pas de compte ?{" "}
          <Link to={"/enregistrer"} className="text-orange3 font-medium">
            Enregistrez-vous
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Connexion;
