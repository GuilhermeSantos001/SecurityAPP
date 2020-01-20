import React from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        backgroundColor: '#ffffff'
    },
    title: {
        fontSize: 24,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
        backgroundColor: '#f0f0f0'
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify'
    },
    date: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        backgroundColor: '#f0f0f0'
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center'
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey'
    },
    footer: {
        position: 'absolute',
        fontSize: 12,
        bottom: 10,
        left: 0,
        right: 10,
        textAlign: 'right',
        color: 'grey'
    }
});

// Create Document Component
const MyDocument = () => (
    <Document>
        <Page orientation="landscape" style={styles.body}>
            <Text style={styles.header} fixed>
                ~ Relatorio de Postos Cobertos ~
      </Text>
            <Text style={styles.title} fixed>Ano de 2020</Text>
            <Text style={styles.subtitle}>
                Postos cobertos no Domingo
      </Text>
            <Text style={styles.date} wrap>
                Postos do dia 10 de Janeiro de 2020
      </Text>
            <Text style={styles.text} wrap>
                Villa Amalfi
      </Text>
            <Text style={styles.text} wrap>
                Condominio Plaza
      </Text>
            <Text style={styles.text} wrap>
                Igreja Nossa Senhora de Madalena
      </Text>
            <Text style={styles.text} wrap>
                Posto nova iguaçu
      </Text>
            <Text style={styles.date} wrap>
                Postos do dia 17 de Janeiro de 2020
      </Text>
            <Text style={styles.text} wrap>
                Villa Amalfi
      </Text>
            <Text style={styles.text} wrap>
                Condominio Plaza
      </Text>
            <Text style={styles.text} wrap>
                Igreja Nossa Senhora de Madalena
      </Text>
            <Text style={styles.text} wrap>
                Posto nova iguaçu
      </Text>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
            )} fixed />
            <Text style={styles.footer} fixed >
                19/01/2020
            </Text>
        </Page>
    </Document >
);

const App = () => (
    <div>
        <PDFDownloadLink document={<MyDocument />} fileName="somename.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Exportar para PDF')}
        </PDFDownloadLink>
    </div>
);

export default {
    printNow: () => (
        <App />
    )
}