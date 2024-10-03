// import BackToTop from "../components/Acceuil/BackToTop";
import { useQuery } from "@tanstack/react-query";
import Banner from "../components/Acceuil/Banner";
import Banner2 from "../components/Acceuil/Banner2";
import Categories from "../components/Acceuil/Categories";
import Experience from "../components/Acceuil/Experience";
import Newsletter from "../components/Acceuil/Newsletter";
import Recents from "../components/Acceuil/Recents";
import SecondOeuvre from "../components/Acceuil/SecondOeuvre";
import { recuperImages } from "../utils/hooks";

const Home = () => {
  const {
    data: allImages,
    error,
    isLoading,
    refetch: refreshImages,
  } = useQuery({
    queryKey: ["allImages"],
    queryFn: recuperImages,
    staleTime: 60 * 60 * 500,
    enabled: true,
  });
  return (
    <div className="relative">
      {/* <BackToTop /> */}
      <Banner allImages={allImages} />
      <Recents />
      <Banner2 />
      <Experience />
      <Categories allImages={allImages} />
      <SecondOeuvre />
      <Newsletter />
    </div>
  );
};

export default Home;
