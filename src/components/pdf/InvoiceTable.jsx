import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  tableContainer: {
    margin: 10,
    border: "1px solid black",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2f4858",
    color: "#fff",
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    borderBottom: "1px solid black",
    fontSize: 9,
  },
  tableCell: {
    flex: 1, // Equal width for all cells
    textAlign: "left",
  },
  tableCellRight: {
    flex: 1,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    paddingRight: 10,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

const InvoiceTable = ({ data }) => {
  function formatNumberWithDots(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <View>
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={styles.tableCell}>
            <Text>Produit(s)</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>Type</Text>
          </View>
          <View style={styles.tableCellRight}>
            <Text>P.U</Text>
          </View>
          <View style={styles.tableCellRight}>
            <Text>Quantité</Text>
          </View>
          <View style={styles.tableCellRight}>
            <Text>Livraison Gratuite</Text>
          </View>
          <View style={styles.tableCellRight}>
            <Text>Sous-Total</Text>
          </View>
        </View>

        {/* Table Body (Rows) */}
        {data.articlesAchetes.map((el) => (
          <View key={el.id} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>{el.nom}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{el.type === "undefined" ? "" : el.type}</Text>
            </View>
            <View style={styles.tableCellRight}>
              <Text>{formatNumberWithDots(el.prix)} Fcfa</Text>
            </View>
            <View style={styles.tableCellRight}>
              <Text>{el.quantite}</Text>
            </View>
            <View style={styles.tableCellRight}>
              <Text>{el.livraisonGratuite ? "Oui" : "Non"}</Text>
            </View>
            <View style={styles.tableCellRight}>
              <Text>{formatNumberWithDots(el.prix * el.quantite)} Fcfa</Text>
            </View>
          </View>
        ))}

        {/* Total Row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            {formatNumberWithDots(data.montantTotal)} Fcfa
          </Text>
        </View>
      </View>
    </View>
  );
};

export default InvoiceTable;
