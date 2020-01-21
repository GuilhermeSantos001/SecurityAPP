/**
 * Import React
 */
import React from "react";

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
    MdPeople,
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
    MdHdrStrong
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
export default class Render extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: 'suport',
            clock: this.getClock(),
            data: {
                dashboard: [
                    Math.floor(1 + Math.random() * 100),
                    Math.floor(1 + Math.random() * 100)
                ],
                graphics: {
                    "Postos Cobertos": {
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
        window.setInterval(() => {
            this.setClock();
        }, 1000);
    }

    componentDidUpdate(prop, state) {
        if (this.state.menu !== state.menu) {
            animateCSS(this.state.menu, 'bounceInRight');
        }
    }

    setClock() {
        this.setState({ clock: this.getClock() });
    }

    getClock = () => {
        return `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getFullYear())} - \n\r\
        ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
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
                                onClick={() => this.setState({ menu: 'dashboard' })}
                            >
                                <MdDashboard /> Dashboard
                            </Button>
                            <Button
                                id="_clients"
                                className={`m-2 ${this.state.menu === 'clients' ? 'active' : ''}`}
                                variant="outline-info"
                                size="lg"
                                block
                                onClick={() => this.setState({ menu: 'clients' })}
                            >
                                <MdPeople /> Clientes
                            </Button>
                            <Button
                                id="_suport"
                                className={`m-2 ${this.state.menu === 'suport' ? 'active' : ''}`}
                                variant="outline-info"
                                size="lg"
                                block
                                onClick={() => this.setState({ menu: 'suport' })}
                            >
                                <MdAnnouncement /> Suporte
                            </Button>
                        </ButtonToolbar>
                    </div>
                </div>
                <div>
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
                        <div className="row">
                            <div className="bg-success border border-dark col-3 ml-3">
                                <h1><MdRssFeed /> Postos Cobertos</h1>
                                <h2>{this.state.data.dashboard[0]}</h2>
                            </div>
                            <div className="bg-danger border border-dark col-3">
                                <h1><MdRssFeed /> Postos Descobertos</h1>
                                <h2>{this.state.data.dashboard[1]}</h2>
                            </div>
                            <div className="bg-info border border-dark col-5 ml-3">
                                <h1><MdDateRange /> Data e Hora</h1>
                                <h2>{this.state.clock}</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="bg-light border-top border border-dark col-3 ml-3 pt-2">
                                <p className="text-dark text-left font-weight-bold" style={{ 'fontSize': 'calc(10px + 1vmin)' }}><MdVerifiedUser /> Clientes Importantes Cobertos</p>
                                <ul className="list-group">
                                    <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-8px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
                                        <MdMood /> Forest Park
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
                                        <MdMood /> Pão de Açucar
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
                                        <MdMood /> Açai Atacadista
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-light border border-dark col-3 pt-2">
                                <p className="text-dark text-left font-weight-bold" style={{ 'fontSize': 'calc(10px + 1vmin)' }}><MdError /> Clientes Importantes Descobertos</p>
                                <ul className="list-group">
                                    <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-8px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
                                        <MdMoodBad /> Condominio Renascimento
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
                                        <MdMoodBad /> Villa Amalfi
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
                                        <MdMoodBad /> Condominio Jaguare
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-light border border-dark col-5 ml-3 pt-2">
                                <p className="text-dark text-left font-weight-bold" style={{ 'fontSize': 'calc(10px + 1vmin)' }}><MdUpdate /> Suas ultimas atualizações</p>
                                <ul className="list-group">
                                    <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-8px + -2vmin)' }}>
                                        <MdHdrWeak /> Confirmação de cobertura de posto no Forest Park <span className="badge badge-info font-weight-bold" style={{ 'fontSize': 'calc(2.5px + 1vmin)' }}>23/05/2020</span>
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)' }}>
                                        <MdHdrWeak /> Alteração cadastral de posto no Villa Amalfi <span className="badge badge-info font-weight-bold" style={{ 'fontSize': 'calc(2.5px + 1vmin)' }}>19/05/2020</span>
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)' }}>
                                        <MdHdrWeak /> Cadastro de um novo vigilante no posto do Villa Amalfi <span className="badge badge-info font-weight-bold" style={{ 'fontSize': 'calc(2.5px + 1vmin)' }}>19/05/2020</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="Dashboard-view_2">
                        <div>
                            {this.graphics()}
                        </div>
                    </div>
                </div>
            )
        }
        // Clients
        else if (this.state.menu === 'clients') {
            return (
                <div className='clients'>
                    <div className="Clients-view_1">
                        <div className="bg-info col-12 ml-3">
                            <h1>Lista de Clientes</h1>
                        </div>
                    </div>
                </div>
            )
        }
        // Suport
        else if (this.state.menu === 'suport') {
            return (
                <div className='suport'>
                    <div className="Suport-view_1">
                        <h1 className="bg-dark">
                            <MdLiveHelp /> Precisa de ajuda?
                        </h1>
                        <div className="bg-light border-top border border-dark pl-2 pt-2" style={{ 'fontSize': 'calc(10px + 1vmin)', 'width': '1565px', 'marginTop': 'calc(-0.1px + -1vmin)' }}>
                            <p className="text-dark text-left font-weight-bold pt-3">
                                <MdHdrStrong /> <a href="https://react-icons.netlify.com/#/icons/md" target="_blank">
                                    Como cadastrar um cliente?
                                </a>
                            </p>
                            <p className="text-dark text-left font-weight-bold">
                                <MdHdrStrong /> Suporte Telefone: (11) 98497-9536 | Email: suporte@grupomave.com.br
                            </p>
                        </div>
                    </div>
                </div>
            )
        }
    }

    graphics() {
        const options = [
            {
                title: {
                    text: "Postos Cobertos",
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
                    content: "{name} foi/foram coberto(s) {y} posto(s)"
                },
                data: [
                    {
                        name: "Ano de 2020",
                        showInLegend: true,
                        type: "column",
                        color: this.state.data.graphics["Postos Cobertos"]["2020"].color,
                        dataPoints: [
                            { label: "Domingo", y: this.state.data.graphics["Postos Cobertos"]["2020"].data[0] },
                            { label: "Segunda-Feira", y: this.state.data.graphics["Postos Cobertos"]["2020"].data[1] },
                            { label: "Terça-Feira", y: this.state.data.graphics["Postos Cobertos"]["2020"].data[2] },
                            { label: "Quarta-Feira", y: this.state.data.graphics["Postos Cobertos"]["2020"].data[3] },
                            { label: "Quinta-Feira", y: this.state.data.graphics["Postos Cobertos"]["2020"].data[4] },
                            { label: "Sexta-Feira", y: this.state.data.graphics["Postos Cobertos"]["2020"].data[5] },
                            { label: "Sabado", y: this.state.data.graphics["Postos Cobertos"]["2020"].data[6] }
                        ]
                    },
                    {
                        name: "Ano de 2021",
                        showInLegend: true,
                        type: "column",
                        color: this.state.data.graphics["Postos Cobertos"]["2021"].color,
                        dataPoints: [
                            { label: "Domingo", y: this.state.data.graphics["Postos Cobertos"]["2021"].data[0] },
                            { label: "Segunda-Feira", y: this.state.data.graphics["Postos Cobertos"]["2021"].data[1] },
                            { label: "Terça-Feira", y: this.state.data.graphics["Postos Cobertos"]["2021"].data[2] },
                            { label: "Quarta-Feira", y: this.state.data.graphics["Postos Cobertos"]["2021"].data[3] },
                            { label: "Quinta-Feira", y: this.state.data.graphics["Postos Cobertos"]["2021"].data[4] },
                            { label: "Sexta-Feira", y: this.state.data.graphics["Postos Cobertos"]["2021"].data[5] },
                            { label: "Sabado", y: this.state.data.graphics["Postos Cobertos"]["2021"].data[6] }
                        ]
                    }
                ]
            },
            {
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
                        color: this.state.data.graphics["Postos Descobertos"]["2020"].color,
                        dataPoints: [
                            { label: "Domingo", y: this.state.data.graphics["Postos Descobertos"]["2020"].data[0] },
                            { label: "Segunda-Feira", y: this.state.data.graphics["Postos Descobertos"]["2020"].data[1] },
                            { label: "Terça-Feira", y: this.state.data.graphics["Postos Descobertos"]["2020"].data[2] },
                            { label: "Quarta-Feira", y: this.state.data.graphics["Postos Descobertos"]["2020"].data[3] },
                            { label: "Quinta-Feira", y: this.state.data.graphics["Postos Descobertos"]["2020"].data[4] },
                            { label: "Sexta-Feira", y: this.state.data.graphics["Postos Descobertos"]["2020"].data[5] },
                            { label: "Sabado", y: this.state.data.graphics["Postos Descobertos"]["2020"].data[6] }
                        ]
                    },
                    {
                        name: "Ano de 2021",
                        showInLegend: true,
                        type: "column",
                        color: this.state.data.graphics["Postos Descobertos"]["2021"].color,
                        dataPoints: [
                            { label: "Domingo", y: this.state.data.graphics["Postos Descobertos"]["2021"].data[0] },
                            { label: "Segunda-Feira", y: this.state.data.graphics["Postos Descobertos"]["2021"].data[1] },
                            { label: "Terça-Feira", y: this.state.data.graphics["Postos Descobertos"]["2021"].data[2] },
                            { label: "Quarta-Feira", y: this.state.data.graphics["Postos Descobertos"]["2021"].data[3] },
                            { label: "Quinta-Feira", y: this.state.data.graphics["Postos Descobertos"]["2021"].data[4] },
                            { label: "Sexta-Feira", y: this.state.data.graphics["Postos Descobertos"]["2021"].data[5] },
                            { label: "Sabado", y: this.state.data.graphics["Postos Descobertos"]["2021"].data[6] }
                        ]
                    }
                ]
            }
        ]

        return (
            <div>
                <div className="row">
                    <div className="col-6 mt-2 bg-transparent" style={{ 'marginLeft': 'calc(0.1px + 0.5vmin)' }}>
                        <CanvasJSReact.CanvasJSChart
                            options={options[0]}
                        // onRef={ref => this.chart = ref}
                        />
                        <p>{GraphicsPDF.printNow({
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
                        })}</p>
                    </div>
                    <div className="col-6 mt-2 bg-transparent" style={{ 'marginLeft': 'calc(-8px + -1vmin)' }}>
                        <CanvasJSReact.CanvasJSChart
                            options={options[1]}
                        // onRef={ref => this.chart = ref}
                        />
                        <p>{GraphicsPDF.printNow({
                            header: 'Relatorio de Postos Cobertos',
                            title: 'Ano de 2021',
                            data: [
                                {
                                    subtitle: 'Postos cobertos no Domingo',
                                    date: 'Postos do dia 10 de Janeiro de 2021',
                                    texts: [
                                        'Villa Amalfi 1 - 08:30:32',
                                        'Hospital Guaruja 1 - 10:30:16',
                                    ]
                                },
                                {
                                    subtitle: 'Postos cobertos na Segunda',
                                    date: 'Postos do dia 11 de Janeiro de 2021',
                                    texts: [
                                        'Villa Amalfi 2 - 12:23:46',
                                        'Hospital Guaruja 2 - 13:52:10',
                                    ]
                                },
                                {
                                    subtitle: 'Postos cobertos na Terça-Feira',
                                    date: 'Postos do dia 12 de Janeiro de 2021',
                                    texts: [
                                        'Villa Amalfi 3 - 10:12:20',
                                        'Hospital Guaruja 3 - 14:12:08',
                                    ]
                                },
                                {
                                    subtitle: 'Postos cobertos na Quarta-Feira',
                                    date: 'Postos do dia 12 de Janeiro de 2021',
                                    texts: [
                                        'Villa Amalfi 4 - 22:46:36',
                                        'Hospital Guaruja 4 - 23:38:50',
                                    ]
                                },
                                {
                                    subtitle: 'Postos cobertos na Quinta-Feira',
                                    date: 'Postos do dia 12 de Janeiro de 2021',
                                    texts: [
                                        'Villa Amalfi 5 - 00:40:25',
                                        'Hospital Guaruja 5 - 03:00:00',
                                    ]
                                },
                                {
                                    subtitle: 'Postos cobertos na Sexta-Feira',
                                    date: 'Postos do dia 12 de Janeiro de 2021',
                                    texts: [
                                        'Villa Amalfi 6 - 06:18:12',
                                        'Hospital Guaruja 6 - 07:30:00',
                                    ]
                                },
                                {
                                    subtitle: 'Postos cobertos na Sabado',
                                    date: 'Postos do dia 12 de Janeiro de 2021',
                                    texts: [
                                        'Villa Amalfi 7 - 04:48:36',
                                        'Hospital Guaruja 7 - 11:50:30',
                                    ]
                                }
                            ]
                        })}</p>
                    </div>
                </div>
            </div>
        );
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

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}