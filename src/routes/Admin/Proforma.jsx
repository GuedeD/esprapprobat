import React, { useState } from "react";
import { recuperFactures } from "../../utils/hooks";
import { useQuery } from "@tanstack/react-query";
import { FaFilePdf } from "react-icons/fa";
import { format } from "date-fns";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import DebutProforma from "../../components/ProForma/DebutProforma";
import FinProforma from "../../components/ProForma/FinProforma";
import { FaDeleteLeft } from "react-icons/fa6";
import ZeroPurchase from "../../assets/Images/animation/EmptyOrder.json";
import Aloading from "../../assets/Images/animation/ALoading.json";
import Lottie from "lottie-react";
import Pagination from "rc-pagination/lib/Pagination";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import toast from "react-hot-toast";

// if (isLoading && !allCom) {
//     return (
//       <section className="flex max-w-[80%] mx-auto gap-4 justify-center items-center min-h-[700px]">
//         {[0, 1].map((i) => (
//           <div key={i} className="flex w-[50%] flex-col gap-4">
//             <div className="flex items-center gap-5">
//               <div className="skeleton h-full w-16 shrink-0 rounded-full"></div>
//               <div className="flex flex-col gap-4">
//                 <div className="skeleton h-4 w-20"></div>
//                 <div className="skeleton h-4 w-28"></div>
//               </div>
//             </div>
//             <div className="skeleton h-32 w-full"></div>
//           </div>
//         ))}
//       </section>
//     );
//   }
const styles = StyleSheet.create({
  page: {
    padding: 20,
    position: "relative",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Ensures space between top and bottom components
    height: "100%", // Full height of the page
  },
  section: {
    marginBottom: 20, // Adds some margin between sections if needed
  },
  watermark: {
    position: "absolute",
    fontSize: 160,
    color: "gray",
    opacity: 0.1, // Adjust the transparency
    transform: "rotate(-45deg)",
    top: "40%",
    left: "25%",
  },
  footer: {
    position: "absolute",
    bottom: 20, // Positions FinProforma 20 points from the bottom
    width: "100%",
    left: 10,
  },
});

const InvoiceComponent = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>ESP</Text>

        {/* Main header */}
        <View style={styles.section}>
          <DebutProforma data={data} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <FinProforma />
        </View>
      </Page>
    </Document>
  );
};

const Proforma = () => {
  function formatNumberWithDots(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const {
    data: allFactures,
    error,
    isLoading,
    refetch: refreshFactures,
  } = useQuery({
    queryKey: ["allFactures"],
    queryFn: recuperFactures,
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = allFactures?.slice(startIdx, endIdx);

  async function deleteFacture(id) {
    const docRef = doc(db, "factures", id);
    try {
      await deleteDoc(docRef);
      toast.success("Facture supprimée");
      refreshFactures();
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (error) {
    return (
      <section className="flex justify-center items-center h-full">
        <p>Une erreur s'est produite lors de la récupération des données </p>
      </section>
    );
  }

  return (
    <div className="h-full relative">
      <h3 className="text-bleu4 font-semibold text-[20px] md:text-[26px] p-3">
        Voir factures
      </h3>
      <hr />

      {isLoading ? (
        <div className="flex items-center h-full w-full justify-center">
          <Lottie animationData={Aloading} loop={true} className="w-[200px]" />
        </div>
      ) : currentItems?.length > 0 ? (
        <div className="p-2 md:p-5 ">
          <table className=" border-collapse border border-slate-500  w-full mt-2 ">
            <thead className="bg-bleu4 text-white    ">
              <tr className="">
                <th className="py-2 border border-slate-600 text-[12px] md:text-[16px] ">
                  N°
                </th>
                <th className="border border-slate-600 text-[12px] md:text-[16px]">
                  Date
                </th>

                <th className=" hidden md:table-cell    text-[12px] md:text-[16px]">
                  Montant Total
                </th>
                <th className="border border-slate-600 text-[12px] md:text-[16px]">
                  Impression
                </th>
                <th className="text-[12px] md:text-[16px]">Supprimer</th>
              </tr>
            </thead>
            {currentItems?.map((el, i) => (
              <tbody key={el.id} className="border">
                <tr className="text-center ">
                  <td className="border border-slate-600 py-4"> {i + 1}</td>
                  <td className="border border-slate-600  text-[12px] md:text-[16px]">
                    {" "}
                    {format(el.createdAt.toDate(), "dd-MM-yy")}
                  </td>
                  <td className="hidden md:table-cell	    border border-slate-600">
                    {formatNumberWithDots(el.montantTotal)} Fcfa
                  </td>

                  <td className="border border-slate-600">
                    <p className="flex justify-center">
                      <PDFDownloadLink
                        document={<InvoiceComponent data={el} />}
                        fileName="Proforma.pdf"
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? (
                            <span>Loading document...</span>
                          ) : (
                            <FaFilePdf className="mx-auto text-[20px] md:text-[28px]" />
                          )
                        }
                      </PDFDownloadLink>
                    </p>
                  </td>
                  <td className="border border-slate-600 ">
                    <FaDeleteLeft
                      className="mx-auto text-[20px] md:text-[28px] lg:text-[35px] cursor-pointer hover:text-red-500 transition-all duration-300 "
                      onClick={() => deleteFacture(el.id)}
                    />
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
          <div className="absolute w-full bottom-2 left-0">
            <hr className=" my-3 " />
            <div className="w-full flex justify-center my-1   ">
              <Pagination
                style={{ fontWeight: "normal" }}
                current={currentPage} // The current page
                total={allFactures.length} // Total number of products
                pageSize={pageSize} // Number of items per page
                onChange={onPageChange} // Handle page change
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center  items-center -mt-5">
          <p className="uppercase font-medium text-[20px] font-sans2 ">
            Aucune Facture pour le moment.
          </p>

          <Lottie
            animationData={ZeroPurchase}
            loop={true}
            className="w-[500px]"
          />
        </div>
      )}
    </div>
  );
};

export default Proforma;
