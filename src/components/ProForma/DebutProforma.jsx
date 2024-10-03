import React from "react";
import { Image, View, Text, StyleSheet } from "@react-pdf/renderer";
import Logo from "../../assets/Images/logo-no-bg.png";
import { format } from "date-fns"; // Make sure you're using a date formatting library

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A4D8E", // Matches the blue in the image title
  },
  title2: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
    lineHeight: 1.5,
    fontWeight: "bold",
  },
  hr: {
    marginBottom: 10,
    height: 1,
    backgroundColor: "#000",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  dateText: {
    fontSize: 12,
  },
  bpfText: {
    fontSize: 12,
    textAlign: "right",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: "#2f4858", // Light grey background for header
    color: "#fff",
    padding: 5,
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
  },
  tableColTotal: {
    width: "80%",
    borderStyle: "solid",
    borderRightWidth: 1,
    padding: 5,
  },
  tableCellHeader: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 10,
  },
  tableCell: {
    fontSize: 10,
    textAlign: "center",
  },
  tableTotalRow: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 5,
  },
  totalLabel: {
    width: "80%",
    textAlign: "right",
    paddingRight: 10,
    fontWeight: "bold",
  },
  totalAmount: {
    width: "20%",
    textAlign: "center",
    fontWeight: "bold",
  },
});

const DebutProforma = ({ data }) => {
  function formatNumberWithDots(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image src={Logo} style={styles.logo} />
        <Text style={styles.title}>ETOILES SERVICES PREMIUM</Text>
      </View>
      {/* Divider Line */}
      <View style={styles.hr} />
      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Conception de plans et suivi de l'acquisition du permis de construire -
        Etudes et élaboration de devis - Suivi et réalisation des travaux tout
        corps d'état (Gros et second œuvre) - Rénovation de bâtiments -
        Décoration intérieure - Fourniture de matériaux et de matériels de
        construction - Fourniture de meubles - Aménagement d'espaces verts
      </Text>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>
          Date : {format(data.createdAt.toDate(), "dd/MM/yyyy")}
        </Text>
        <Text style={styles.bpfText}>BPF…………………</Text>
      </View>

      <View>
        <Text style={styles.title2}>PROFORMA</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Désignation</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Unité</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Quantité</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Prix Unitaire</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Prix Total</Text>
            </View>
          </View>

          {/* Table Body */}
          {data.articlesAchetes.map((el) => (
            <View style={styles.tableRow} key={el.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{el.nom}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {el.type === "undefined" ? "" : el.type}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{el.quantite}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatNumberWithDots(el.prix)} Fcfa
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatNumberWithDots(el.prix * el.quantite)} Fcfa
                </Text>
              </View>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.tableTotalRow}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalAmount}>
              {formatNumberWithDots(data.montantTotal)} Fcfa
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DebutProforma;
