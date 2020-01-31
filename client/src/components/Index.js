/**
 * Import React
 */
import React from "react";

/**
 * Import LZ-String
 */
import * as LZString from 'lz-string';

/**
 * Import CanvasJSReact
 */
import CanvasJSReact from '../assets/canvasjs.react';

/**
 * Import Bootstrap
 */
import {
    Image,
    ButtonToolbar,
    Button
} from 'react-bootstrap';

/**
 * Import Resources from Page
 */
import logo from '../logo.svg';

/**
 * Import Icons
 */
import {
    MdDashboard,
    MdWork,
    MdAnnouncement,
    MdRssFeed,
    MdDateRange,
    MdMood,
    MdMoodBad,
    MdVerifiedUser,
    MdError,
    MdUpdate,
    MdHdrWeak,
    MdLiveHelp,
    MdHdrStrong,
    MdHeadsetMic,
    MdFace,
    MdAssignment,
    MdFolderShared,
    MdLocalPrintshop,
    MdPersonAdd,
    MdTimer,
    MdLocalAtm,
    MdSecurity,
    MdBuild,
    MdConfirmationNumber,
    MdPersonPin,
    MdAvTimer,
    MdYoutubeSearchedFor
} from 'react-icons/md';

/**
 * Import React PDF
 */
import GraphicsPDF from './RenderPDF';

/**
 * Import Resources from Page
 */
import 'animate.css';
import '../css/Index.css';

/**
 * Class
 */
export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: 'dashboard',
            clock: this.getClock(),
            username: this.getUsername(),
            data: {
                dashboard: [
                    Math.floor(1 + Math.random() * 100),
                    Math.floor(1 + Math.random() * 100)
                ],
                graphics: {
                    "Postos Cobertos": {
                        "chart": null,
                        "2020": {
                            color: '#0099ff',
                            data: [
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100)
                            ]
                        },
                        "2021": {
                            color: '#33ccff',
                            data: [
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100)
                            ]
                        }
                    },
                    "Postos Descobertos": {
                        "2020": {
                            color: '#0099ff',
                            data: [
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100)
                            ]
                        },
                        "2021": {
                            color: '#33ccff',
                            data: [
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100),
                                Math.floor(1 + Math.random() * 100)
                            ]
                        }
                    }
                }
            }
        }
    }

    componentDidMount() {
        const loadingElement = document.getElementById('ipl-progress-indicator');
        if (loadingElement) {
            // fade out
            loadingElement.classList.add('available');
            setTimeout(() => {
                // remove from DOM
                if (loadingElement) loadingElement.outerHTML = '';
            }, 2000);
        }

        window.setInterval(() => {
            this.setClock();
        }, 1000);
        this.renderChartCanvas();
    }

    componentDidUpdate(prop, state) {
        if (this.state.menu !== state.menu) {
            animateCSS(this.state.menu, 'bounceInRight');
            if (this.state.menu === 'dashboard') this.renderChartCanvas();
        }
    }

    setClock() {
        this.setState({ clock: this.getClock() });
    }

    getClock = () => {
        return `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getFullYear())} - \n\r\
        ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
    }

    getUsername() {
        const data = JSON.parse(LZString.decompressFromBase64(sessionStorage.getItem('auth'))) || null;
        if (!data) return '???';
        return data['name'];
    }

    renderChartCanvas() {
        this.chartCanvas('Postos Cobertos');
        this.chartCanvas('Postos Descobertos');
    }

    chartCanvas(graphic) {
        const options = {
            title: {
                text: "Postos Descobertos",
                fontSize: 42,
                padding: {
                    top: 10
                }
            },
            axisY: {
                margin: 10
            },
            theme: "light2",
            animationEnabled: true,
            toolTip: {
                content: "{name} não foi/foram coberto(s) {y} posto(s)"
            },
            data: [
                {
                    name: "Ano de 2020",
                    showInLegend: true,
                    type: "column",
                    color: this.state.data.graphics[graphic]["2020"].color,
                    dataPoints: [
                        { label: "Domingo", y: this.state.data.graphics[graphic]["2020"].data[0] },
                        { label: "Segunda-Feira", y: this.state.data.graphics[graphic]["2020"].data[1] },
                        { label: "Terça-Feira", y: this.state.data.graphics[graphic]["2020"].data[2] },
                        { label: "Quarta-Feira", y: this.state.data.graphics[graphic]["2020"].data[3] },
                        { label: "Quinta-Feira", y: this.state.data.graphics[graphic]["2020"].data[4] },
                        { label: "Sexta-Feira", y: this.state.data.graphics[graphic]["2020"].data[5] },
                        { label: "Sabado", y: this.state.data.graphics[graphic]["2020"].data[6] }
                    ]
                },
                {
                    name: "Ano de 2021",
                    showInLegend: true,
                    type: "column",
                    color: this.state.data.graphics[graphic]["2021"].color,
                    dataPoints: [
                        { label: "Domingo", y: this.state.data.graphics[graphic]["2021"].data[0] },
                        { label: "Segunda-Feira", y: this.state.data.graphics[graphic]["2021"].data[1] },
                        { label: "Terça-Feira", y: this.state.data.graphics[graphic]["2021"].data[2] },
                        { label: "Quarta-Feira", y: this.state.data.graphics[graphic]["2021"].data[3] },
                        { label: "Quinta-Feira", y: this.state.data.graphics[graphic]["2021"].data[4] },
                        { label: "Sexta-Feira", y: this.state.data.graphics[graphic]["2021"].data[5] },
                        { label: "Sabado", y: this.state.data.graphics[graphic]["2021"].data[6] }
                    ]
                }
            ]
        }

        if (!this.state.data.graphics[graphic]) return;
        else if (this.state.menu !== 'dashboard') return;
        let chart = new CanvasJSReact.CanvasJS.Chart(`chartContainer-${graphic}`, options),
            state = Object.assign({}, this.state.data);
        chart.render();
        state.graphics[graphic].chart = chart;
        this.setState({ data: state });
    }

    chartDonwload(graphic) {
        if (!this.state.data.graphics[graphic] || !this.state.data.graphics[graphic].chart)
            return;
        else
            return (
                <p style={{ 'marginLeft': 14 }}>
                    {GraphicsPDF.printNow({
                        chart: {
                            text: 'Grafico de Postos Cobertos em 2020/2021',
                            canvas: this.state.data.graphics[graphic].chart,
                            style: {
                                width: '680px',
                                height: '440px',
                                align: 'center'
                            }
                        },
                        header: 'Relatorio de Postos Cobertos',
                        title: 'Ano de 2020',
                        data: [
                            {
                                subtitle: 'Postos cobertos no Domingo',
                                date: 'Postos do dia 10 de Janeiro de 2020',
                                texts: [
                                    'Villa Amalfi 1 - 08:30:32',
                                    'Hospital Guaruja 1 - 10:30:16',
                                ]
                            },
                            {
                                subtitle: 'Postos cobertos na Segunda',
                                date: 'Postos do dia 11 de Janeiro de 2020',
                                texts: [
                                    'Villa Amalfi 2 - 12:23:46',
                                    'Hospital Guaruja 2 - 13:52:10',
                                ]
                            },
                            {
                                subtitle: 'Postos cobertos na Terça-Feira',
                                date: 'Postos do dia 12 de Janeiro de 2020',
                                texts: [
                                    'Villa Amalfi 3 - 10:12:20',
                                    'Hospital Guaruja 3 - 14:12:08',
                                ]
                            },
                            {
                                subtitle: 'Postos cobertos na Quarta-Feira',
                                date: 'Postos do dia 12 de Janeiro de 2020',
                                texts: [
                                    'Villa Amalfi 4 - 22:46:36',
                                    'Hospital Guaruja 4 - 23:38:50',
                                ]
                            },
                            {
                                subtitle: 'Postos cobertos na Quinta-Feira',
                                date: 'Postos do dia 12 de Janeiro de 2020',
                                texts: [
                                    'Villa Amalfi 5 - 00:40:25',
                                    'Hospital Guaruja 5 - 03:00:00',
                                ]
                            },
                            {
                                subtitle: 'Postos cobertos na Sexta-Feira',
                                date: 'Postos do dia 12 de Janeiro de 2020',
                                texts: [
                                    'Villa Amalfi 6 - 06:18:12',
                                    'Hospital Guaruja 6 - 07:30:00',
                                ]
                            },
                            {
                                subtitle: 'Postos cobertos na Sabado',
                                date: 'Postos do dia 12 de Janeiro de 2020',
                                texts: [
                                    'Villa Amalfi 7 - 04:48:36',
                                    'Hospital Guaruja 7 - 11:50:30',
                                ]
                            }
                        ]
                    })}
                </p>
            )
    }

    render() {
        return (
            <div className="row">
                <div className="col-2 bg-dark">
                    <Image className="App-logo" src={logo} />
                    <h1 className="App-Title">Grupo Mave</h1>
                    <div className="App-header">
                        <ButtonToolbar>
                            <Button
                                id="_dashboard"
                                className={`m-2 ${this.state.menu === 'dashboard' ? 'active' : ''}`}
                                variant="outline-info"
                                size="lg"
                                block
                                onClick={() => this.setState({ menu: 'dashboard' })}>
                                <MdDashboard /> Dashboard
                            </Button>
                            <Button
                                id="_comercial"
                                className={`m-2 ${this.state.menu === 'comercial' ? 'active' : ''}`}
                                variant="outline-info"
                                size="lg"
                                block
                                onClick={() => this.setState({ menu: 'comercial' })}>
                                <MdWork /> Comercial
                            </Button>
                            <Button
                                id="_dp_rh"
                                className={`m-2 ${this.state.menu === 'dp_rh' ? 'active' : ''}`}
                                variant="outline-info"
                                size="lg"
                                block
                                onClick={() => this.setState({ menu: 'dp_rh' })}>
                                <MdFolderShared /> DP/RH
                            </Button>
                            <Button
                                id="_operacional"
                                className={`m-2 ${this.state.menu === 'operacional' ? 'active' : ''}`}
                                variant="outline-info"
                                size="lg"
                                block
                                onClick={() => this.setState({ menu: 'operacional' })}>
                                <MdSecurity /> Operacional
                            </Button>
                            <Button
                                id="_financeiro"
                                className={`m-2 ${this.state.menu === 'financeiro' ? 'active' : ''}`}
                                variant="outline-info"
                                size="lg"
                                block
                                onClick={() => this.setState({ menu: 'financeiro' })}>
                                <MdLocalAtm /> Financeiro
                            </Button>
                            <Button
                                id="_suport"
                                className={`m-2 ${this.state.menu === 'suport' ? 'active' : ''}`}
                                variant="outline-info"
                                size="lg"
                                block
                                onClick={() => this.setState({ menu: 'suport' })}>
                                <MdAnnouncement /> Suporte
                            </Button>
                        </ButtonToolbar>
                    </div>
                </div>
                <div style={{ 'width': '82%' }}>
                    {this.content()}
                </div>
            </div >
        )
    }

    content() {
        // Dashboard
        if (this.state.menu === 'dashboard') {
            return (
                <div className='dashboard'>
                    <div className="Dashboard-view_1">
                        <div className="container-fluid row">
                            <div className="bg-light border border-dark ml-3 mt-2 pl-3 text-secondary" style={{ 'width': 1150 }}>
                                <h2 className="mt-3">{this.state.username}</h2>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3 className="mb-4">Departamento - TI</h3>
                            </div>
                            <div className="bg-success border border-dark col-3 ml-3 mt-2 pt-2 text-white" style={{ 'height': 100, 'paddingLeft': 10 }}>
                                <h1 style={{ 'fontSize': 24 }}><MdRssFeed /> Postos Cobertos</h1>
                                <h2 className="pt-2">{this.state.data.dashboard[0]}</h2>
                            </div>
                            <div className="bg-danger border border-dark col-3 ml-2 mt-2 pt-2 text-white" style={{ 'height': 100, 'paddingLeft': 10 }}>
                                <h1 style={{ 'fontSize': 24 }}><MdRssFeed /> Postos Descobertos</h1>
                                <h2 className="pt-2">{this.state.data.dashboard[1]}</h2>
                            </div>
                            <div className="bg-info border border-dark ml-2 mt-2 pt-2 text-white" style={{ 'width': 545, 'height': 100, 'paddingLeft': 10 }}>
                                <h1 style={{ 'fontSize': 24 }}><MdDateRange /> Data e Hora</h1>
                                <h2 className="pt-2">{this.state.clock}</h2>
                            </div>
                        </div>
                        <div className="container-fluid row">
                            <div className="bg-light border-bottom border-left border-right border-dark col-3 ml-3 pt-2" style={{ 'height': 180 }}>
                                <p className="text-dark text-left font-weight-bold" style={{ 'fontSize': 15, 'marginLeft': -8 }}><MdVerifiedUser /> Clientes Importantes Cobertos</p>
                                <hr />
                                <ul className="list-group overflow-auto" style={{ 'marginLeft': -8, 'height': 100 }}>
                                    <li className="text-secondary list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -14 }}>
                                        <MdMood /> Forest Park
                                        <hr />
                                    </li>
                                    <li className="text-secondary list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -30 }}>
                                        <MdMood /> Pão de Açucar
                                        <hr />
                                    </li>
                                    <li className="text-secondary list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -30 }}>
                                        <MdMood /> Açai Atacadista
                                        <hr />
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-light border-bottom border-left border-right border-dark col-3 ml-2 pt-2" style={{ 'height': 180 }}>
                                <p className="text-dark text-left font-weight-bold" style={{ 'fontSize': 15, 'marginLeft': -8 }}><MdError /> Clientes Importantes Descobertos</p>
                                <hr />
                                <ul className="list-group overflow-auto" style={{ 'marginLeft': -8, 'height': 100 }}>
                                    <li className="text-secondary list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -14 }}>
                                        <MdMoodBad /> Condominio Renascimento
                                        <hr />
                                    </li>
                                    <li className="text-secondary list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -30 }}>
                                        <MdMoodBad /> Villa Amalfi
                                        <hr />
                                    </li>
                                    <li className="text-secondary list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -30 }}>
                                        <MdMoodBad /> Condominio Jaguare
                                        <hr />
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-light border-bottom border-left border-right border-dark ml-2 pt-2" style={{ 'width': 545, 'height': 180 }}>
                                <p className="text-dark text-left font-weight-bold" style={{ 'fontSize': 24, 'marginLeft': 8 }}><MdUpdate /> Suas ultimas alterações</p>
                                <hr style={{ 'width': '95%' }} />
                                <ul className="list-group overflow-auto" style={{ 'marginLeft': 8, 'marginRight': 15, 'height': 90 }}>
                                    <span className="badge badge-info font-weight-bold" style={{ 'fontSize': 14, 'alignSelf': 'center', 'marginBottom': 8 }}>21/05/2020</span>
                                    <li className="text-secondary list-group-item border-0 bg-transparent font-weight-bold" style={{ 'marginTop': -14 }}>
                                        <MdHdrWeak /> Confirmação de cobertura de posto no Forest Park
                                        <hr />
                                    </li>
                                    <span className="badge badge-info font-weight-bold" style={{ 'fontSize': 14, 'alignSelf': 'center', 'marginBottom': 8 }}>20/05/2020</span>
                                    <li className="text-secondary list-group-item border-0 bg-transparent font-weight-bold" style={{ 'marginTop': -14 }}>
                                        <MdHdrWeak /> Alteração cadastral de posto no Villa Amalfi
                                        <hr />
                                    </li>
                                    <span className="badge badge-info font-weight-bold" style={{ 'fontSize': 14, 'alignSelf': 'center', 'marginBottom': 8 }}>19/05/2020</span>
                                    <li className="text-secondary list-group-item border-0 bg-transparent font-weight-bold" style={{ 'marginTop': -14 }}>
                                        <MdHdrWeak /> Cadastro de um novo vigilante no posto do Villa Amalfi
                                        <hr />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="Dashboard-view_2">
                        <div className="container-fluid row">
                            <div className="col-6 mt-4">
                                <div id={'chartContainer-Postos Cobertos'} className="bg-transparent ml-2">
                                    <p className="text-secondary" style={{ 'marginLeft': 4 }}>Grafico Indisponivel!</p>
                                </div>
                                <p className="mt-2" style={{ 'width': 700, 'height': 400, 'marginLeft': 4, 'paddingTop': 410 }}>
                                    {this.chartDonwload('Postos Cobertos')}
                                </p>
                            </div>
                            <div className="col-6 mt-4">
                                <div id={'chartContainer-Postos Descobertos'} className="bg-transparent ml-2">
                                    <p className="text-secondary" style={{ 'marginLeft': 4 }}>Grafico Indisponivel!</p>
                                </div>
                                <p className="mt-2" style={{ 'width': 700, 'height': 400, 'marginLeft': 4, 'paddingTop': 410 }}>
                                    {this.chartDonwload('Postos Descobertos')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        // Comercial
        else if (this.state.menu === 'comercial') {
            return (
                <div className='comercial'>
                    <div className="Comercial-view_1">
                        <div className="bg-light border border-dark ml-3 mt-2 mr-2 pl-3 text-secondary">
                            <div className="mb-4">
                                <h1 className="mt-2">Menus - Comercial<MdWork /></h1>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3 className="ml-2 mt-3 text-secondary"><MdAssignment /> Cadastros</h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Empresa</a><br />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Cliente</a><br />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Tipo de Serviço</a><br />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Função</a><br />
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><a href="" className="ml-2 mt-3" ><MdWork /> Contratos</a></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3 className="ml-2 mt-3 text-secondary"><MdLocalPrintshop /> Relatórios</h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de cadastro de clientes</a><br />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Contratos</a><br />
                                <hr style={{ 'marginRight': 20 }} />
                            </div>
                        </div>
                    </div>
                </div >
            )
        }
        // DP/RH
        else if (this.state.menu === 'dp_rh') {
            return (
                <div className='dp_rh'>
                    <div className="Dp_rh-view_1">
                        <div className="bg-light border border-dark ml-3 mt-2 mr-2 pl-3 text-secondary">
                            <div className="mb-4">
                                <h1 className="mt-2">Menus - DP/RH<MdFolderShared /></h1>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><a href="" className="ml-2 mt-3" ><MdPersonAdd /> Cadastro de Funcionários</a></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><a href="" className="ml-2 mt-3" ><MdLocalAtm /> Valores e Regras</a></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><a href="" className="ml-2 mt-3" ><MdTimer /> Escala</a></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3 className="ml-2 mt-3 text-secondary"><MdLocalPrintshop /> Relatórios</h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de cadastro de funcionários</a><br />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Contratos</a><br />
                                <hr style={{ 'marginRight': 20 }} />
                            </div>
                        </div>
                    </div>
                </div >
            )
        }
        // Operacional
        else if (this.state.menu === 'operacional') {
            return (
                <div className='operacional'>
                    <div className="Operacional-view_1">
                        <div className="bg-light border border-dark ml-3 mt-2 mr-2 pl-3 text-secondary">
                            <div className="mb-4">
                                <h1 className="mt-2">Menus - Operacional<MdSecurity /></h1>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><a href="" className="ml-2 mt-3" ><MdPersonPin /> Alocação de Funcionários</a></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><a href="" className="ml-2 mt-3" ><MdConfirmationNumber /> Confirmação de Presença</a></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><a href="" className="ml-2 mt-3" ><MdBuild /> Manutenção de Apontamentos</a></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><a href="" className="ml-2 mt-3" ><MdAvTimer /> Calculo de Pagamentos</a></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><a href="" className="ml-2 mt-3" ><MdYoutubeSearchedFor /> Conferência de Pagamentos</a></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3 className="ml-2 mt-3 text-secondary"><MdLocalPrintshop /> Relatórios</h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Alocações</a><br />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Confirmação de Presenças</a><br />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Apontamentos</a><br />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Conferências</a><br />
                                <hr style={{ 'marginRight': 20 }} />
                            </div>
                        </div>
                    </div>
                </div >
            )
        }
        // Financeiro
        else if (this.state.menu === 'financeiro') {
            return (
                <div className='financeiro'>
                    <div className="Financeiro-view_1">
                        <div className="bg-light border border-dark ml-3 mt-2 mr-2 pl-3 text-secondary">
                            <div className="mb-4">
                                <h1 className="mt-2">Menus - Financeiro<MdLocalAtm /></h1>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><a href="" className="ml-2 mt-3" ><MdPersonAdd /> Pagamentos</a></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3 className="ml-2 mt-3 text-secondary"><MdLocalPrintshop /> Relatórios</h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Pagamentos</a><br />
                                <a href="" className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Recibos</a><br />
                                <hr style={{ 'marginRight': 20 }} />
                            </div>
                        </div>
                    </div>
                </div >
            )
        }
        // Suport
        else if (this.state.menu === 'suport') {
            return (
                <div className='suport'>
                    <div className="Suport-view_1">
                        <div className="row">
                            <div className="bg-secondary border border-dark ml-4 mt-3 text-white" style={{ 'width': 1165 }}>
                                <h1 className="p-2"><MdLiveHelp /> Precisa de ajuda?</h1>
                                <div className="bg-light border-top border border-dark pt-2" style={{ 'fontSize': 14, 'marginTop': 8 }}>
                                    <p className="text-dark text-left font-weight-bold pl-2" style={{ 'fontSize': 32 }}>
                                        <MdHeadsetMic /> Suporte
                                    </p>
                                    <hr style={{ 'width': 1120 }} />
                                    <p className="text-dark text-left font-weight-bold ml-2" style={{ 'fontSize': 20, 'marginTop': -8 }}>
                                        <MdFace /> Luiz
                                    </p>
                                    <p className="text-dark text-left font-weight-bold ml-4" style={{ 'fontSize': 20, 'marginTop': -12 }}>
                                        <MdHdrStrong /> Telefone: (11) 98497-9536
                                    </p>
                                    <p className="text-dark text-left font-weight-bold ml-4" style={{ 'fontSize': 20, 'marginTop': -12 }}>
                                        <MdHdrStrong /> Email: suporte@grupomave.com.br
                                    </p>
                                    <hr style={{ 'width': 1120 }} />
                                    <p className="text-dark text-left font-weight-bold ml-2" style={{ 'fontSize': 20, 'marginTop': -12 }}>
                                        <MdFace /> Jefferson
                                    </p>
                                    <p className="text-dark text-left font-weight-bold ml-4" style={{ 'fontSize': 20, 'marginTop': -12 }}>
                                        <MdHdrStrong /> Telefone: (11) 98276-6134
                                    </p>
                                    <p className="text-dark text-left font-weight-bold ml-4" style={{ 'fontSize': 20, 'marginTop': -12 }}>
                                        <MdHdrStrong /> Email: ti@grupomave.com.br
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

/**
 * Functions
 */
function animateCSS(element, animationName, callback) {
    const node = document.querySelector(`.${element}`);
    if (node) {
        node.classList.add('animated', animationName);

        let handleAnimationEnd = () => {
            node.classList.remove('animated', animationName);
            node.removeEventListener('animationend', handleAnimationEnd);

            if (typeof callback === 'function') callback()
        }

        node.addEventListener('animationend', handleAnimationEnd);
    }
}

// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }