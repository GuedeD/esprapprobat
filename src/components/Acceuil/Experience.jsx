import { CiDeliveryTruck } from "react-icons/ci";
import { MdOutlineSupportAgent } from "react-icons/md";
import { CiMoneyBill } from "react-icons/ci";

const Experience = () => {
  return (
    <section className="mx-auto md:max-w-[85%] max-w-[95%]  ">
      <h2 className="text-[22px] md:text-[26px] ">
        Nous vous offrons la meilleure des expériences{" "}
      </h2>
      <div className="grid grid-cols-3 md:gap-10">
        <div className="flex flex-col items-center">
          <p className="bg-bleu4 text-white rounded-full p-3">
            <CiDeliveryTruck className="text-[35px] md:text-[70px]" />
          </p>
          <p className="mt-2 font-medium text-center text-sm md:text-base">
            Livraison partout en Côte d&apos;Ivoire
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="bg-bleu4 text-white rounded-full p-3">
            <CiMoneyBill className="text-[35px] md:text-[70px]" />
          </p>
          <p className="mt-2 font-medium text-center text-sm md:text-base">
            Paiement à la livraison
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="bg-bleu4 text-white rounded-full p-3">
            <MdOutlineSupportAgent className="text-[35px] md:text-[70px]" />
          </p>
          <p className="mt-2 text-center font-medium text-sm md:text-base">
            Support après votre achat
          </p>
        </div>
      </div>
    </section>
  );
};

export default Experience;
