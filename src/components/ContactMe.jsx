const ContactMe = ({ children }) => {
  const phoneNumber = "+2250777646389";
  const message =
    "Bonjour Guede Dema ! Je vous écris au sujet des services que vous proposez."; // The message you want to pre-fill

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <button
      onClick={() => window.open(whatsappURL, "_blank")}
      className="underline"
    >
      {children}
    </button>
  );
};

export default ContactMe;
