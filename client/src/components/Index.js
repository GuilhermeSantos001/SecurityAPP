/**
 * Import React
 */
import React from "react";
import ReactDOM from 'react-dom'

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
            this.update();
        }, 1000);

        this.renderChartCanvas();


        ReactDOM.render(
            this.chartDonwload('Postos Cobertos'),
            document.getElementById('chartDonwload-Postos Cobertos')
        )

        ReactDOM.render(
            this.chartDonwload('Postos Descobertos'),
            document.getElementById('chartDonwload-Postos Descobertos')
        )
    }

    update() {
        this.setClock();
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
                fontColor: "#00d9ff",
                text: graphic,
                fontSize: 42,
                padding: {
                    top: 10
                }
            },
            legend: {
                fontColor: "#00d9ff"
            },
            axisX: {
                margin: 10,
                labelFontColor: "#00d9ff",
                lineColor: "#33ccff",
                tickColor: "#33ccff",
                gridColor: "#33ccff"
            },
            axisY: {
                margin: 10,
                labelFontColor: "#00d9ff",
                lineColor: "#33ccff",
                tickColor: "#33ccff",
                gridColor: "#33ccff"
            },
            backgroundColor: "#2c313a",
            animationEnabled: true,
            toolTip: {
                content: "{x}/{y} posto(s) coberto(s) em {name}"
            },
            data: [
                {
                    name: "Ano de 2020",
                    showInLegend: true,
                    type: "spline",
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
                    type: "spline",
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
        state.graphics[graphic].chart = chart;
        chart.render();
        this.setState({ data: state });
    }

    chartDonwload(graphic) {
        if (!this.state.data.graphics[graphic] || !this.state.data.graphics[graphic].chart)
            return;
        else {
            const download = GraphicsPDF({
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
            });
            return download;
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-2" style={{ 'backgroundColor': '#282c34' }}>
                    <Image className="mt-2 mx-auto d-block" src={logo} style={{ 'width': '30vw', 'height': '8vh' }} />
                    <h1 className="text-info text-center text-uppercase">Grupo Mave</h1>
                    <div id="_container-buttons" style={{ 'height': '80vh' }}>
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
                <div className="row col-10 overflow-auto" style={{ 'borderLeft': '1px solid #17a2b8', 'height': '100vh', 'backgroundColor': '#282c34' }}>
                    {this.content()}
                </div>
            </div>
        )
    }

    content() {
        // Dashboard
        if (this.state.menu === 'dashboard') {
            return (
                <div className='dashboard'>
                    <div className="Dashboard-view_1">
                        <div className="row ml-2" style={{ 'width': '82vw' }}>
                            <div className="col-12 mt-2" style={{ 'height': 150, 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <h2 className="mt-3 ml-3">
                                    {this.state.username}
                                </h2>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <h3 className="mb-4 ml-3">Departamento - TI</h3>
                            </div>
                            <div className="col-3 mr-2 mt-2 pt-2" style={{ 'height': 100, 'paddingLeft': 10, 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <h1 style={{ 'fontSize': 24 }}><MdRssFeed /> Postos Cobertos</h1>
                                <h2 className="pt-2">{this.state.data.dashboard[0]}</h2>
                            </div>
                            <div className="col-3 mr-2 mt-2 pt-2" style={{ 'height': 100, 'paddingLeft': 10, 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <h1 style={{ 'fontSize': 24 }}><MdRssFeed /> Postos Descobertos</h1>
                                <h2 className="pt-2">{this.state.data.dashboard[1]}</h2>
                            </div>
                            <div className="col-5 mt-2 pt-2" style={{ 'height': 100, 'paddingLeft': 10, 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <h1 style={{ 'fontSize': 24 }}><MdDateRange /> Data e Hora</h1>
                                <h2 className="pt-2">{this.state.clock}</h2>
                            </div>
                        </div>
                        <div className="row ml-2" style={{ 'width': '82vw' }}>
                            <div className="col-3 mt-1 pt-2" style={{ 'height': 180, 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <p className="text-left font-weight-bold" style={{ 'fontSize': 15, 'marginLeft': -8 }}><MdVerifiedUser /> Clientes Importantes Cobertos</p>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <ul className="list-group overflow-auto" style={{ 'marginLeft': -8, 'height': 100 }}>
                                    <li className="list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -14 }}>
                                        <MdMood /> Forest Park
                                        <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -30 }}>
                                        <MdMood /> Pão de Açucar
                                        <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -30 }}>
                                        <MdMood /> Açai Atacadista
                                        <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    </li>
                                </ul>
                            </div>
                            <div className="col-3 ml-2 mt-1 pt-2" style={{ 'height': 180, 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <p className="text-left font-weight-bold" style={{ 'fontSize': 15, 'marginLeft': -8 }}><MdVerifiedUser /> Clientes Importantes Cobertos</p>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <ul className="list-group overflow-auto" style={{ 'marginLeft': -8, 'height': 100 }}>
                                    <li className="list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -14 }}>
                                        <MdMood /> Forest Park
                                        <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -30 }}>
                                        <MdMood /> Pão de Açucar
                                        <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -30 }}>
                                        <MdMood /> Açai Atacadista
                                        <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    </li>
                                </ul>
                            </div>
                            <div className="col-5 ml-2 mt-1 pt-2" style={{ 'height': 180, 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <p className="text-left font-weight-bold" style={{ 'fontSize': 15, 'marginLeft': -8 }}><MdVerifiedUser /> Suas Ultimas Alterações</p>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <ul className="list-group overflow-auto" style={{ 'marginLeft': -8, 'height': 100 }}>
                                    <li className="list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -14 }}>
                                        <MdMood /> Forest Park
                                        <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -30 }}>
                                        <MdMood /> Pão de Açucar
                                        <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 14, 'marginTop': -30 }}>
                                        <MdMood /> Açai Atacadista
                                        <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="Dashboard-view_2">
                        <div className="row" style={{ 'width': '82vw', 'marginLeft': -5 }}>
                            <div className="col-12 mt-2">
                                <div id={'chartContainer-Postos Cobertos'} className="bg-transparent" style={{ 'height': 500, 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                    <p className="text-secondary" style={{ 'marginLeft': 4 }}>Grafico Indisponivel!</p>
                                </div>
                                <p id={'chartDonwload-Postos Cobertos'} className="mt-2" style={{ 'marginLeft': 4 }} onClick={() => { console.log('teste') }} />
                            </div>
                            <div className="col-12 mt-2">
                                <div id={'chartContainer-Postos Descobertos'} className="bg-transparent" style={{ 'height': 500, 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                    <p className="text-secondary" style={{ 'marginLeft': 4 }}>Grafico Indisponivel!</p>
                                </div>
                                <p id={'chartDonwload-Postos Descobertos'} className="mt-2" style={{ 'marginLeft': 4 }} />
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
                                <p className="ml-3" style={{ 'fontSize': 20, 'color': '#0080ff' }}><MdHdrWeak /> Empresa</p>
                                <p className="ml-3" style={{ 'fontSize': 20, 'color': '#0080ff' }}><MdHdrWeak /> Cliente</p>
                                <p className="ml-3" style={{ 'fontSize': 20, 'color': '#0080ff' }}><MdHdrWeak /> Tipo de Serviço</p>
                                <p className="ml-3" style={{ 'fontSize': 20, 'color': '#0080ff' }}><MdHdrWeak /> Função</p>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><p className="ml-2 mt-3" ><MdWork /> Contratos</p></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3 className="ml-2 mt-3 text-secondary"><MdLocalPrintshop /> Relatórios</h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <p className="ml-3" style={{ 'fontSize': 20, 'color': '#0080ff' }}><MdHdrWeak /> Relatório de cadastro de clientes</p>
                                <p className="ml-3" style={{ 'fontSize': 20, 'color': '#0080ff' }}><MdHdrWeak /> Relatório de Contratos</p>
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