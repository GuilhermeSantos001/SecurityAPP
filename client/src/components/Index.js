/**
 * Import React
 */
import React from "react";
import ReactDOM from 'react-dom'

/**
 * Import Axios
 */
import axios from 'axios';

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
 * Import MDBREACT
 */
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBInput,
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
    MdAndroid,
    MdDashboard,
    MdWork,
    MdAnnouncement,
    MdRssFeed,
    MdSupervisorAccount,
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
    MdGavel,
    MdInfo,
    MdCheck,
    MdClose,
    MdLock,
    MdWarning
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
            update: true,
            menu: 'dashboard',
            clock: this.getClock(),
            username: this.getUsername(),
            definitionlevelaccess: {},
            message: {
                active: false
            },
            usermessages: {
                menu: 'list',
                data: [],
                selected: 0
            },
            send_email: false,
            administratormenus: {
                menu: 'default',
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
                            color: '#282c34',
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
                            color: '#282c34',
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
                            color: '#282c34',
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
                            color: '#282c34',
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

        window.setTimeout(() => {
            this.componentCallLoading('stop');
        }, 1500);

        this.renderChartCanvas();

        axios.defaults.baseURL = 'http://localhost:5000';

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
        if (this.state.update) {
            this.setClock();
            this.updateUserMessages();
            this.updateDefinitionsLevelAccess();
        }
    }

    componentDidUpdate(prop, state) {
        if (this.state.menu !== state.menu) {
            animateCSS(this.state.menu, 'fadeIn');
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

    updateDefinitionsLevelAccess() {
        this.getDefinitionslevelaccess((definitions) => {
            this.setState({ 'definitionlevelaccess': definitions });
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

    getUserWebtoken() {
        const data = JSON.parse(LZString.decompressFromBase64(localStorage.getItem('auth'))) || null;
        if (!data) return '???';
        return data['webtoken'];
    }

    getUserMessages(callback) {
        axios.get('/api/users/messages',
            {
                headers: {
                    "content-type": 'application/json',
                    "api_key": this.getApiKey(),
                    "authorization": this.getUserToken()
                }
            })
            .then((data) => {
                if (!data['error']) {
                    data = data['data']['query']['results'];

                    if (data instanceof Array)
                        return callback(data[0]);
                }
            })
            .catch((err) => {
                return new Error(err);
            })
    }

    getDefinitionslevelaccess(callback) {
        axios.get('/api/users/levelaccess',
            {
                headers: {
                    "content-type": 'application/json',
                    "api_key": this.getApiKey(),
                    "authorization": this.getUserToken()
                }
            })
            .then((data) => {
                if (!data['error']) {
                    data = data['data']['query']['results'];

                    if (data instanceof Object)
                        return callback(data);
                }
            })
            .catch((err) => {
                return new Error(err);
            })
    }

    getlevelaccess(callback) {
        axios.get('/api/adm/sign/levelaccess', {
            headers: {
                "content-type": "application/json",
                "api_key": this.getApiKey()
            },
            params: {
                webtoken: this.getUserWebtoken()
            }
        })
            .then((data) => {
                if (!data['error']) {
                    return callback(data['data']['query']['results']);
                }
            })
            .catch((err) => {
                return new Error(err);
            })
    }

    renderChartCanvas() {
        this.chartCanvas('Postos Cobertos');
        this.chartCanvas('Postos Descobertos');
    }

    chartCanvas(graphic) {
        const options = {
            title: {
                fontColor: "#282c34",
                text: graphic,
                fontSize: 42,
                padding: {
                    top: 10
                }
            },
            legend: {
                fontColor: "#282c34"
            },
            axisX: {
                margin: 10,
                labelFontColor: "#282c34",
                lineColor: "#282c34",
                tickColor: "#282c34",
                gridColor: "#282c34"
            },
            axisY: {
                margin: 10,
                labelFontColor: "#282c34",
                lineColor: "#282c34",
                tickColor: "#282c34",
                gridColor: "#282c34"
            },
            backgroundColor: "#f2f2f2",
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
            if (this.state.usermessages.answer.forward)
                document.getElementById('message_subject').setAttribute('disabled', true);

            document.getElementById('message_textarea').value = this.state.usermessages.answer.message;
            if (this.state.usermessages.answer.forward)
                document.getElementById('message_textarea').setAttribute('disabled', true);

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
                !document.getElementById(`message_email-${id}`).classList.contains('is-invalid')
            ) {
                document.getElementById(`message_email-${id}`).classList.add('is-invalid');
                document.getElementById(`message_email-${id}`).classList.remove('is-valid');
            }
            return;
        } else {
            if (
                document.getElementById(`message_email-${id}`).classList.contains('is-invalid')
            ) {
                document.getElementById(`message_email-${id}`).classList.remove('is-invalid');
                document.getElementById(`message_email-${id}`).classList.add('is-valid');
            }
        }
    }

    render() {
        return (
            <MDBContainer className="container-all" fluid>
                <MDBRow style={{ 'height': '100vh' }}>
                    <MDBCol size="12" sm="12" lg="2" style={{ 'backgroundColor': '#282c34', 'border': '1px solid #17a2b8', 'borderLeft': '0px', 'borderTop': '0px' }}>
                        <MDBCol size="12" sm="12" lg="12">
                            <Image className="col-12" src={logo} style={{ 'height': '10vh' }} />
                        </MDBCol>
                        <MDBCol size="12" sm="12" lg="12">
                            <h1 className="text-center text-uppercase" style={{ 'color': '#f2f2f2', 'fontSize': 20 }}>Grupo Mave</h1>
                            <h1 className="text-center text-uppercase" style={{ 'color': '#f2f2f2', 'fontSize': 14 }}>Seu Patrimonio em boas mãos</h1>
                            <h1 className="text-center text-capitalize" style={{ 'color': '#f2f2f2', 'fontSize': 14 }}>Olá Sr(a). {this.getUsername()}.</h1>
                        </MDBCol>
                        <MDBCol size="12" className="overflow-auto" style={{ 'height': '70vh' }}>
                            <MDBRow style={{ 'backgroundColor': '#282c34', 'height': '70vh' }}>
                                {
                                    this.state.definitionlevelaccess['administrator'] ? (
                                        <MDBBtn
                                            id="_administrator"
                                            outline={this.state.menu === 'administrator' ? false : true}
                                            color="white"
                                            className="col-12"
                                            style={{ 'marginLeft': 0, 'fontSize': 11 }}
                                            onClick={() => this.setState({ menu: 'administrator' })}>
                                            <MdAndroid /> Administrator
                                        </MDBBtn>
                                    ) : false
                                }
                                <MDBBtn
                                    id="_dashboard"
                                    className="col-10 ml-auto mr-auto"
                                    outline={this.state.menu === 'dashboard' ? false : true}
                                    color="white"
                                    className="col-12"
                                    style={{ 'marginLeft': 0, 'fontSize': 11 }}
                                    disabled={this.state.definitionlevelaccess['dashboard'] ? false : true}
                                    onClick={() => this.setState({ menu: 'dashboard' })}>
                                    <MdDashboard /> Dashboard
                                </MDBBtn>
                                <MDBBtn
                                    id="_messages"
                                    className="col-10 ml-auto mr-auto"
                                    outline={this.state.menu === 'messages' ? false : true}
                                    color="white"
                                    className="col-12"
                                    style={{ 'marginLeft': 0, 'fontSize': 11 }}
                                    disabled={this.state.definitionlevelaccess['messages'] ? false : true}
                                    onClick={() => this.setState({ menu: 'messages' })}>
                                    <MdMessage /> Mensagens(<span>{this.state.usermessages.data.length}</span>)
                                </MDBBtn>
                                <MDBBtn
                                    id="_comercial"
                                    className="col-10 ml-auto mr-auto"
                                    outline={this.state.menu === 'comercial' ? false : true}
                                    color="white"
                                    className="col-12"
                                    style={{ 'marginLeft': 0, 'fontSize': 11 }}
                                    disabled={this.state.definitionlevelaccess['comercial'] ? false : true}
                                    onClick={() => this.setState({ menu: 'comercial' })}>
                                    <MdWork /> Comercial
                                </MDBBtn>
                                <MDBBtn
                                    id="_dp_rh"
                                    className="col-10 ml-auto mr-auto"
                                    outline={this.state.menu === 'dp_rh' ? false : true}
                                    color="white"
                                    className="col-12"
                                    style={{ 'marginLeft': 0, 'fontSize': 11 }}
                                    disabled={this.state.definitionlevelaccess['dp_rh'] ? false : true}
                                    onClick={() => this.setState({ menu: 'dp_rh' })}>
                                    <MdFolderShared /> DP/RH
                                </MDBBtn>
                                <MDBBtn
                                    id="_operacional"
                                    className="col-10 ml-auto mr-auto"
                                    outline={this.state.menu === 'operacional' ? false : true}
                                    color="white"
                                    className="col-12"
                                    style={{ 'marginLeft': 0, 'fontSize': 11 }}
                                    disabled={this.state.definitionlevelaccess['operacional'] ? false : true}
                                    onClick={() => this.setState({ menu: 'operacional' })}>
                                    <MdSecurity /> Operacional
                                </MDBBtn>
                                <MDBBtn
                                    id="_financeiro"
                                    className="col-10 ml-auto mr-auto"
                                    outline={this.state.menu === 'financeiro' ? false : true}
                                    color="white"
                                    className="col-12"
                                    style={{ 'marginLeft': 0, 'fontSize': 11 }}
                                    disabled={this.state.definitionlevelaccess['financeiro'] ? false : true}
                                    onClick={() => this.setState({ menu: 'financeiro' })}>
                                    <MdLocalAtm /> Financeiro
                                </MDBBtn>
                                <MDBBtn
                                    id="_suport"
                                    className="col-10 ml-auto mr-auto"
                                    outline={this.state.menu === 'suport' ? false : true}
                                    color="white"
                                    className="col-12"
                                    style={{ 'marginLeft': 0, 'fontSize': 11 }}
                                    onClick={() => this.setState({ menu: 'suport' })}>
                                    <MdAnnouncement /> Suporte
                                </MDBBtn>
                                <MDBBtn
                                    id="_exit"
                                    className="col-10 ml-auto mr-auto"
                                    outline={this.state.menu === 'exit' ? false : true}
                                    color="white"
                                    className="col-12"
                                    style={{ 'marginLeft': 0, 'fontSize': 11 }}
                                    onClick={() => {
                                        this.setState({ menu: 'exit', update: false });
                                        animateCSS('container-all', 'flash');
                                        sessionStorage.setItem('authRemove', true);
                                        this.componentCallChangePage('/', {});
                                    }}>
                                    <MdExitToApp /> Sair
                                </MDBBtn>
                            </MDBRow>
                        </MDBCol>
                    </MDBCol>
                    {this.content()}
                </MDBRow>
            </MDBContainer>
        )
    }

    content() {
        /**
         * Administrator
         */
        if (this.state.menu === 'administrator') {
            if (this.state.administratormenus.menu === 'default') {
                return (
                    <MDBCol className='administrator' style={{ 'height': '100vh', 'backgroundColor': '#282c34' }}>
                        <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                            <MDBCol size="12" className="mt-2" style={{ 'backgroundColor': '#f2f2f2' }}>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                    <MdAssignment /> Chave de acesso
                                </h1>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <MDBRow>
                                    <MDBCol size="12">
                                        <input className="col-12" defaultValue={this.getUserWebtoken()} type="text" disabled />
                                        <h5 className="text-left mt-2" style={{ 'color': '#282c34', 'fontSize': 14 }}>
                                            <MdInfo /> A chave de acesso é única e deve ser preservada pelo administrador.
                                        </h5>
                                    </MDBCol>
                                </MDBRow>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                    <MdAssignment /> Nível de acesso
                                </h1>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <MDBRow>
                                    <MDBCol size="12" className="form-check">
                                        <input className="form-check-input ml-2" type="checkbox" value="" id="defaultCheck1" />
                                        <label className="form-check-label ml-4">
                                            Administrator
                                        </label><br />
                                        <input className="form-check-input ml-2" type="checkbox" value="" id="defaultCheck1" />
                                        <label className="form-check-label ml-4">
                                            Dashboard
                                        </label><br />
                                        <input className="form-check-input ml-2" type="checkbox" value="" id="defaultCheck2" />
                                        <label className="form-check-label ml-4">
                                            Mensagens
                                        </label><br />
                                        <input className="form-check-input ml-2" type="checkbox" value="" id="defaultCheck3" />
                                        <label className="form-check-label ml-4">
                                            Comercial
                                        </label><br />
                                        <input className="form-check-input ml-2" type="checkbox" value="" id="defaultCheck4" />
                                        <label className="form-check-label ml-4">
                                            DP_RH
                                        </label><br />
                                        <input className="form-check-input ml-2" type="checkbox" value="" id="defaultCheck4" />
                                        <label className="form-check-label ml-4">
                                            Operacional
                                        </label><br />
                                        <input className="form-check-input ml-2" type="checkbox" value="" id="defaultCheck4" />
                                        <label className="form-check-label ml-4">
                                            Financeiro
                                        </label><br />
                                        <h5 className="text-left mt-2" style={{ 'color': '#282c34', 'fontSize': 14 }}>
                                            <MdInfo /> Ao selecionar o administrator, o usuario terá acesso completo ao sistema.
                                        </h5>
                                    </MDBCol>
                                    <MDBCol size="12">
                                        <Button
                                            className="mt-2 mb-2"
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('administrator', 'fadeIn');
                                            }}>
                                            <MdHdrWeak /> Criar nível de acesso
                                        </Button>
                                        <Button
                                            className="mt-2 mb-2"
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('administrator', 'fadeIn');
                                            }}>
                                            <MdHdrWeak /> Lista de níveis de acesso
                                        </Button>
                                    </MDBCol>
                                </MDBRow>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                    <MdAssignment /> Chave de segurança
                                </h1>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <MDBRow>
                                    <MDBCol size="12">
                                        <input className="col-12" defaultValue="1" type="number" placeholder="Escreva o codigo" id="_invitetoken_code_" min="1" max="9999999999" />
                                        <h5 className="text-left mt-2" style={{ 'color': '#282c34', 'fontSize': 14 }}>
                                            <MdInfo /> Esse codigo deve ser unico.<br />
                                            <MdInfo /> O codigo pode conter o total de 10 digitos.
                                        </h5>
                                    </MDBCol>
                                    <MDBCol size="12">
                                        <input className="col-12" defaultValue="1" type="number" placeholder="Escreva o codigo" id="_invitetoken_levelaccess_code_" min="1" max="9999999999" />
                                        <h5 className="text-left mt-2" style={{ 'color': '#282c34', 'fontSize': 14 }}>
                                            <MdInfo /> Codigo do nível de acesso.<br />
                                            <MdInfo /> O codigo pode conter o total de 10 digitos.
                                        </h5>
                                    </MDBCol>
                                    <MDBCol size="12">
                                        <MDBInput label="Escreva o texto que desejar" id="_invitetoken_" />
                                        <h5 className="text-left" style={{ 'color': '#282c34', 'fontSize': 14 }}>
                                            <MdInfo /> Esse texto serve para destinguir a chave de acesso dentro do sistema.
                                        </h5>
                                    </MDBCol>
                                    <MDBCol size="12">
                                        <Button
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                const
                                                    invitetokencode = document.getElementById('_invitetoken_code_').value,
                                                    invite = document.getElementById('_invitetoken_').value;

                                                axios.post('/api/adm/sign/webtokeninvite',
                                                    {
                                                        'webtoken': this.getUserWebtoken(),
                                                        'invite': String(invite),
                                                        'levelaccess': Number(invitetokencode)
                                                    },
                                                    {
                                                        headers: {
                                                            "content-type": 'application/json',
                                                            "api_key": this.getApiKey()
                                                        }
                                                    })
                                                    .then((data) => {
                                                        if (!data['error']) {
                                                            data = data['data']['query']['results'];

                                                            console.log(data);
                                                        }
                                                    })
                                                    .catch((err) => {
                                                        return new Error(err);
                                                    })
                                            }}>
                                            <MdHdrWeak /> Gerar chave de segurança
                                        </Button>
                                        <Button
                                            className="mt-2 mb-2"
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('administrator', 'fadeIn');
                                                this.getlevelaccess((data) => {
                                                    this.setState({ administratormenus: { menu: 'invitetokencodes', data: data, selected: 0 } });
                                                })
                                            }}>
                                            <MdHdrWeak /> Ver lista de chaves de segurança
                                        </Button>
                                    </MDBCol>
                                </MDBRow>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                    <MdAssignment /> Usuarios do sistema
                                </h1>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <MDBRow>
                                    <MDBCol size="12">
                                        <MDBInput label="Chave de segurança" id="_userSystem_invitewebtoken" />
                                        <h5 className="text-left" style={{ 'color': '#282c34', 'fontSize': 14 }}>
                                            <MdInfo /> A chave de segurança gerada pelo administrador do sistema.
                                        </h5>
                                    </MDBCol>
                                    <MDBCol size="12">
                                        <MDBInput label="Nome de usuário" id="_userSystem_name" />
                                        <h5 className="text-left" style={{ 'color': '#282c34', 'fontSize': 14 }}>
                                            <MdInfo /> O nome completo do usuário.
                                        </h5>
                                    </MDBCol>
                                    <MDBCol size="12">
                                        <MDBInput label="Email de usuário" id="_userSystem_name" />
                                        <h5 className="text-left" style={{ 'color': '#282c34', 'fontSize': 14 }}>
                                            <MdInfo /> O email fornecido deve ser único.<br />
                                            <MdInfo /> O email fornecido será valídado após a tentativa de criação do usuário.
                                        </h5>
                                    </MDBCol>
                                    <MDBCol size="12">
                                        <MDBInput label="A senha de usuário" id="_userSystem_name" />
                                        <h5 className="text-left" style={{ 'color': '#282c34', 'fontSize': 14 }}>
                                            <MdInfo /> A senha fornecida deve conter os seguintes caracteres:<br />
                                            <MdInfo /> Letras maiúsculas e minúsculas.<br />
                                            <MdInfo /> Dígitos de 0 à 9.<br />
                                            <MdInfo /> Caracteres especiais aceitos: @, !, # e $.
                                        </h5>
                                    </MDBCol>
                                    <MDBCol size="12">
                                        <Button
                                            className="mt-2 mb-2"
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('administrator', 'fadeIn');
                                            }}>
                                            <MdHdrWeak /> Alterar dados do usuário
                                        </Button>
                                        <Button
                                            className="mt-2 mb-2"
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('administrator', 'fadeIn');
                                            }}>
                                            <MdHdrWeak /> Adicionar novo usuário
                                        </Button>
                                        <Button
                                            className="mt-2 mb-2"
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('administrator', 'fadeIn');
                                            }}>
                                            <MdHdrWeak /> Remover usuário
                                        </Button>
                                        <Button
                                            className="mt-2 mb-2"
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('administrator', 'fadeIn');
                                            }}>
                                            <MdHdrWeak /> Alterar nível de acesso do usuário
                                        </Button>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                )
            } else if (this.state.administratormenus.menu === 'invitetokencodes') {
                let list = this.state.administratormenus.data.map(invitetoken => {
                    return <MDBListGroupItem className="mb-2" key={invitetoken['ID']} style={{ 'backgroundColor': '#f2f2f2', 'border': '1px solid #282c34' }}>
                        <hr />
                        <p className="text-left mb-2">
                            <MdInfo /> Código: {Math.abs(Number(invitetoken['codigo']))}
                        </p>
                        <hr />
                        <p className="text-left mb-2">
                            <MdInfo /> Nome: {invitetoken['nome']}
                        </p>
                        <hr />
                        <p className="text-left mb-2">
                            <MdGavel /> Nivel de acesso
                            </p>
                        <hr />
                        <p className="text-left mb-1">
                            {invitetoken['menu']['administrator'] ? <MdCheck /> : <MdClose />} Administrator
                            </p>
                        <p className="text-left mb-1">
                            {invitetoken['menu']['dashboard'] ? <MdCheck /> : <MdClose />} Dashboard
                            </p>
                        <p className="text-left mb-1">
                            {invitetoken['menu']['messages'] ? <MdCheck /> : <MdClose />} Mensagens
                            </p>
                        <p className="text-left mb-1">
                            {invitetoken['menu']['comercial'] ? <MdCheck /> : <MdClose />} Comercial
                            </p>
                        <p className="text-left mb-1">
                            {invitetoken['menu']['dp_rh'] ? <MdCheck /> : <MdClose />} DP_RH
                            </p>
                        <p className="text-left mb-1">
                            {invitetoken['menu']['operacional'] ? <MdCheck /> : <MdClose />} Operacional
                            </p>
                        <p className="text-left mb-1">
                            {invitetoken['menu']['financeiro'] ? <MdCheck /> : <MdClose />} Financeiro
                            </p>
                        <hr />
                    </MDBListGroupItem>
                });
                return (
                    <MDBCol className='administrator' style={{ 'height': '100vh', 'backgroundColor': '#282c34' }}>
                        <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                            <MDBCol size="12" className="mt-2" style={{ 'backgroundColor': '#f2f2f2' }}>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                    <MdAssignment /> Chaves de segurança
                                </h1>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                            </MDBCol>
                            <MDBCol size="12" className="overflow-auto" style={{ 'height': '70vh', 'backgroundColor': '#f2f2f2' }}>
                                <MDBListGroup style={{ 'backgroundColor': '#f2f2f2' }}>
                                    {list}
                                </MDBListGroup>
                            </MDBCol>
                            <MDBCol size="12" bottom>
                                <Button
                                    className="mb-2"
                                    style={{ 'color': '#282c34', 'fontSize': 18 }}
                                    variant="outline-dark"
                                    block
                                    onClick={() => {
                                        animateCSS('administrator', 'fadeIn');
                                        this.setState({ administratormenus: { menu: 'default', data: [], selected: 0 } });
                                    }}>
                                    <MdHdrWeak /> Voltar
                                </Button>
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                )
            }
        }
        /**
         * Dashboard
         */
        else if (this.state.menu === 'dashboard') {
            return (
                <MDBCol className='dashboard' style={{ 'height': '100vh', 'backgroundColor': '#282c34' }}>
                    <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                        <MDBCol size="6" className="mt-2" style={{ 'backgroundColor': '#f2f2f2' }}>
                            <h1 className="text-justify font-weight-bold m-auto p-auto" style={{ 'backgroundColor': '#f2f2f2', 'color': '#282c34', 'fontSize': 18 }}>
                                {this.state.data.dashboard[0]} Postos Cobertos <MdRssFeed /><br />
                            </h1>
                            <div className="text-justify font-weight-bold m-2 p-auto" style={{ 'backgroundColor': '#f2f2f2', 'color': '#282c34', 'fontSize': 14 }}>
                                <MdVerifiedUser /> Clientes Importantes Cobertos
                                <MDBListGroup className="m-2 overflow-auto" style={{ 'maxHeight': '20vh', 'backgroundColor': '#f2f2f2' }}>
                                    <MDBListGroupItem className="mb-1" key="Forest_Park" style={{ 'backgroundColor': '#f2f2f2', 'border': '1px solid #2c313a' }}>
                                        <MdMood /> Forest Park<br />
                                        <MdPayment /> R$ 1.350.000.00
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="mb-1" key="Forest_Park_2" style={{ 'backgroundColor': '#f2f2f2', 'border': '1px solid #2c313a' }}>
                                        <MdMood /> Forest Park 2<br />
                                        <MdPayment /> R$ 1.350.000.00
                                    </MDBListGroupItem>
                                </MDBListGroup>
                            </div>
                        </MDBCol>
                        <MDBCol size="6" className="mt-2" style={{ 'backgroundColor': '#f2f2f2' }}>
                            <h1 className="text-justify font-weight-bold m-auto p-auto" style={{ 'backgroundColor': '#f2f2f2', 'color': '#282c34', 'fontSize': 18 }}>
                                {this.state.data.dashboard[1]} Postos Descobertos <MdRssFeed /><br />
                            </h1>
                            <div className="text-justify font-weight-bold m-2 p-auto" style={{ 'backgroundColor': '#f2f2f2', 'color': '#282c34', 'fontSize': 14 }}>
                                <MdVerifiedUser /> Clientes Importantes Descobertos
                                <MDBListGroup className="m-2 overflow-auto" style={{ 'maxHeight': '20vh', 'backgroundColor': '#f2f2f2' }}>
                                    <MDBListGroupItem className="mb-1" key="Forest_Park_3" style={{ 'backgroundColor': '#f2f2f2', 'border': '1px solid #2c313a' }}>
                                        <MdMood /> Forest Park<br />
                                        <MdPayment /> R$ 1.350.000.00
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="mb-1" key="Forest_Park_4" style={{ 'backgroundColor': '#f2f2f2', 'border': '1px solid #2c313a' }}>
                                        <MdMood /> Forest Park 2<br />
                                        <MdPayment /> R$ 1.350.000.00
                                    </MDBListGroupItem>
                                </MDBListGroup>
                            </div>
                        </MDBCol>
                        <MDBCol size="6">
                            <div id={'chartContainer-Postos Cobertos'} className="bg-transparent" style={{ 'height': '60vh', 'backgroundColor': '#f2f2f2', 'color': '#282c34', 'border': '1px solid #282c34' }}>
                                <p className="text-secondary" style={{ 'marginLeft': 4 }}>Grafico Indisponivel!</p>
                            </div>
                            <p id={'chartDonwload-Postos Cobertos'} className="mt-2" style={{ 'marginLeft': 4 }} onClick={() => { console.log('teste') }} />
                        </MDBCol>
                        <MDBCol size="6">
                            <div id={'chartContainer-Postos Descobertos'} className="bg-transparent" style={{ 'height': '60vh', 'backgroundColor': '#f2f2f2', 'color': '#282c34', 'border': '1px solid #282c34' }}>
                                <p className="text-secondary" style={{ 'marginLeft': 4 }}>Grafico Indisponivel!</p>
                            </div>
                            <p id={'chartDonwload-Postos Descobertos'} className="mt-2" style={{ 'marginLeft': 4 }} onClick={() => { console.log('teste') }} />
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
            )
        }
        /**
         * Messages
         */
        else if (this.state.menu === 'messages') {
            if (this.state.usermessages.menu === 'list') {
                let messages = this.state.usermessages.data.map(message => {
                    return <MDBListGroupItem className="mb-1" key={message['id']} style={{ 'backgroundColor': '#f2f2f2', 'border': '1px solid #f2f2f2' }}>
                        <Button
                            className={`col mt-2 mr-3 text-left font-weight-bold ${message['new'] ? '' : 'disabled'}`}
                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                            variant="outline-dark"
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
                    </MDBListGroupItem>
                });
                return (
                    <MDBCol className='messages' style={{ 'height': '100vh', 'backgroundColor': '#282c34' }}>
                        <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                            <MDBCol size="12">
                                <p className="text-left font-weight-bold pt-2" style={{ 'fontSize': 20, 'color': '#282c34' }}>
                                    Caixa de entrada
                                </p>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <MDBListGroup className="overflow-auto" style={{ 'height': '70vh', 'backgroundColor': '#f2f2f2' }}>
                                    {messages}
                                </MDBListGroup>
                                <MDBCol size="12" className="mt-2">
                                    <ButtonToolbar>
                                        <MDBCol size="6" className="mt-auto" bottom>
                                            <Button
                                                style={{ 'color': '#282c34', 'fontSize': 18 }}
                                                variant="outline-dark"
                                                block
                                                onClick={() => {
                                                    animateCSS('messages', 'fadeIn');
                                                    this.getUserMessages((messages) => {
                                                        this.setState({ 'message': { 'active': true }, 'usermessages': { menu: 'send', data: messages, selected: 0 } })
                                                    });
                                                }}>
                                                <MdHdrWeak /><br /> Novo email
                                            </Button>
                                        </MDBCol>
                                        <MDBCol size="6" className="mt-auto" bottom>
                                            <Button
                                                style={{ 'color': '#282c34', 'fontSize': 18 }}
                                                variant="outline-dark"
                                                block
                                                disabled={this.state.usermessages.data.length <= 0}
                                                onClick={() => {
                                                    axios.delete('/api/users/messages/remove', {
                                                        headers: {
                                                            "content-type": "application/json",
                                                            "api_key": this.getApiKey(),
                                                            "authorization": this.getUserToken()
                                                        }
                                                    })
                                                        .then((data) => {
                                                            if (!data['error']) {
                                                                animateCSS('messages', 'fadeIn');
                                                                this.getUserMessages((messages) => {
                                                                    this.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                                });
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            return new Error(err);
                                                        })
                                                }}>
                                                <MdHdrWeak /><br /> Descartar todos os emails
                                            </Button>
                                        </MDBCol>
                                    </ButtonToolbar>
                                </MDBCol>
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                )
            } else if (this.state.usermessages.menu === 'message') {
                let selected = this.state.usermessages.data.filter(message => {
                    if (message['id'] === this.state.usermessages.selected)
                        return message;
                    return false;
                });
                if (selected instanceof Array && selected.length > 0) selected = selected[0];
                return (
                    <MDBCol className='messages' style={{ 'height': '100vh', 'backgroundColor': '#282c34' }}>
                        <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                            <MDBCol size="12">
                                <p className="text-left font-weight-bold pl-2 pt-2" style={{ 'fontSize': 18, 'color': '#282c34' }}>
                                    De: {selected['emitter']}<br />
                                    Para: {selected['receiver']}<br />
                                    Cc: {selected['copied']}<br />
                                    Enviado em: {selected['dateAt']}
                                </p>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <h1 className="text-center font-weight-bold">{selected['subject']}</h1>
                                <hr style={{ 'backgroundColor': '#282c34' }} />
                                <MDBCol size="12" className="p-2 overflow-auto" style={{ 'height': '50vh', 'border': '1px solid #282c34', 'color': '#282c34' }}>
                                    {selected['message'].split('\n').map((i, l) => {
                                        return <p key={`_message_text_id_${l}`}>{i}</p>
                                    })}
                                </MDBCol>
                            </MDBCol>
                            <MDBCol size="12" className="mt-2">
                                <ButtonToolbar>
                                    <MDBCol size="6" className="mb-2" bottom>
                                        <Button
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('messages', 'fadeIn');
                                                this.getUserMessages((messages) => {
                                                    const
                                                        subject = `${selected['subject']}`,
                                                        message = `${selected['message']}\n\r---Resposta por ${this.getUserEmail()}\n\r`;
                                                    this.setState({
                                                        'message': { 'active': true }, 'usermessages': {
                                                            menu: 'send', answer: {
                                                                forward: false,
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
                                    </MDBCol>
                                    <MDBCol size="6" className="mb-2" bottom>
                                        <Button
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('messages', 'fadeIn');
                                                this.getUserMessages((messages) => {
                                                    const
                                                        subject = `${selected['subject']}`,
                                                        message = `---Encaminhada por ${this.getUsername()}(${String(this.getUserEmail())})\n\r${selected['message']}`;
                                                    this.setState({
                                                        'message': { 'active': true }, 'usermessages': {
                                                            menu: 'send', answer: {
                                                                forward: true,
                                                                emitter: selected['emitter'],
                                                                copied: selected['copied'],
                                                                subject: subject,
                                                                message: message
                                                            }, data: messages, selected: 0
                                                        }
                                                    })
                                                });
                                            }}>
                                            <MdHdrWeak /><br /> Encaminhar
                                        </Button>
                                    </MDBCol>
                                    <MDBCol size="6" className="mb-2" bottom>
                                        <Button
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('messages', 'fadeIn');
                                                this.getUserMessages((messages) => {
                                                    this.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                });
                                            }}>
                                            <MdHdrWeak /><br /> Retornar
                                        </Button>
                                    </MDBCol>
                                    <MDBCol size="6" className="mb-2" bottom>
                                        <Button
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                axios.delete('/api/users/messages/remove', {
                                                    headers: {
                                                        "content-type": "application/json",
                                                        "api_key": this.getApiKey(),
                                                        "authorization": this.getUserToken()
                                                    },
                                                    params: {
                                                        id: Number(selected['id'])
                                                    }
                                                })
                                                    .then((data) => {
                                                        animateCSS('messages', 'fadeIn');
                                                        this.getUserMessages((messages) => {
                                                            this.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                        });
                                                    })
                                                    .catch((err) => {
                                                        return new Error(err);
                                                    })
                                            }}>
                                            <MdHdrWeak /><br /> Descartar
                                        </Button>
                                    </MDBCol>
                                </ButtonToolbar>
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                )
            } else if (this.state.usermessages.menu === 'send') {
                const onChangeEmailSend = () => {
                    if (
                        document.getElementById('message_email-1').classList.contains('is-invalid') ||
                        document.getElementById('message_email-2').classList.contains('is-invalid')
                    ) {
                        return this.setState({ 'send_email': false });
                    }

                    if (!this.state.usermessages.answer || !this.state.usermessages.answer.forward) {
                        const
                            subject = document.getElementById('message_subject').value,
                            message = document.getElementById('message_textarea').value;
                        if (
                            document.getElementById('message_email-1').classList.contains('is-valid') &&
                            String(subject).length > 0 &&
                            String(message).length > 0
                        ) {
                            this.setState({ 'send_email': true });
                        } else {
                            this.setState({ 'send_email': false });
                        }
                    } else {
                        if (
                            document.getElementById('message_email-2').classList.contains('is-valid')
                        ) {
                            this.setState({ 'send_email': true });
                        } else {
                            this.setState({ 'send_email': false });
                        }
                    }
                }
                return (
                    <MDBCol className='messages' style={{ 'height': '100vh', 'backgroundColor': '#282c34' }}>
                        <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                            <MDBCol size="12" className="mt-2">
                                <MDBCol size="12" className="message-form-all">
                                    <label className="font-weight-bold">Destinatário:</label>
                                    <input type="text" className="form-control mb-2" id="message_email-1" placeholder="Endereço de email" onChange={this.handleEmailExist.bind(this, '1')} onKeyUp={onChangeEmailSend.bind(this)} style={{ 'backgroundColor': '#f2f2f2', 'color': '#282c34', 'border': '1px solid #282c34', 'borderRadius': 5 }} />
                                    <label className="font-weight-bold">Cc:</label>
                                    <input type="text" className="form-control mb-2" id="message_email-2" placeholder="Endereço de email" onChange={this.handleEmailExist.bind(this, '2')} onKeyUp={onChangeEmailSend.bind(this)} style={{ 'backgroundColor': '#f2f2f2', 'color': '#282c34', 'border': '1px solid #282c34', 'borderRadius': 5 }} />
                                    <label className="font-weight-bold">Assunto:</label>
                                    <input type="text" className="form-control mb-2" id="message_subject" placeholder="Defina o assunto" onKeyUp={onChangeEmailSend.bind(this)} style={{ 'backgroundColor': '#f2f2f2', 'color': '#282c34', 'border': '1px solid #282c34', 'borderRadius': 5 }} />
                                    <label className="font-weight-bold">Mensagem:</label>
                                    <textarea className="form-control mb-2" id="message_textarea" onKeyUp={onChangeEmailSend.bind(this)} style={{ 'height': '50vh', 'resize': 'none', 'backgroundColor': '#f2f2f2', 'color': '#282c34', 'border': '1px solid #282c34', 'borderRadius': 5 }} />
                                </MDBCol>
                                <ButtonToolbar>
                                    <MDBCol size="6" className="mt-auto" bottom>
                                        <Button className="mb-2"
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            onClick={() => {
                                                animateCSS('messages', 'fadeIn');
                                                this.getUserMessages((messages) => {
                                                    this.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                });
                                            }}>
                                            <MdHdrWeak /><br /> Descartar
                                        </Button>
                                    </MDBCol>
                                    <MDBCol size="6" className="mt-auto" bottom>
                                        <Button className="mb-2"
                                            style={{ 'color': '#282c34', 'fontSize': 18 }}
                                            variant="outline-dark"
                                            block
                                            disabled={this.state.send_email ? false : true}
                                            onClick={() => {
                                                const
                                                    receiver = document.getElementById('message_email-1').value,
                                                    copied = document.getElementById('message_email-2').value,
                                                    subject = document.getElementById('message_subject').value,
                                                    message = document.getElementById('message_textarea').value,
                                                    username = this.getUsername();

                                                const send = function (api_key, user_token, emitter, receiver, copied, subject, message) {
                                                    const context = this;
                                                    return new Promise((resolve, reject) => {
                                                        axios.post('/api/users/messages/send',
                                                            {
                                                                "author": String(username),
                                                                "emitter": String(emitter),
                                                                "receiver": String(receiver),
                                                                "copied": String(copied),
                                                                "subject": String(subject),
                                                                "message": String(message)
                                                            },
                                                            {
                                                                headers: {
                                                                    "content-type": 'application/json',
                                                                    "api_key": api_key,
                                                                    "authorization": user_token
                                                                }
                                                            })
                                                            .then((data) => {
                                                                if (!data['error']) {
                                                                    data = data['data']['query']['results'];

                                                                    animateCSS('messages', 'fadeIn');
                                                                    resolve();
                                                                    context.getUserMessages((messages) => {
                                                                        context.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                                    });
                                                                } else {
                                                                    document.getElementById('message_email-1').value = '';
                                                                    document.getElementById('message_email-2').value = '';
                                                                    document.getElementById('message_subject').value = '';
                                                                    document.getElementById('message_textarea').value = '';
                                                                    reject();
                                                                    animateCSS('messages', 'fadeIn');
                                                                    context.getUserMessages((messages) => {
                                                                        context.setState({ 'message': { 'active': false }, 'usermessages': { menu: 'list', data: messages, selected: 0 } })
                                                                    });
                                                                }
                                                            })
                                                            .catch((err) => {
                                                                return new Error(err);
                                                            })
                                                    })
                                                }

                                                if (!this.state.usermessages.answer || !this.state.usermessages.answer.forward) {
                                                    if (String(copied).length > 0) {
                                                        send.call(this, this.getApiKey(), this.getUserToken(), this.getUserEmail(), receiver, copied, subject, message)
                                                            .then(() => {
                                                                send(this.getApiKey(), this.getUserToken(), this.getUserEmail(), copied, '', subject, message)
                                                            })
                                                    } else {
                                                        send.call(this, this.getApiKey(), this.getUserToken(), this.getUserEmail(), receiver, '', subject, message)
                                                    }
                                                } else {
                                                    send.call(this, this.getApiKey(), this.getUserToken(), this.getUserEmail(), copied, '', subject, message)
                                                }

                                            }}>
                                            <MdHdrWeak /><br /> Enviar
                                        </Button>
                                    </MDBCol>
                                </ButtonToolbar>
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                )
            }
        }
        /**
         * Comercial
         */
        else if (this.state.menu === 'comercial') {
            return (
                <MDBCol className='comercial' style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                    <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                        {/*
                            Cadastros
                        */}
                        <MDBCol size="12" className="mt-2">
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdAssignment /> Cadastros
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Empresa
                                    </Button>
                                </MDBCol>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Cliente
                                    </Button>
                                </MDBCol>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Tipo de Serviço
                                    </Button>
                                </MDBCol>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Função
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Contratos
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdWork /> Contratos
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="12" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Novo contrato
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Relatórios
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdLocalPrintshop /> Relatórios
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de cadastro de clientes
                                    </Button>
                                </MDBCol>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de contratos
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
            )
        }
        // DP/RH
        else if (this.state.menu === 'dp_rh') {
            return (
                <MDBCol className='dp_rh' style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                    <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                        {/*
                            Cadastro de funcionários
                        */}
                        <MDBCol size="12" className="mt-2">
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdPersonAdd /> Cadastro de funcionários
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="12" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Cadastrar novo funcionário
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Valores e Regras
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdLocalAtm /> Valores e Regras
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Novo valor
                                    </Button>
                                </MDBCol>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Nova regra
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Escala
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdTimer /> Escala
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="12" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Nova escala
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Relatórios
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdLocalPrintshop /> Relatórios
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de cadastro de funcionários
                                    </Button>
                                </MDBCol>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de Valores e Regras
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
            )
        }
        // Operacional
        else if (this.state.menu === 'operacional') {
            return (
                <MDBCol className='operacional' style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                    <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                        {/*
                            Alocação de Funcionários
                        */}
                        <MDBCol size="12" className="mt-2">
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdPersonPin /> Alocação de Funcionários
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="12" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Alocar funcionário
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Confirmação de Presença
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdConfirmationNumber /> Confirmação de Presença
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="12" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Confirmar presença
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Manutenção de  Apontamentos
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdBuild /> Manutenção de Apontamentos
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="12" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Corrigir apontamento
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Calculo de Pagamentos
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdAvTimer /> Calculo de Pagamentos
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="12" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Calcular pagamento
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Conferência de Pagamento
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdYoutubeSearchedFor /> Conferência de Pagamento
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="12" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relação de pagamentos
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Relatórios
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdLocalPrintshop /> Relatórios
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de Alocações
                                    </Button>
                                </MDBCol>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório Confirmação de Presença
                                    </Button>
                                </MDBCol>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório Apontamentos
                                    </Button>
                                </MDBCol>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de Conferência
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
            )
        }
        // Financeiro
        else if (this.state.menu === 'financeiro') {
            return (
                <MDBCol className='financeiro' style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                    <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                        {/*
                            Pagamentos
                        */}
                        <MDBCol size="12" className="mt-2">
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdPersonAdd /> Pagamentos
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="12" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Novo pagamento
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                            {/*
                                Relatórios
                            */}
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdLocalPrintshop /> Relatórios
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <ButtonToolbar>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Relatório de Pagamentos
                                    </Button>
                                </MDBCol>
                                <MDBCol size="6" className="mb-2">
                                    <Button
                                        style={{ 'color': '#282c34', 'fontSize': 18 }}
                                        variant="outline-dark"
                                        block
                                        onClick={() => console.log('teste')}>
                                        <MdHdrWeak /> Recibos
                                    </Button>
                                </MDBCol>
                            </ButtonToolbar>
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
            )
        }
        // Suport
        else if (this.state.menu === 'suport') {
            return (
                <MDBCol className='suport' style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                    <MDBRow className="overflow-auto" style={{ 'height': '100vh', 'backgroundColor': '#f2f2f2' }}>
                        {/*
                            Suporte
                        */}
                        <MDBCol size="12" className="mt-2">
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdLiveHelp /> Precisa de ajuda?
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdHeadsetMic /> Suporte Técnico
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <p className="text-left font-weight-bold" style={{ 'color': '#282c34', 'fontSize': 20 }}>
                                <MdFace /> Luiz<br />
                                <MdHdrStrong /> Telefone: (11) 98497-9536<br />
                                <MdHdrStrong /> Email: suporte@grupomave.com.br
                            </p>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <h1 className="text-left font-weight-bold" style={{ 'color': '#282c34' }}>
                                <MdSupervisorAccount /> Ouvidoria
                            </h1>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                            <p className="text-left font-weight-bold" style={{ 'color': '#282c34', 'fontSize': 20 }}>
                                <MdFace /> Jefferson<br />
                                <MdHdrStrong /> Telefone: (11) 98276-6134<br />
                                <MdHdrStrong /> Email: ti@grupomave.com.br
                            </p>
                            <hr style={{ 'backgroundColor': '#282c34' }} />
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
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