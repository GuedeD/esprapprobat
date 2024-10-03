import { CiCircleChevRight } from "react-icons/ci";
// import { Link } from "react-router-dom";
import { FaRegHandPointRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Categories = ({ allImages }) => {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-[95%] md:max-w-[85%] ">
      <h2 className="text-[22px] md:text-[26px] ">Explore Les Catégories</h2>
      <div className="containerGrid grid grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4 lg:gap-5 	">
        <div className="relative  lg:col4   ">
          <img
            src={allImages?.categorie1}
            className="rounded-md h-[200px] md:h-[300px] 
              w-full object-cover "
            alt=""
          />
          <div className="category " onClick={() => navigate("/boutique")}>
            <p>Granulat</p>
            <CiCircleChevRight className="text-[28px]  " />
          </div>
        </div>

        <div className="relative lg:col3 ">
          <img
            src={allImages?.categorie2}
            className="rounded-md h-[200px] md:h-[300px] w-full  object-cover"
            alt=""
          />
          <div className="category " onClick={() => navigate("/boutique")}>
            <p>Acier</p>
            <CiCircleChevRight className="text-[28px]  " />
          </div>
        </div>

        <div className="relative lg:col2 ">
          <img
            src={allImages?.categorie3}
            className="rounded-md h-[200px] w-full md:h-[300px] lg:h-[620px] object-cover"
            alt=""
          />
          <div className="category " onClick={() => navigate("/boutique")}>
            <p>Boiserie</p>
            <CiCircleChevRight className="text-[28px]  " />
          </div>
        </div>

        <div className="relative lg:col1 ">
          <img
            src={allImages?.categorie4}
            className="rounded-md h-[200px] md:h-[300px]  w-full object-cover"
            alt=""
          />
          <div className="category " onClick={() => navigate("/boutique")}>
            <p>Agglos </p>
            <CiCircleChevRight className="text-[28px]  " />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
