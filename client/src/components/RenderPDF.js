import React from 'react';
import { PDFDownloadLink, Page, Text, Document, StyleSheet } from '@react-pdf/renderer';

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
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let data = [],
            line = 0,
            addLine = (callback) => {
                if (line >= 8) {
                    line = 0;
                    data.push(
                        <Text style={styles.textHidden} wrap>\n\r</Text>,
                        <Text style={styles.textHidden} wrap>\n\r</Text>,
                        <Text style={styles.textHidden} wrap>\n\r</Text>
                    );
                }
                callback();
                line++;
            }
        this.props.configs.data.forEach(item => {
            addLine(() => {
                data.push(
                    <Text style={styles.subtitle}>
                        {item.subtitle}
                    </Text>
                )
            });
            addLine(() => {
                data.push(
                    <Text style={styles.date} wrap>
                        {item.date}
                    </Text>
                )
            })
            item.texts.forEach(text => {
                addLine(() => {
                    data.push(
                        <Text style={styles.text} wrap>
                            {text}
                        </Text>
                    )
                });
            })
        })

        return (
            <Document>
                <Page orientation="landscape" style={styles.body}>
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

export default {
    printNow: (configs) => (
        <div>
            <PDFDownloadLink document={<MyDocument configs={configs || {}} />} fileName="somename.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Carregando Documento...' : 'Exportar para PDF')}
            </PDFDownloadLink>
        </div>
    )
}