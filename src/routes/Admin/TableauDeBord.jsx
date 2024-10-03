import React from "react";
import { recuperCommandes } from "../../utils/hooks";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { format, getMonth } from "date-fns";

const TableauDeBord = () => {
  const {
    data: allCommandes,
    error,
    isLoading: isLoadingAll,
    refetch: refreshCommands,
  } = useQuery({
    queryKey: ["allCommandes"],
    queryFn: recuperCommandes,
    staleTime: 60 * 60 * 500,
    enabled: true,
  });

  const turnoverData = [
    { month: "Janvier", turnover: calculCA(0) },
    { month: "Fevrier", turnover: calculCA(1) },
    { month: "Mars", turnover: calculCA(2) },
    { month: "Avril", turnover: calculCA(3) },
    { month: "Mai", turnover: calculCA(4) },
    { month: "Juin", turnover: calculCA(5) },
    { month: "Juillet", turnover: calculCA(6) },
    { month: "Août", turnover: calculCA(7) },
    { month: "Septembre", turnover: calculCA(8) },
    { month: "Octobre", turnover: calculCA(9) },
    { month: "Novembre", turnover: calculCA(10) },
    { month: "Decembre", turnover: calculCA(11) },
  ];

  const turnoverData2 = [
    { month: "Janvier", turnover: calculA(0) },
    { month: "Fevrier", turnover: calculA(1) },
    { month: "Mars", turnover: calculA(2) },
    { month: "Avril", turnover: calculA(3) },
    { month: "Mai", turnover: calculA(4) },
    { month: "Juin", turnover: calculA(5) },
    { month: "Juillet", turnover: calculA(6) },
    { month: "Août", turnover: calculA(7) },
    { month: "Septembre", turnover: calculA(8) },
    { month: "Octobre", turnover: calculA(9) },
    { month: "Novembre", turnover: calculA(10) },
    { month: "Decembre", turnover: calculA(11) },
  ];
  function calculA(index) {
    const filter = allCommandes?.filter(
      (el) => getMonth(format(el.createdAt.toDate(), "d MMMM yyyy")) === index
    );
    const turnover = filter?.reduce(
      (acc, i) => acc + i.articlesAchetes.length,
      0
    );
    return turnover;
  }

  function calculCA(index) {
    const filter = allCommandes?.filter(
      (el) => getMonth(format(el.createdAt.toDate(), "d MMMM yyyy")) === index
    );
    const turnover = filter?.reduce((acc, i) => acc + i.montantTotal, 0);
    return turnover;
  }

  const data = {
    labels: turnoverData.map((item) => item.month), // Labels for each month
    datasets: [
      {
        label: "Chiffre d'Affaires (FCFA)", // Label for the dataset
        data: turnoverData.map((item) => item.turnover), // Actual turnover data
        backgroundColor: "#D7B4FE", // Bar color
        borderColor: "#D7B4FE", // Border color for bars
        borderWidth: 1, // Bar border width
        with: "100px",
      },
    ],
  };

  const data2 = {
    labels: turnoverData2.map((item) => item.month), // Labels for each month
    datasets: [
      {
        label: "Articles vendus par mois", // Label for the dataset
        data: turnoverData2.map((item) => item.turnover), // Actual turnover data
        backgroundColor: "#87EFAB", // Bar color
        borderColor: "#87EFAB", // Border color for bars
        borderWidth: 1, // Bar border width
        with: "100px",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chiffre d'affaires réalisé par mois",
        font: {
          size: 22, // Increase legend label font size
        },
      },
    },
  };

  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Articles vendus par mois",
        font: {
          size: 22, // Increase legend label font size
        },
      },
    },
  };

  function formatNumberWithDots(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  // console.log(allCommandes);
  return (
    <div className="p-5">
      <div className="flex flex-col md:flex-row gap-[10px] justify-between">
        <div className=" rounded-md bg-purple-300 p-2 xl:p-6 text-cente flex flex-col  justify-center ">
          <p className=" text-white font-semibold text-sm md:text-base xl:text-[20px]  uppercase text-center ">
            Chiffre d'affaires réalisé
          </p>
          <p className="text-lg md:text-[22px] text-center font-bold text-white ">
            {" "}
            {formatNumberWithDots(
              allCommandes?.reduce((acc, i) => acc + i.montantTotal, 0)
            )}{" "}
            Fcfa
          </p>
        </div>
        <div className=" text-white rounded-md bg-blue-200 p-2 xl:p-6 text-center flex flex-col  justify-center ">
          <p className="text-sm md:text-base xl:text-[20px] font-semibold uppercase  ">
            Nombre de commandes{" "}
          </p>
          <p className="text-lg md:text-[22px] font-bold ">
            {allCommandes?.length}{" "}
          </p>
        </div>
        <div className=" text-white rounded-md bg-green-300   border-bleu4 p-2 xl:p-6 text-center flex flex-col  justify-center ">
          <p className="text-sm md:text-base xl:text-[20px] font-semibold  uppercase  ">
            Nombre d'articles achetés{" "}
          </p>
          <p className="text-lg md:text-[22px] font-bold ">
            {allCommandes?.reduce(
              (acc, i) => acc + i.articlesAchetes.length,
              0
            )}{" "}
          </p>
        </div>
      </div>

      <div className="mt-10 hidden lg:block">
        <div className="space-y-[50px] ">
          <Bar data={data} options={options} />
          <Bar data={data2} options={options2} />
        </div>
      </div>

      <div className="text-center mt-10 lg:hidden ">
        <hr className="mb-2" />
        <span className="  text-[40px]">⚠️</span>
        <p className="text-sm md:text-lg">
          Pour voir les graphes, connectez vous sur un appareil d'au moins
          <span className="font-semibold"> 11 pouces !</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default TableauDeBord;
