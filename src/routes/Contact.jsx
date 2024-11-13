import { useState } from "react";
import { MdPhoneInTalk } from "react-icons/md";
import { MdOutlineAttachEmail } from "react-icons/md";
import ImgContact from "../assets/Images/contact/contact4.jpg";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const Contact = () => {
  const [sujet, setSujet] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");

  function sendEmail(e) {
    e.preventDefault();
    if (!sujet || !number || !email || !nom || !message) {
      toast.error(" Tous les champs sont obligatoires !");
    } else {
      const templateParams = {
        user_subject: sujet,
        user_fullName: nom,
        user_message: message,
        user_phoneNumber: number,
        user_email: email,
      };

      const templateId = "template_rc7v9dt";
      const serviceID = "service_pukiqwq";
      const publicKEY = "68pXeZCvBI2EfIOS_";

      emailjs.send(serviceID, templateId, templateParams, publicKEY).then(
        () => {
          toast.success("Merci de nous avoir contacté 😊 ");
          setNom("");
          setEmail("");
          setNumber("");
          setMessage("");
          setSujet("");
        },
        (error) => {
          toast.error("FAILED...", error);
        }
      );
    }
  }
  return (
    <div>
      <div className="relative before:inset-0 before:absolute before:bg-black before:opacity-65 ">
        <img
          src={ImgContact}
          className="object-cover h-[200px] md:h-[250px] w-full "
          alt=""
        />
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[20px] text-nowrap md:text-[30px] uppercase font-semibold ">
          Contactez-Nous
        </p>
      </div>
      <div className="mx-auto max-w-[95%]  md:max-w-[85%] flex  mt-10 mb-16 gap-[50px] lg:gap-[100px] flex-col lg:flex-row  ">
        <div className="flex-1 ">
          <p className="uppercase text-orange3 font-medium mt-2 ">
            Contactez nous par email
          </p>
          <h4 className="font-sans2 font-black text-[25px] md:text-[30px] -tracking-[0.5px] mt-[2px] mb-8 ">
            Nous sommes à votre écoute
          </h4>
          <form className="space-y-4" onSubmit={sendEmail}>
            <div className="flex justify-between gap-7 ">
              <input
                type="text"
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
                placeholder="Le Sujet"
                className="bg-bleu4 w-full p-3  rounded text-white outline-none"
              />
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                type="number"
                placeholder="Votre Numéro"
                className="bg-bleu4 w-full  p-3 rounded text-white"
              />
            </div>
            <div className="flex justify-between gap-7 ">
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Votre Nom Complet"
                className="bg-bleu4 w-full p-3  rounded text-white outline-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre Email"
                className="bg-bleu4 w-full p-3  rounded text-white outline-none"
              />
            </div>
            <textarea
              value={message}
              rows={6}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre Message"
              id=""
              className="bg-bleu4 w-full p-3  rounded text-white outline-none"
            ></textarea>
            <input
              type="submit"
              className="bg-orange3 text-white rounded px-[20px] py-[10px] font-medium cursor-pointer hover:bg-bleu4 transition-all duration-500 outline-none "
              value={"ENVOYER VOTRE MESSAGE"}
            />
          </form>
        </div>
        <div>
          <p className="uppercase text-orange3 font-medium mt-2 ">
            besoin d&apos;aide?
          </p>
          <h4 className="font-sans2 font-black text-[25px] md:text-[30px] -tracking-[0.5px] mt-[2px] mb-4 lg:mb-8 ">
            Restez en contact avec nous
          </h4>
          <p className=" max-w-[450px] mb-5 leading-[1.7]  ">
            Vous avez une suggestion à nous faire ? votre expérience
            d&apos;achat à nous raconter ou quel que soit le sujet,
            n&apos;hésitez pas à nous contacter.
          </p>

          <div className="space-y-5 ">
            <div className="flex gap-2 items-center">
              <p className="bg-orange3 text-white p-4 text-[25px] rounded ">
                <MdPhoneInTalk />
              </p>

              <div className="space-y-1 ">
                <p className="font-medium text-[17px] -tracking-[0.5px]  ">
                  Avez-vous une question ?{" "}
                </p>
                <p>+225 0500769696</p>
              </div>
            </div>
            <div className="flex  gap-2 items-center">
              <p className="bg-orange3 text-white p-4 text-[25px] rounded ">
                <MdOutlineAttachEmail />
              </p>
              <div>
                <p className="font-medium text-[17px] -tracking-[0.5px]  ">
                  Envoyez nous un email{" "}
                </p>
                <p>approbatesp@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
