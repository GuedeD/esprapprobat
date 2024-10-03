import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

const FinProforma = () => {
  const styles = StyleSheet.create({
    container: {
      padding: 10,
    },

    subtitle: {
      fontSize: 9,
      textAlign: "center",
      marginTop: 2,
      lineHeight: 1.5,
      fontWeight: "bold",
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Sarl au capital de 1.000.000 FCFA - Siège social: Abidjan Cocody Angré
        -RCCM N° CI-ABJ-o3-2022-B13-08-238 . NCC 2243704 W-Cel: 07 08 79 73 58 -
        Régime fiscal: Taxe de l'Etat de l'entreprenant- Compte bancaire: BOA :
        01016 008316410001 46 - Email: etoilesservicespremium@gmail.com
      </Text>
    </View>
  );
};

export default FinProforma;
