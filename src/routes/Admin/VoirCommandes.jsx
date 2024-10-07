import { useQuery } from "@tanstack/react-query";
import { recuperCommandes } from "../../utils/hooks";
import { format } from "date-fns";
import { frCA } from "date-fns/locale";
import InvoiceBill from "../../components/pdf/InvoiceBill";
import InvoiceNo from "../../components/pdf/InvoiceNo";
import InvoiceTable from "../../components/pdf/InvoiceTable";
import Logo from "../../assets/Images/logo-no-bg.png";
import { FaFilePdf } from "react-icons/fa";
import Lottie from "lottie-react";
import Pagination from "rc-pagination/lib/Pagination";
import ZeroPurchase from "../../assets/Images/animation/EmptyOrder.json";
import Aloading from "../../assets/Images/animation/ALoading.json";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import toast from "react-hot-toast";
import { useState } from "react";

const styles = StyleSheet.create({
  page: {
    padding: 20, // Add padding around the page
  },
  mainHeader: {
    display: "flex",
    flexDirection: "row", // Arrange APPROBAT text and logo in a row
    justifyContent: "", // Push the logo and text to the edges
    alignItems: "center", // Vertically center the text and logo
    marginBottom: 20, // Add margin between the header and the rest
  },
  approbatText: {
    fontSize: 30, // Make APPROBAT text larger
    fontWeight: "bold", // Make it bold
  },
  logo: {
    width: 50, // Set the logo size
    height: 50, // Keep it square
  },
  section: {
    marginBottom: 20, // Margin between each section of the page
  },
});

const InvoiceComponent = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Main header */}
        <View style={styles.mainHeader}>
          <Text style={styles.approbatText}>APPROBAT</Text>
          <Image style={styles.logo} src={Logo} />
        </View>

        {/* Invoice sections with margin between */}
        <View style={styles.section}>
          <InvoiceNo data={data} />
        </View>
        <View style={styles.section}>
          <InvoiceBill data={data} />
        </View>
        <View style={styles.section}>
          <InvoiceTable data={data} />
        </View>
      </Page>
    </Document>
  );
};

const VoirCommandes = () => {
  function formatNumberWithDots(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  async function changeState(e, id) {
    const docRef = doc(db, "commandes", id);
    try {
      await updateDoc(docRef, { status: e.target.value });
      toast.success("Statut mis à jour ✅");
      refreshCommands();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const {
    data: allCommandes,
    error,
    isLoading,
    refetch: refreshCommands,
  } = useQuery({
    queryKey: ["allCommandes"],
    queryFn: recuperCommandes,
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = allCommandes?.slice(startIdx, endIdx);

  if (error) {
    return (
      <section className="flex justify-center items-center h-full">
        <p>Une erreur s'est produite lors de la récupération des données </p>
      </section>
    );
  }

  return (
    <div className="h-ful  ">
      <h3 className="text-bleu4 font-semibold text-[20px] md:text-[26px] p-3">
        Voir les commandes
      </h3>
      <hr />
      {isLoading ? (
        <div className="flex items-center h-full w-full justify-center">
          <Lottie animationData={Aloading} loop={true} className="w-[200px]" />
        </div>
      ) : currentItems?.length > 0 ? (
        <div className="p-2 md:p-5  ">
          <table className=" border-collapse border border-slate-500  w-full mt-2 ">
            <thead className="bg-bleu4 text-white  ">
              <tr className="">
                <th className="py-2 border border-slate-600 hidden md:table-cell text-[12px] md:text-[16px]">
                  Identifiant
                </th>
                <th className="border border-slate-600 text-[12px] md:text-[16px]">
                  Date D'achat
                </th>

                <th className="border border-slate-600 hidden md:table-cell text-[12px] md:text-[16px]">
                  Montant Total
                </th>
                <th className="border border-slate-600 text-[12px] md:text-[16px]">
                  status de livraison
                </th>
                <th className="border border-slate-600 text-[12px] md:text-[16px]">
                  Imprimer la commande
                </th>
              </tr>
            </thead>
            {currentItems?.map((el) => (
              <tbody key={el.id} className="border">
                <tr className="text-center ">
                  <td className="border border-slate-600 py-4 hidden md:table-cell text-[12px] md:text-[16px]">
                    {el.id}{" "}
                  </td>
                  <td className="border border-slate-600 text-[12px] md:text-[16px] text-nowrap">
                    {" "}
                    {format(el.createdAt.toDate(), "dd-MM-yy")}
                  </td>
                  <td className="border border-slate-600 hidden md:table-cell text-[12px] md:text-[16px]">
                    {formatNumberWithDots(el.montantTotal)} Fcfa
                  </td>
                  <td className="border border-slate-600 ">
                    <select
                      className={` border-2 border-bleu4 rounded-md p-2 outline-none min-w-[80%] text-[12px] md:text-[16px] font-medium my-2  ${
                        el.status === "livre"
                          ? "bg-green-500 border-none text-white"
                          : ""
                      } `}
                      onChange={(e) => changeState(e, el.id)}
                      value={el.status}
                    >
                      <option value="en cours">En cours</option>
                      <option value="livre">Livré</option>
                    </select>
                  </td>
                  <td className="border border-slate-600">
                    <p className="flex justify-center">
                      <PDFDownloadLink
                        document={<InvoiceComponent data={el} />}
                        fileName="Commande.pdf"
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? (
                            <p className="text-sm">Chargement...</p>
                          ) : (
                            <FaFilePdf className=" text-[25px] lg:text-[40px] text-red-500" />
                          )
                        }
                      </PDFDownloadLink>
                    </p>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
          <div className=" w-full">
            <hr className=" my-3 " />
            <div className="w-full flex justify-center my-1   ">
              <Pagination
                style={{ fontWeight: "normal" }}
                current={currentPage} // The current page
                total={allCommandes.length} // Total number of products
                pageSize={pageSize} // Number of items per page
                onChange={onPageChange} // Handle page change
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center  items-center mt-5">
          <p className="uppercase text-center mt-2 font-medium text-base lg:text-[20px] font-sans2 ">
            Aucune Commande pour le moment.
          </p>

          <Lottie
            animationData={ZeroPurchase}
            loop={true}
            className="w-[400px]"
          />
        </div>
      )}
    </div>
  );
};

export default VoirCommandes;
