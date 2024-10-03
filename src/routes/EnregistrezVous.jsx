import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { BsHandIndexThumb } from "react-icons/bs";
import { connexion } from "../redux/espremium";

const EnregistrezVous = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmedPhoneNumber, setConfirmedPhoneNumber] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function register(e) {
    e.preventDefault();
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmedPassword ||
      !phoneNumber ||
      !confirmedPhoneNumber
    ) {
      toast.error("Tous les champs sont obligatoires");
    } else if (password !== confirmedPassword) {
      toast.error("Pas de correspondance : Mot de passe");
    } else if (phoneNumber !== confirmedPhoneNumber) {
      toast.error("Pas de correspondance : Numéro");
    } else if (
      phoneNumber.length !== 10 ||
      confirmedPhoneNumber.length !== 10
    ) {
      toast.error("Véfifiez votre numéro");
    } else {
      const usersCollection = collection(db, "users");

      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.loading("Création de profil en cours");
        auth.languageCode = "fr"; // Set the language to French

        await createUserWithEmailAndPassword(auth, email, password)
          .then(async (res) => {
            console.log(res);
            const user = res.user;
            // // // console.log(user);
            await updateProfile(user, {
              displayName: fullName,
            });

            await sendEmailVerification(user);
            toast.success("Vérifiez votre email ✉️");
            const userInfo = {
              nomComplet: user.displayName,
              numero: phoneNumber,
              adresse: {},
              idArticlesAchetes: [],
              email: user.email,
              emailVerified: user.emailVerified,

              role: "client",
              createdAt: serverTimestamp(),
            };
            const docRef = doc(db, "users", user.uid);
            await setDoc(docRef, userInfo);
            dispatch(connexion({ ...userInfo, id: user.uid }));
            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmedPassword("");
            setPhoneNumber("");
            setConfirmedPhoneNumber("");
            setTimeout(() => {
              navigate("/");
            }, 1000);
          })
          .catch((err) => {
            if (
              err.message === "Firebase: Error (auth/email-already-in-use)."
            ) {
              toast.error("Ce compte existe déjà");
            } else {
              toast.error(err.message);
            }
          });
      } else {
        toast.error("Ce compte existe déjà");
      }
    }
  }

  return (
    <div className="mx-auto max-w-[80%] text-center ">
      <h1 className="my-2  text-[30px] font-semibold pt-[40px]">
        Enregistrez-Vous
      </h1>
      <p className="">
        Bienvenue, veuillez bien renseignez des{" "}
        <span className="font-semibold underline  ">
          informations correctes
        </span>{" "}
        svp !{" "}
      </p>
      <form
        className=" text-left max-w-[600px] mx-auto py-[20px]"
        onSubmit={register}
      >
        <div>
          <label htmlFor="" className="font-medium">
            Nom Complet{" "}
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="name"
            className="outline-none border border-gray-300 rounded-md w-full py-2 mt-1 pl-2
            "
            placeholder="Entrez votre nom complet"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="font-medium">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="outline-none border border-gray-300 rounded-md w-full py-2 mt-1 pl-2
            "
            placeholder="Entrez votre email"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-3">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="outline-none border border-gray-300 rounded-md w-full py-2 mt-1 pl-2"
              placeholder="Entrez votre mot de passe"
            />
            <input
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              type="password"
              className="outline-none border border-gray-300 rounded-md w-full py-2 mt-1 pl-2"
              placeholder="Confirm your Password"
            />
          </div>
        </div>
        <div className="relative before:absolute before:w-full before:bg-black before:h-[1px] before:top-1/2 text-center before:left-0 my-3  w- text-black after:absolute after:w-[200px] after:bg-white before:-z-20 after:-z-10  after:h-full after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 font-medium">
          <p className="flex justify-center items-center gap-2 text-orange3">
            <span>Votre numéro actif</span>
            <BsHandIndexThumb className=" rotate-180 text-[25px] " />
          </p>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="tel"
              className="outline-none border border-gray-300 rounded-md w-full py-2 mt-1 pl-2"
              placeholder="Entrez votre numéro"
            />
            <input
              value={confirmedPhoneNumber}
              onChange={(e) => setConfirmedPhoneNumber(e.target.value)}
              type="password"
              className="outline-none border border-gray-300 rounded-md w-full py-2 mt-1 pl-2"
              placeholder="Confirmez votre numéro"
            />
          </div>
        </div>
        <input
          className="bg-orange3 text-white font-medium mt-4 w-full  py-2 rounded-md cursor-pointer "
          type="submit"
          value={"Sauvegarder"}
        />
      </form>
    </div>
  );
};

export default EnregistrezVous;
