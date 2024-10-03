import { Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";
import { format } from "date-fns"; // Assuming you're using date-fns for formatting
import { frCA } from "date-fns/locale";

const styles = StyleSheet.create({
  container: {
    padding: 10, // Add some padding for layout
    alignItems: "flex-end", // Align all elements to the right
  },
  row: {
    display: "flex",
    flexDirection: "row", // Arrange label and value in a row
    justifyContent: "flex-end", // Align content to the right
    marginBottom: 4, // Space between rows
  },
  label: {
    fontSize: 10, // Smaller font size for a sleek look
    fontWeight: "bold", // Bold for labels
    marginRight: 5, // Add a small gap between the label and value
  },
  value: {
    fontSize: 10, // Smaller font for consistency
  },
  sectionDivider: {
    marginVertical: 6, // Add space between sections
    borderBottomWidth: 1, // Thin line to divide sections
    borderBottomColor: "#000", // Divider color
    borderBottomStyle: "solid",
  },
});

const InvoiceNo = ({ data }) => {
  // console.log(el);
  return (
    <View style={styles.container}>
      <View key={data.id}>
        <View style={styles.row}>
          <Text style={styles.label}>Identifiant de la commande:</Text>
          <Text style={styles.value}>{data.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date de commande:</Text>
          <Text style={styles.value}>
            {format(data.createdAt.toDate(), "d MMMM yyyy", {
              locale: frCA,
            })}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Coupon Appliqué:</Text>
          <Text style={styles.value}>
            {data.couponApplique ? "Oui" : "Non"}
          </Text>
        </View>
        <View style={styles.sectionDivider} /> {/* Divider between each item */}
      </View>
    </View>
  );
};

export default InvoiceNo;
