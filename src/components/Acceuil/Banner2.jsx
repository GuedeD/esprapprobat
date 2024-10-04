import Sanstitre from "../../assets/Images/Sanstitre.jpg";

const Banner2 = () => {
  return (
    <div className="-my-[30px] md:-my-0 ">
      <img
        src={Sanstitre}
        className="h-[90px]  md:h-[120px] md:object-cover  lg:h-[200px] md:w-full  "
        alt=""
      />
    </div>
  );
};

export default Banner2;
