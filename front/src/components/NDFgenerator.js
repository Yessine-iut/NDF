import React from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"

import { Page, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';
import PDFTable from "./PDFTable";

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 45,
    textAlign: 'center',
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 5,
    fontSize: 12,
    textAlign: 'justify',
  },
  adresse: {
    margin: 5,
    marginBottom: 10,
    fontSize: 12,
    textAlign: 'justify',
  },

  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const SingleNdfPage = (props) => {
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed>
          ~ Université Nice Côte d'Azur ~
        </Text>
        <Text style={styles.title}>NOTE DE FRAIS - Service {props.props.servNDF}</Text>
        <Text style={styles.text}>
          {props.props.user.prenom} {props.props.user.nom}
        </Text>
        <Text style={styles.text}>
          {props.props.user.numVoie} {props.props.user.nomVoie}{props.props.user.complementVoie !== "" ? (", " + props.props.user.complementVoie + ", ") : ","}
        </Text>
        <Text style={styles.adresse}>
          {props.props.user.codePostal} {props.props.user.commune}
        </Text>
        <Text style={styles.subtitle}>
          Récapitulatif du {props.props.startDateNDF} au {props.props.endDateNDF}
        </Text>

        <PDFTable data={props.props.data} />
        <Text style={styles.text}>  
        </Text>
        <Text style={styles.text}>
          Total TTC : {props.props.totalTTC}
        </Text>
        <Text style={styles.text}>
          Total HT : {props.props.totalHT}
        </Text>
        <Text style={styles.text}>
          TVA : {props.props.totalTVA}
        </Text>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default SingleNdfPage;