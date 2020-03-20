import React from 'react';
import { PDFDownloadLink, Page, Text, Document, Image, StyleSheet } from '@react-pdf/renderer';

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
    textHidden: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        opacity: 0
    },
    chart: {
        fontSize: 24,
        textAlign: 'center',
        backgroundColor: '#f0f0f0'
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
class MyDocument extends React.Component {
    render() {
        let data = [],
            line = 0,
            addLine = (callback) => {
                if (line >= 8) {
                    line = 0;
                    data.push(
                        <Text key={`${'line'}_${line + Math.random()}`} style={styles.textHidden} wrap>\n\r</Text>,
                        <Text key={`${'line'}_${line + Math.random()}`} style={styles.textHidden} wrap>\n\r</Text>,
                        <Text key={`${'line'}_${line + Math.random()}`} style={styles.textHidden} wrap>\n\r</Text>
                    );
                }
                callback();
                line++;
            },
            chart = ((res) => {
                if (res) {
                    let url = res.exportChart({ format: "png", toDataURL: true });
                    return (
                        <Image source={url} style={{
                            width: this.props.configs.chart.style.width,
                            height: this.props.configs.chart.style.height,
                            alignSelf: this.props.configs.chart.style.align
                        }} />
                    )
                }
            })(this.props.configs.chart.canvas);

        this.props.configs.data.forEach((item, i) => {
            addLine(() => {
                data.push(
                    <Text key={`${item.subtitle}_${i}`} style={styles.subtitle}>
                        {item.subtitle}
                    </Text>
                )
            });
            addLine(() => {
                data.push(
                    <Text key={`${item.date}_${i}`} style={styles.date} wrap>
                        {item.date}
                    </Text>
                )
            })
            item.texts.forEach(text => {
                addLine(() => {
                    data.push(
                        <Text key={`${text}_${i}`} style={styles.text} wrap>
                            {text}
                        </Text>
                    )
                });
            })
        })

        return (
            <Document>
                <Page size="A4" orientation="landscape" style={styles.body}>
                    <Text style={styles.chart}>
                        {this.props.configs.chart.text}
                    </Text>
                    {chart}
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                    <Text style={styles.footer} fixed >
                        {`${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getFullYear())} - ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`}
                    </Text>
                </Page>
                <Page size="A4" orientation="landscape" style={styles.body}>
                    <Text style={styles.header} fixed>
                        ~ {this.props.configs.header} ~
          </Text>
                    <Text style={styles.title} fixed>
                        {this.props.configs.title}
                    </Text>
                    {data}
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                    <Text style={styles.footer} fixed >
                        {`${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getFullYear())} - ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`}
                    </Text>
                </Page>
            </Document>
        );
    }
}

export default function GraphicsPDF(configs) {
    return (
        <PDFDownloadLink document={<MyDocument configs={configs || {}} />} fileName="somename.pdf" style={{ 'color': '#282c34', 'textDecoration': 'none' }}>
            {({ blob, url, loading, error }) => (loading ? 'Carregando Documento...' : 'Exportar para PDF')}
        </PDFDownloadLink>
    )
}