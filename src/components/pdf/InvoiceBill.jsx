import { Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    border: "1px solid #e0e0e0",
    borderRadius: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    textTransform: "uppercase",
    color: "#333",
  },
  section: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  divider: {
    borderBottom: "1px solid #ddd",
    marginVertical: 5,
  },
});

const InvoiceBill = ({ data }) => {
  return (
    <View>
      <View key={data.id} style={styles.container}>
        <Text style={styles.header}>Détails de la commande</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Nom du Client :</Text>
            <Text style={styles.value}>{data.infosClient.nomComplet}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Numéro :</Text>
            <Text style={styles.value}>{data.infosClient.numero}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>District :</Text>
            <Text style={styles.value}>
              {data.infosClient.adresseClient?.district}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse de livraison :</Text>
            <Text style={styles.value}>
              {data.infosClient.adresseClient.commune} |{" "}
              {data.infosClient.adresseClient?.adresse}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InvoiceBill;
