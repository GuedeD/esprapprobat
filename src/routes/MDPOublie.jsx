import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";

const MDPOublie = () => {
  const [email, setEmail] = useState("");

  async function resetPasswordFn(e) {
    e.preventDefault();

    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      auth.languageCode = "fr";
      await sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success("Vérifiez votre mail");
          setEmail("");
          // ..
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      toast.error("Cet email n'existe pas ");
    }
  }

  return (
    <div className="mx-auto max-w-[80%] text-center h-full py-10 ">
      <h1 className="text-[20px] pt-5 pb-2 md:mt-0 md:text-[30px]  font-semibold">
        Réinitialiser Votre Mot de Passe{" "}
      </h1>
      <p className="text-[14px] md:text-base">
        Nous vous enverrons un email pour réinitialiser votre mot de passe.
      </p>
      <form
        className=" text-left max-w-[500px] mx-auto py-[20px]"
        onSubmit={resetPasswordFn}
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="outline-none border border-gray-300 rounded-md w-full py-2 mt-1 pl-2 placeholder:text-[14px] md:placeholder:text-[16px]
        "
          placeholder="Entrez votre email"
        />
        <input
          className="hover:bg-bleu4 bg-orange3 transition-all duration-500 text-white font-medium mt-4 w-full  py-2 rounded-md cursor-pointer "
          type="submit"
          value={"Reset"}
        />
      </form>
    </div>
  );
};

export default MDPOublie;
