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
 * Import Axios
 */
import axios from 'axios';

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
 * Import MDBREACT
 */
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBHamburgerToggler,
    MDBCollapse,
    MDBListGroup,
    MDBListGroupItem
} from 'mdbreact';

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
    MdExitToApp,
    MdVerifiedUser,
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
    MdYoutubeSearchedFor,
    MdMessage,
    MdMailOutline,
    MdPayment,
    MdLockOpen
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
            message: {
                active: false
            },
            usermessages: {
                menu: '',
                data: [],
                selected: 0
            },
            collapse1: false,
            collapseID: '',
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

        window.setInterval(() => {
            this.update();
        }, 1000);

        this.componentCallLoading('stop');
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
        this.updateUserMessages();
    }

    componentDidUpdate(prop, state) {
        if (this.state.menu !== state.menu) {
            animateCSS(this.state.menu, 'fadeInLeft');
            if (this.state.menu === 'dashboard') this.renderChartCanvas();
        }
        if (this.state.usermessages.menu !== state.usermessages.menu) {
            this.useremailanswer();
        }
    }

    componentCallLoading(state) {
        const loadingElement = document.getElementById('ipl-progress-indicator');
        if (loadingElement) {
            if (state === 'stop')
                loadingElement.classList.add('available');
            if (state === 'start')
                loadingElement.classList.remove('available');
        }
    }

    componentCallChangePage(path, state) {
        this.componentCallLoading('start');

        setTimeout(() => {
            this.props.history.push({ pathname: path, state: state });
        }, 1000);
    }

    getApiKey() {
        return "5i@41Yb#!##@P4!NsrvJ-D3DK$Q89-3*Y-#59#$*CW2#!P@U45#q*#$42H4q!63gsQ-64b991IK$R#8r_-$*_46#*1@5s!@A3@_56e36!*@65n517W76_@9P#!$54s@-dQ45#7rtp7-5!2!34@#4Fj44g1-_7-@8-#Smf37Bkg@1D$6-_eT#3@@3PHpPa55q_7@-4-aj2788K_@K1g!913_S72h3$@5#71-g!5vN34*uH834o-7t@t#$@9QH4sp1";
    }

    setClock() {
        this.setState({ clock: this.getClock() });
    }

    getClock = () => {
        return `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getFullYear())} - \n\r\
        ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
    }

    updateUserMessages() {
        if (!this.state.message.active)
            this.getUserMessages((messages) => {
                this.setState({ 'usermessages': { menu: 'list', data: messages, selected: 0 } })
            })
    }

    getUsername() {
        const data = JSON.parse(LZString.decompressFromBase64(localStorage.getItem('auth'))) || null;
        if (!data) return '???';
        return data['name'];
    }

    getUserEmail() {
        const data = JSON.parse(LZString.decompressFromBase64(localStorage.getItem('auth'))) || null;
        if (!data) return '???';
        return data['email'];
    }

    getUserToken() {
        const data = JSON.parse(LZString.decompressFromBase64(localStorage.getItem('auth'))) || null;
        if (!data) return '???';
        return data['token'];
    }

    getUserMessages(callback) {
        axios.get('http://localhost:5000/api/users/messages', {
            headers: {
                'Content-Type': 'application/json',
                'api_key': this.getApiKey(),
                'authorization': this.getUserToken()
            },
            params: {}
        })
            .then((res) => {
                callback(res.data.query.results[0]);
            })
            .catch((err) => {
                if (err) return console.error('Error get for http://localhost:5000/api/users/messages url!', err);
            })
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
                content: "{y} posto(s) coberto(s) em {name}"
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

    useremailanswer() {
        if (this.state.usermessages.menu === 'send' && this.state.usermessages.answer) {
            document.getElementById('message_email-1').value = this.state.usermessages.answer.emitter;
            document.getElementById('message_email-1').classList.add('is-valid');
            document.getElementById('message_email-1').setAttribute('disabled', true);

            document.getElementById('message_email-2').value = this.state.usermessages.answer.copied;
            document.getElementById('message_subject').value = this.state.usermessages.answer.subject;
            document.getElementById('message_textarea').value = this.state.usermessages.answer.message;
        }
    }

    toggleCollapse = collapseID => () => {
        this.setState(prevState => ({ collapseID: (prevState.collapseID !== collapseID ? collapseID : '') }));
    }

    toggleSingleCollapse = collapseId => {
        this.setState({
            ...this.state,
            [collapseId]: !this.state[collapseId]
        });
    }

    setActivatedMenu(menu) {
        this.setState({ ...menu });
    }

    render() {

        return (
            <MDBContainer fluid>
                <MDBRow style={{ 'backgroundColor': '#282c34', 'border': '1px solid #17a2b8' }}>
                    <MDBCol size="12" sm="12" lg="12">
                        <Image className="col-12" src={logo} style={{ 'height': '10vh' }} />
                    </MDBCol>
                    <MDBCol size="12" sm="12" lg="12">
                        <h1 className="text-center text-uppercase" style={{ 'color': '#00d9ff', 'fontSize': 32 }}>Grupo Mave</h1>
                        <hr style={{ 'border': '1px solid #00d9ff', 'width': '30vw' }} />
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol size="12" sm="12" lg="2" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #17a2b8', 'borderTop': '0px' }}>
                        {
                            /* 
                                Menu for Big and XL Monitors
                            */
                        }
                        <MDBRow className="d-none d-lg-block d-xl-block" style={{ 'height': '100vh', 'backgroundColor': '#282c34' }}>
                            <MDBCol size="12" sm="12" lg="12" className="d-none d-lg-block d-xl-block overflow-auto" style={{ 'height': '80vh', 'marginBottom': '15%' }}>
                                <MDBRow className="d-flex flex-column">
                                    <MDBBtn
                                        id="_dashboard"
                                        className="col-10 ml-auto mr-auto"
                                        outline={this.state.menu === 'dashboard' ? false : true}
                                        color="info"
                                        onClick={() => this.setState({ menu: 'dashboard' })}>
                                        <MdDashboard /> Dashboard
                            </MDBBtn>
                                    <MDBBtn
                                        id="_messages"
                                        className="col-10 ml-auto mr-auto"
                                        outline={this.state.menu === 'messages' ? false : true}
                                        color="info"
                                        onClick={() => this.setState({ menu: 'messages' })}>
                                        <MdMessage /> Mensagens(<span style={{ 'color': '#00d9ff' }}>{this.state.usermessages.data.length}</span>)
                            </MDBBtn>
                                    <MDBBtn
                                        id="_comercial"
                                        className="col-10 ml-auto mr-auto"
                                        outline={this.state.menu === 'comercial' ? false : true}
                                        color="info"
                                        onClick={() => this.setState({ menu: 'comercial' })}>
                                        <MdWork /> Comercial
                            </MDBBtn>
                                    <MDBBtn
                                        id="_dp_rh"
                                        className="col-10 ml-auto mr-auto"
                                        outline={this.state.menu === 'dp_rh' ? false : true}
                                        color="info"
                                        onClick={() => this.setState({ menu: 'dp_rh' })}>
                                        <MdFolderShared /> DP/RH
                            </MDBBtn>
                                    <MDBBtn
                                        id="_operacional"
                                        className="col-10 ml-auto mr-auto"
                                        outline={this.state.menu === 'operacional' ? false : true}
                                        color="info"
                                        onClick={() => this.setState({ menu: 'operacional' })}>
                                        <MdSecurity /> Operacional
                            </MDBBtn>
                                    <MDBBtn
                                        id="_financeiro"
                                        className="col-10 ml-auto mr-auto"
                                        outline={this.state.menu === 'financeiro' ? false : true}
                                        color="info"
                                        onClick={() => this.setState({ menu: 'financeiro' })}>
                                        <MdLocalAtm /> Financeiro
                            </MDBBtn>
                                    <MDBBtn
                                        id="_suport"
                                        className="col-10 ml-auto mr-auto"
                                        outline={this.state.menu === 'suport' ? false : true}
                                        color="info"
                                        onClick={() => this.setState({ menu: 'suport' })}>
                                        <MdAnnouncement /> Suporte
                            </MDBBtn>
                                    <MDBBtn
                                        id="_exit"
                                        className="col-10 ml-auto mr-auto"
                                        outline={this.state.menu === 'exit' ? false : true}
                                        color="info"
                                        onClick={() => {
                                            this.setState({ menu: 'exit' });
                                            animateCSS('container-all', 'flash');
                                            sessionStorage.setItem('authRemove', true);
                                            this.state.componentCallChangePage('/', {});
                                        }}>
                                        <MdExitToApp /> Sair
                            </MDBBtn>
                                </MDBRow>
                            </MDBCol>
                        </MDBRow>
                        {
                            /* 
                                Menu for Smartphones, Tablets and Others Devices
                            */
                        }
                        <MDBRow className="d-block d-none d-md-block d-sm-block d-lg-none" style={{ 'backgroundColor': '#282c34' }}>
                            <MDBHamburgerToggler className="ml-3 mt-3 mb-2" color="cyan" id="hamburger1" onClick={() => this.toggleSingleCollapse('collapse1')} />
                            <MDBCollapse isOpen={this.state.collapse1} className="overflow-auto" style={{ 'maxHeight': '50vh', 'width': '100vw' }}>
                                <MDBCol className="m-auto">
                                    <MDBCol>
                                        <MDBRow>
                                            {
                                                /* 
                                                    Menu for Mobile
                                                */
                                            }
                                            <MDBCol size="12" sm="12" lg="12" className="d-block d-sm-none" style={{ 'marginBottom': '15%' }}>
                                                <MDBRow className="d-flex flex-column">
                                                    <MDBBtn
                                                        id="_dashboard"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'dashboard' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'dashboard' })}>
                                                        <MdDashboard /> Dashboard
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_messages"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'messages' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'messages' })}>
                                                        <MdMessage /> Mensagens(<span style={{ 'color': '#00d9ff' }}>{this.state.usermessages.data.length}</span>)
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_comercial"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'comercial' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'comercial' })}>
                                                        <MdWork /> Comercial
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_dp_rh"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'dp_rh' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'dp_rh' })}>
                                                        <MdFolderShared /> DP/RH
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_operacional"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'operacional' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'operacional' })}>
                                                        <MdSecurity /> Operacional
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_financeiro"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'financeiro' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'financeiro' })}>
                                                        <MdLocalAtm /> Financeiro
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_suport"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'suport' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'suport' })}>
                                                        <MdAnnouncement /> Suporte
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_exit"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline
                                                        color="info"
                                                        onClick={() => {
                                                            animateCSS('container-all', 'flash');
                                                            sessionStorage.setItem('authRemove', true);
                                                            this.state.componentCallChangePage('/', {});
                                                        }}>
                                                        <MdExitToApp /> Sair
                                                    </MDBBtn>
                                                </MDBRow>
                                            </MDBCol>
                                            {
                                                /* 
                                                    Menu for Small and Medium Monitors
                                                */
                                            }
                                            <MDBCol size="12" sm="12" lg="12" className="d-none d-md-block d-sm-block d-lg-none m-auto" style={{ 'marginBottom': '15%' }}>
                                                <MDBRow>
                                                    <MDBBtn
                                                        id="_dashboard"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'dashboard' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'dashboard' })}>
                                                        <MdDashboard /> Dashboard
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_messages"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'messages' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'messages' })}>
                                                        <MdMessage /> Mensagens(<span style={{ 'color': '#00d9ff' }}>{this.state.usermessages.data.length}</span>)
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_comercial"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'comercial' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'comercial' })}>
                                                        <MdWork /> Comercial
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_dp_rh"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'dp_rh' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'dp_rh' })}>
                                                        <MdFolderShared /> DP/RH
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_operacional"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'operacional' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'operacional' })}>
                                                        <MdSecurity /> Operacional
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_financeiro"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'financeiro' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'financeiro' })}>
                                                        <MdLocalAtm /> Financeiro
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_suport"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline={this.state.menu === 'suport' ? false : true}
                                                        color="info"
                                                        onClick={() => this.setState({ menu: 'suport' })}>
                                                        <MdAnnouncement /> Suporte
                                                    </MDBBtn>
                                                    <MDBBtn
                                                        id="_exit"
                                                        className="col-8 ml-auto mr-auto"
                                                        outline
                                                        color="info"
                                                        onClick={() => {
                                                            animateCSS('container-all', 'flash');
                                                            sessionStorage.setItem('authRemove', true);
                                                            this.state.componentCallChangePage('/', {});
                                                        }}>
                                                        <MdExitToApp /> Sair
                                                    </MDBBtn>
                                                </MDBRow>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCol>
                                </MDBCol>
                            </MDBCollapse>
                        </MDBRow>
                    </MDBCol>
                    <MDBCol style={{ 'height': '100vh', 'backgroundColor': '#282c34' }}>
                        <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#282c34' }}>
                            <MDBCol size="12">
                                <h1 className="text-justify font-weight-bold p-2 m-2" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 18 }}>
                                    Prezado(a) {this.getUsername()}, esse é o seu resumo referente a todos os seus módulos utilizados no sistema.
                                </h1>
                            </MDBCol>
                            {
                                /* 
                                    Menu for Big and XL Monitors
                                */
                            }
                            {
                                /* 
                                    Information 1
                                */
                            }
                            <MDBCol size="12" className="d-none d-lg-block d-xl-block" style={{ 'backgroundColor': '#2c313a' }}>
                                <h1 className="text-justify font-weight-bold m-auto p-auto" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 18 }}>
                                    <MdRssFeed /> Postos Cobertos<br />
                                    {this.state.data.dashboard[0]}
                                </h1>
                                <div className="text-justify font-weight-bold m-2 p-auto" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 14 }}>
                                    <MdVerifiedUser /> Clientes Importantes Cobertos
                                        <MDBListGroup className="m-2 overflow-auto" style={{ 'height': '10vh', 'backgroundColor': '#2c313a' }}>
                                        <MDBListGroupItem key="Forest_Park" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                        <MDBListGroupItem key="Forest_Park_2" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park 2<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                    </MDBListGroup>
                                </div>
                            </MDBCol>
                            {
                                /* 
                                    Information 2
                                */
                            }
                            <MDBCol size="12" className="d-none d-lg-block d-xl-block" style={{ 'backgroundColor': '#2c313a' }}>
                                <h1 className="text-justify font-weight-bold m-auto p-auto" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 18 }}>
                                    <MdRssFeed /> Postos Descobertos<br />
                                    {this.state.data.dashboard[1]}
                                </h1>
                                <div className="text-justify font-weight-bold m-auto p-auto" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 14 }}>
                                    <MdVerifiedUser /> Clientes Importantes Descobertos
                                        <MDBListGroup className="m-2 overflow-auto" style={{ 'height': '10vh', 'backgroundColor': '#2c313a' }}>
                                        <MDBListGroupItem key="Forest_Park_3" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park 3<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                        <MDBListGroupItem key="Forest_Park_4" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park 4<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                    </MDBListGroup>
                                </div>
                            </MDBCol>
                            {
                                /*
                                    Information 3
                                */
                            }
                            <MDBCol size="6" className="d-none d-lg-block d-xl-block mt-2">
                                <div id={'chartContainer-Postos Cobertos'} className="bg-transparent" style={{ 'height': '50vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                    <p className="text-secondary" style={{ 'marginLeft': 4 }}>Grafico Indisponivel!</p>
                                </div>
                                <p id={'chartDonwload-Postos Cobertos'} className="mt-2" style={{ 'marginLeft': 4 }} onClick={() => { console.log('teste') }} />
                            </MDBCol>
                            <MDBCol size="6" className="d-none d-lg-block d-xl-block mt-2">
                                <div id={'chartContainer-Postos Descobertos'} className="bg-transparent" style={{ 'height': '50vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                    <p className="text-secondary" style={{ 'marginLeft': 4 }}>Grafico Indisponivel!</p>
                                </div>
                                <p id={'chartDonwload-Postos Descobertos'} className="mt-2" style={{ 'marginLeft': 4 }} onClick={() => { console.log('teste') }} />
                            </MDBCol>
                            {
                                /* 
                                    Menu for Mobile
                                */
                            }
                            {
                                /* 
                                    Information 1
                                */
                            }
                            <MDBCol size="12" className="d-block d-sm-none" style={{ 'backgroundColor': '#2c313a' }}>
                                <h1 className="text-justify font-weight-bold m-auto pt-2" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 18 }}>
                                    <MdRssFeed /> Postos Cobertos<br />
                                    {this.state.data.dashboard[0]}
                                </h1>
                            </MDBCol>
                            {
                                /* 
                                    Information 2
                                */
                            }
                            <MDBCol size="12" className="d-block d-sm-none mb-1" style={{ 'backgroundColor': '#2c313a' }}>
                                <div className="text-justify font-weight-bold m-auto pt-2" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff' }}>
                                    <MdVerifiedUser /> Clientes Importantes Cobertos
                                        <MDBListGroup className="m-2 overflow-auto" style={{ 'height': '10vh', 'backgroundColor': '#2c313a' }}>
                                        <MDBListGroupItem key="Forest_Park" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                        <MDBListGroupItem key="Forest_Park_2" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park 2<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                    </MDBListGroup>
                                </div>
                            </MDBCol>
                            {
                                /* 
                                    Information 3
                                */
                            }
                            <MDBCol size="12" className="d-block d-sm-none" style={{ 'backgroundColor': '#2c313a' }}>
                                <h1 className="text-justify font-weight-bold m-auto pt-2" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 18 }}>
                                    <MdRssFeed /> Postos Descobertos<br />
                                    {this.state.data.dashboard[1]}
                                </h1>
                            </MDBCol>
                            {
                                /* 
                                    Information 4
                                */
                            }
                            <MDBCol size="12" className="d-block d-sm-none mb-1" style={{ 'backgroundColor': '#2c313a' }}>
                                <div className="text-justify font-weight-bold m-auto pt-2" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff' }}>
                                    <MdLockOpen /> Clientes Importantes Descobertos
                                        <MDBListGroup className="m-2 overflow-auto" style={{ 'height': '10vh', 'backgroundColor': '#2c313a' }}>
                                        <MDBListGroupItem key="Forest_Park_3" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park 3<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                        <MDBListGroupItem key="Forest_Park_4" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park 4<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                    </MDBListGroup>
                                </div>
                            </MDBCol>
                            {
                                /* 
                                    Information 1
                                */
                            }
                            <MDBCol size="12" className="d-none d-md-block d-sm-block d-lg-none" style={{ 'backgroundColor': '#2c313a' }}>
                                <h1 className="text-justify font-weight-bold m-auto" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 18 }}>
                                    <MdRssFeed /> Postos Cobertos<br />
                                    {this.state.data.dashboard[0]}
                                </h1>
                            </MDBCol>
                            <MDBCol size="12" className="d-none d-md-block d-sm-block d-lg-none mb-1" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 14 }}>
                                <div className="text-justify font-weight-bold m-auto pt-2" style={{ 'backgroundColor': '#2c313a' }}>
                                    <MdVerifiedUser /> Clientes Importantes Cobertos
                                        <MDBListGroup className="m-2 overflow-auto" style={{ 'height': '10vh', 'backgroundColor': '#2c313a' }}>
                                        <MDBListGroupItem key="Forest_Park" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                        <MDBListGroupItem key="Forest_Park_2" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park 2<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                    </MDBListGroup>
                                </div>
                            </MDBCol>
                            {
                                /* 
                                    Information 2
                                */
                            }
                            <MDBCol size="12" className="d-none d-md-block d-sm-block d-lg-none" style={{ 'backgroundColor': '#2c313a' }}>
                                <h1 className="text-justify font-weight-bold m-auto" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 18 }}>
                                    <MdRssFeed /> Postos Descobertos<br />
                                    {this.state.data.dashboard[1]}
                                </h1>
                            </MDBCol>
                            <MDBCol size="12" className="d-none d-md-block d-sm-block d-lg-none mb-1" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'fontSize': 14 }}>
                                <div className="text-justify font-weight-bold m-auto pt-2" style={{ 'backgroundColor': '#2c313a' }}>
                                    <MdVerifiedUser /> Clientes Importantes Cobertos
                                        <MDBListGroup className="m-2 overflow-auto" style={{ 'height': '10vh', 'backgroundColor': '#2c313a' }}>
                                        <MDBListGroupItem key="Forest_Park_3" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                        <MDBListGroupItem key="Forest_Park_4" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #2c313a' }}>
                                            <MdMood /> Forest Park 2<br />
                                            <MdPayment /> R$ 1.350.000.00
                                            </MDBListGroupItem>
                                    </MDBListGroup>
                                </div>
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer >
        )
    }

    content(props) {
        /**
         * Dashboard
         */
        if (props.state.menu === 'dashboard') {
            return (
                <div className='dashboard'>
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
        /**
         * Messages
         */
        else if (this.state.menu === 'messages') {
            if (this.state.usermessages.menu === 'list') {
                let messages = this.state.usermessages.data.map(message => {
                    return <li className="list-group-item border-0 bg-transparent font-weight-bold" style={{ 'fontSize': 18, 'marginTop': -20 }}>
                        <Button
                            className={`col mt-2 mr-3 text-left font-weight-bold ${message['new'] ? '' : 'disabled'}`}
                            style={{ 'color': '#00d9ff', 'fontSize': 18 }}
                            variant="outline-info"
                            size="lg"
                            block
                            onClick={() => {
                                animateCSS('messages', 'fadeIn');
                                this.getUserMessages((messages) => {
                                    this.setState({ 'message': { 'active': true }, 'usermessages': { menu: 'message', data: messages, selected: message['id'] } })
                                });
                            }}>
                            <MdPersonPin /> Por: {message['author']}<br />
                            <MdMailOutline /> Assunto: {message['subject']}<br />
                            <MdMessage /> Resumo: {String(message['message']).slice(0, 100)}...
                        </Button>
                    </li>
                });
                return (
                    <div className='messages'>
                        <div className="Messages-view_1">
                            <div className="row ml-2" style={{ 'width': '82vw' }}>
                                <div className="col-12 mt-2" style={{ 'height': '5vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                    <p className="text-left font-weight-bold pl-2 pt-2" style={{ 'fontSize': 18, 'color': '#00d9ff' }}>
                                        Prezado(a) {this.getUsername()}, {this.state.usermessages.data.length <= 0 ? `você não tem mensagens.` : `você tem novas mensagens.`}
                                    </p>
                                </div>
                                <div className="col-12 mt-2" style={{ 'height': '80vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                    <p className="text-left font-weight-bold pl-2 pt-2" style={{ 'fontSize': 20, 'color': '#00d9ff' }}>
                                        Caixa de entrada
                                    </p>
                                    <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    <ul className="list-group overflow-auto" style={{ 'height': '70vh' }}>
                                        {messages}
                                    </ul>
                                </div>
                                <ButtonToolbar>
                                    <Button
                                        className="col mt-2 mr-3"
                                        style={{ 'color': '#00d9ff', 'fontSize': 18 }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => {
                                            animateCSS('messages', 'fadeIn');
                                            this.getUserMessages((messages) => {
                                                this.setState({ 'message': { 'active': true }, 'usermessages': { menu: 'send', data: messages, selected: 0 } })
                                            });
                                        }}>
                                        <MdHdrWeak /><br /> Novo email
                                    </Button>
                                    <Button
                                        className={"col mt-2 mr-3"}
                                        style={{ 'color': '#00d9ff', 'fontSize': 18 }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        disabled={this.state.usermessages.data.length <= 0}
                                        onClick={() => {
                                            axios.delete(`http://localhost:5000/api/users/messages/remove`, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'api_key': this.getApiKey(),
                                                    'authorization': this.getUserToken()
                                                },
                                                data: {
                                                    email: this.getUserEmail()
                                                }
                                            })
                                                .then((res) => {
                                                    animateCSS('messages', 'fadeIn');
                                                    this.getUserMessages((messages) => {
                                                        this.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                    });
                                                })
                                                .catch((err) => {
                                                    animateCSS('messages', 'fadeIn');
                                                    this.getUserMessages((messages) => {
                                                        this.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                    });
                                                    if (err) return console.error('Error get for http://localhost:5000/api/users/messages/remove url!', err);
                                                })
                                        }}>
                                        <MdHdrWeak /><br /> Remover todos os emails
                                    </Button>
                                </ButtonToolbar>
                            </div>
                        </div>
                    </div>
                )
            } else if (this.state.usermessages.menu === 'message') {
                let selected = this.state.usermessages.data.filter(message => { return message['id'] === this.state.usermessages.selected })[0];
                return (
                    <div className='messages'>
                        <div className="Messages-view_1">
                            <div className="row ml-2" style={{ 'width': '82vw' }}>
                                <div className="col-12 mt-2" style={{ 'height': '5vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                    <p className="text-left font-weight-bold pl-2 pt-2" style={{ 'fontSize': 18, 'color': '#00d9ff' }}>
                                        Prezado(a) {this.getUsername()}, {this.state.usermessages.data.length <= 0 ? `você não tem mensagens.` : `você tem novas mensagens.`}
                                    </p>
                                </div>
                                <div className="col-12 mt-2" style={{ 'height': '80vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                    <p className="text-left font-weight-bold pl-2 pt-2 col-12" style={{ 'fontSize': 18, 'color': '#00d9ff' }}>
                                        De: {selected['emitter']}<br />
                                        Para: {selected['receiver']}<br />
                                        Cc: {selected['copied']}<br />
                                        Enviado em: {selected['dateAt']}
                                    </p>
                                    <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    <h1>{selected['subject']}</h1>
                                    <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                    <p>
                                        {selected['message'].split('\n').map(i => {
                                            return <p>{i}</p>
                                        })}
                                    </p>
                                </div>
                                <ButtonToolbar>
                                    <Button
                                        className="col mt-2 mr-5"
                                        style={{ 'color': '#00d9ff', 'fontSize': 18 }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => {
                                            animateCSS('messages', 'fadeIn');
                                            this.getUserMessages((messages) => {
                                                this.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                            });
                                        }}>
                                        <MdHdrWeak /><br /> Retornar
                                    </Button>
                                    <Button
                                        className="col mt-2 mr-3"
                                        style={{ 'color': '#00d9ff', 'fontSize': 18 }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => {
                                            animateCSS('messages', 'fadeIn');
                                            this.getUserMessages((messages) => {
                                                const
                                                    subject = `Resposta de ${this.getUsername()} sobre '${selected['subject']}'`,
                                                    message = `---Anterior por ${selected['author']}\n\r${selected['message']}\n\r---Resposta por ${this.getUsername()}\n\r`;
                                                this.setState({
                                                    'message': { 'active': true }, 'usermessages': {
                                                        menu: 'send', answer: {
                                                            emitter: selected['emitter'],
                                                            copied: selected['copied'],
                                                            subject: subject,
                                                            message: message
                                                        }, data: messages, selected: 0
                                                    }
                                                })
                                            });
                                        }}>
                                        <MdHdrWeak /><br /> Responder
                                    </Button>
                                    <Button
                                        className="col mt-2 mr-3"
                                        style={{ 'color': '#00d9ff', 'fontSize': 18 }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /><br /> Encaminhar
                                    </Button>
                                    <Button
                                        className="col mt-2 mr-3"
                                        style={{ 'color': '#00d9ff', 'fontSize': 18 }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => {
                                            axios.delete(`http://localhost:5000/api/users/messages/remove/${selected['id']}`, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'api_key': this.getApiKey(),
                                                    'authorization': this.getUserToken()
                                                },
                                                data: {
                                                    email: this.getUserEmail()
                                                }
                                            })
                                                .then((res) => {
                                                    animateCSS('messages', 'fadeIn');
                                                    this.getUserMessages((messages) => {
                                                        this.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                    });
                                                })
                                                .catch((err) => {
                                                    animateCSS('messages', 'fadeIn');
                                                    this.getUserMessages((messages) => {
                                                        this.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                    });
                                                    if (err) return console.error('Error get for http://localhost:5000/api/users/messages/remove url!', err);
                                                })
                                        }}>
                                        <MdHdrWeak /><br /> Remover
                                    </Button>
                                </ButtonToolbar>
                            </div>
                        </div>
                    </div >
                )
            } else if (this.state.usermessages.menu === 'send') {
                const context = this;
                return (
                    <div className='messages'>
                        <div className="Messages-view_1">
                            <div className="row ml-2" style={{ 'width': '82vw' }}>
                                <div className="col-12 mt-2" style={{ 'height': '5vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                    <p className="text-left font-weight-bold pl-2 pt-2" style={{ 'fontSize': 18, 'color': '#00d9ff' }}>
                                        Prezado(a) {this.getUsername()}, {this.state.usermessages.data.length <= 0 ? `você não tem mensagens.` : `você tem novas mensagens.`}
                                    </p>
                                </div>
                                <div className="col-12 mt-2 message-form-all" style={{ 'height': '82vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                    <div className="form-group mt-2">
                                        <label htmlFor="message_email-1">Destinatário:</label>
                                        <input type="text" className="form-control" id="message_email-1" placeholder="Endereço de email" onChange={context.handleEmailExist.bind(context, '1')} style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }} />
                                    </div>
                                    <div className="form-group mt-2">
                                        <label htmlFor="message_email-2">Cc:</label>
                                        <input type="text" className="form-control" id="message_email-2" placeholder="Endereço de email" onChange={context.handleEmailExist.bind(context, '2')} style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }} />
                                    </div>
                                    <div className="form-group mt-2">
                                        <label htmlFor="message_subject">Assunto:</label>
                                        <input type="text" className="form-control" id="message_subject" placeholder="Defina o assunto" style={{ 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }} />
                                    </div>
                                    <div className="form-group mt-2">
                                        <label htmlFor="message_textarea">Mensagem:</label>
                                        <textarea className="form-control" id="message_textarea" style={{ 'height': '45vh', 'resize': 'none', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }} />
                                    </div>
                                </div>
                                <ButtonToolbar>
                                    <Button
                                        className="col mt-2 mr-5"
                                        style={{ 'color': '#00d9ff', 'fontSize': 18 }}
                                        variant="outline-info"
                                        size="sm"
                                        block
                                        onClick={() => {
                                            animateCSS('messages', 'fadeIn');
                                            this.getUserMessages((messages) => {
                                                this.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                            });
                                        }}>
                                        <MdHdrWeak /><br /> Descartar
                                    </Button>
                                    <Button
                                        className="col mt-2 mr-3"
                                        style={{ 'color': '#00d9ff', 'fontSize': 18 }}
                                        variant="outline-info"
                                        size="sm"
                                        block
                                        onClick={() => {

                                            const
                                                receiver = document.getElementById('message_email-1').value,
                                                copied = document.getElementById('message_email-2').value,
                                                subject = document.getElementById('message_subject').value,
                                                message = document.getElementById('message_textarea').value,
                                                username = this.getUsername();

                                            if (
                                                String(receiver).length <= 0 ||
                                                String(subject).length <= 0 ||
                                                String(message).length <= 0 ||
                                                (
                                                    !document.getElementById('message_email-1').classList.contains('is-valid') ||
                                                    (String(copied).length > 0 && !document.getElementById('message_email-2').classList.contains('is-valid'))
                                                )
                                            ) return animateCSS('message-form-all', 'shake');


                                            const send = function (api_key, user_token, context, emitter, receiver, copied, subject, message) {

                                                return new Promise((resolve, reject) => {
                                                    axios.post('http://localhost:5000/api/users/messages/send', {
                                                        "author": String(username),
                                                        "emitter": String(emitter),
                                                        "receiver": String(receiver),
                                                        "copied": String(copied),
                                                        "subject": String(subject),
                                                        "message": String(message)
                                                    }, {
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'api_key': String(api_key),
                                                            'authorization': String(user_token)
                                                        }
                                                    })
                                                        .then((res) => {
                                                            animateCSS('messages', 'fadeIn');
                                                            resolve();
                                                            context.getUserMessages((messages) => {
                                                                context.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                            });
                                                        })
                                                        .catch((err) => {
                                                            document.getElementById('message_email-1').value = '';
                                                            document.getElementById('message_email-2').value = '';
                                                            document.getElementById('message_subject').value = '';
                                                            document.getElementById('message_textarea').value = '';
                                                            reject();
                                                            animateCSS('messages', 'fadeIn');
                                                            context.getUserMessages((messages) => {
                                                                context.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                            });
                                                            if (err) return console.error('Error get for http://localhost:5000/api/users/messages/send url!', err);
                                                        })
                                                })
                                            }

                                            if (String(copied).length > 0) {
                                                send(this.getApiKey(), this.getUserToken(), this, this.getUserEmail(), receiver, copied, subject, message)
                                                    .then(() => {
                                                        send(this.getApiKey(), this.getUserToken(), this, this.getUserEmail(), copied, '', subject, message)
                                                    })
                                            } else {
                                                send(this.getApiKey(), this.getUserToken(), this, this.getUserEmail(), receiver, '', subject, message)
                                            }
                                        }}>
                                        <MdHdrWeak /><br /> Enviar
                                    </Button>
                                </ButtonToolbar>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        /**
         * Comercial
         */
        else if (this.state.menu === 'comercial') {
            return (
                <div className='comercial'>
                    <div className="Comercial-view_1">
                        <div className="row ml-2" style={{ 'width': '82vw' }}>
                            <div className="col-12 mt-2" style={{ 'height': '5vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <p className="text-left font-weight-bold pl-2 pt-2" style={{ 'fontSize': 18, 'color': '#00d9ff' }}>
                                    Prezado(a) {this.getUsername()}, você está utilizando o módulo comercial no momento.
                                </p>
                            </div>
                            <div className="col-12 mt-2 mb-2" style={{ 'height': '100vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <h1 className="mt-3 ml-3">
                                    <MdAssignment /> Cadastros
                                </h1>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <ButtonToolbar>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Empresa
                                    </Button>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Cliente
                                    </Button>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Tipo de Serviço
                                    </Button>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Função
                                    </Button>
                                </ButtonToolbar>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <h1 className="mt-3 ml-3">
                                    <MdWork /> Contratos
                                </h1>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <ButtonToolbar>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Registrar
                                    </Button>
                                </ButtonToolbar>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <h1 className="mt-3 ml-3">
                                    <MdLocalPrintshop /> Relatórios
                                </h1>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <ButtonToolbar>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de cadastro de clientes
                                    </Button>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de Contratos
                                    </Button>
                                </ButtonToolbar>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        // DP/RH
        else if (this.state.menu === 'dp_rh') {
            return (
                <div className='dp_rh'>
                    <div className="Dp_rh-view_1">
                        <div className="row ml-2" style={{ 'width': '82vw' }}>
                            <div className="col-12 mt-2" style={{ 'height': '5vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <p className="text-left font-weight-bold pl-2 pt-2" style={{ 'fontSize': 18, 'color': '#00d9ff' }}>
                                    Prezado(a) {this.getUsername()}, você está utilizando o módulo DP/RH no momento.
                                </p>
                            </div>
                            <div className="col-12 mt-2 mb-2" style={{ 'height': '100vh', 'backgroundColor': '#2c313a', 'color': '#00d9ff', 'border': '1px solid #17a2b8', 'borderRadius': 5 }}>
                                <h1 className="mt-3 ml-3">
                                    <MdPersonAdd /> Cadastro de Funcionários
                                </h1>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <ButtonToolbar>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Cadastrar
                                    </Button>
                                </ButtonToolbar>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <h1 className="mt-3 ml-3">
                                    <MdLocalAtm /> Valores e Regras
                                </h1>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <ButtonToolbar>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Definir valores
                                    </Button>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Definir regras
                                    </Button>
                                </ButtonToolbar>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <h1 className="mt-3 ml-3">
                                    <MdTimer /> Escala
                                </h1>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <ButtonToolbar>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Nova escala
                                    </Button>
                                </ButtonToolbar>
                                <hr style={{ 'backgroundColor': '#00d9ff' }} />
                                <h1 className="mt-3 ml-3">
                                    <MdLocalPrintshop /> Relatórios
                                </h1>
                                <ButtonToolbar>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de cadastro de funcionários
                                    </Button>
                                    <Button
                                        style={{ 'color': '#00d9ff' }}
                                        variant="outline-info"
                                        size="lg"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de Contratos
                                    </Button>
                                </ButtonToolbar>
                            </div>
                        </div>
                    </div>
                </div>
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
                                <h3><button className="ml-2 mt-3" ><MdPersonPin /> Alocação de Funcionários</button></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><button className="ml-2 mt-3" ><MdConfirmationNumber /> Confirmação de Presença</button></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><button className="ml-2 mt-3" ><MdBuild /> Manutenção de Apontamentos</button></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><button className="ml-2 mt-3" ><MdAvTimer /> Calculo de Pagamentos</button></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3><button className="ml-2 mt-3" ><MdYoutubeSearchedFor /> Conferência de Pagamentos</button></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3 className="ml-2 mt-3 text-secondary"><MdLocalPrintshop /> Relatórios</h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <button className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Alocações</button><br />
                                <button className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Confirmação de Presenças</button><br />
                                <button className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Apontamentos</button><br />
                                <button className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Conferências</button><br />
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
                                <h3><button className="ml-2 mt-3" ><MdPersonAdd /> Pagamentos</button></h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <h3 className="ml-2 mt-3 text-secondary"><MdLocalPrintshop /> Relatórios</h3>
                                <hr style={{ 'marginRight': 20 }} />
                                <button className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Relatório de Pagamentos</button><br />
                                <button className="ml-3" style={{ 'fontSize': 20 }}><MdHdrWeak /> Recibos</button><br />
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

    handleEmailExist(id) {
        const
            email = document.getElementById(`message_email-${id}`).value,
            validation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

        if (String(email).length <= 0) {
            if (
                document.getElementById(`message_email-${id}`).classList.contains('is-invalid') ||
                document.getElementById(`message_email-${id}`).classList.contains('is-valid')
            ) {
                document.getElementById(`message_email-${id}`).classList.remove('is-invalid');
                document.getElementById(`message_email-${id}`).classList.remove('is-valid');
            }
            return;
        }
        else if (!validation.test(String(email))) {
            if (
                document.getElementById(`message_email-${id}`).classList.contains('is-invalid') ||
                document.getElementById(`message_email-${id}`).classList.contains('is-valid')
            ) {
                document.getElementById(`message_email-${id}`).classList.remove('is-invalid');
                document.getElementById(`message_email-${id}`).classList.remove('is-valid');
            }
            return;
        };

        axios.get('http://localhost:5000/api/users', {
            headers: {
                'Content-Type': 'application/json',
                'api_key': this.getApiKey()
            },
            params: {
                email: String(email)
            }
        })
            .then((response) => {
                const users = response.data.query.results;

                if (users.length > 0) {
                    if (
                        document.getElementById(`message_email-${id}`).classList.contains('is-invalid') ||
                        !document.getElementById(`message_email-${id}`).classList.contains('is-valid')
                    ) {
                        document.getElementById(`message_email-${id}`).classList.remove('is-invalid');
                        document.getElementById(`message_email-${id}`).classList.add('is-valid');
                    }
                } else {
                    if (
                        document.getElementById(`message_email-${id}`).classList.contains('is-valid') ||
                        !document.getElementById(`message_email-${id}`).classList.contains('is-invalid')
                    ) {
                        document.getElementById(`message_email-${id}`).classList.remove('is-valid');
                        document.getElementById(`message_email-${id}`).classList.add('is-invalid');
                    }
                }
            })
            .catch((error) => {
                animateCSS('alertUser', 'fadeOutDown', () => {
                    document.getElementById(`message_email-${id}`).classList.remove('is-invalid');
                    document.getElementById(`message_email-${id}`).classList.remove('is-valid');
                });
            })
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