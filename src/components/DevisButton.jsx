import { LiaWhatsapp } from "react-icons/lia";

const DevisButton = () => {
  const phoneNumber = "+2250500769696";
  const message =
    "Bonjour Approbat, je vous écris concernant une demande de devis"; // The message you want to pre-fill

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <button
      onClick={() => window.open(whatsappURL, "_blank")}
      className="flex items-center justify-center rounded flex-1 bg-green-500 text-white font-medium shadow-md py-1 gap-2 hover:bg-green-600 duration-300 transition-all text-[14px] md:text-base "
    >
      <LiaWhatsapp className="text-[35px]" />
      <span> Demander un devis</span>
    </button>
  );
};

export default DevisButton;
