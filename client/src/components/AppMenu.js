/**
 * Import React
 */
import React from "react";

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
import { MdDashboard, MdPeople, MdAnnouncement } from 'react-icons/md';

export default class AppMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: this.props.menu
        }
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
                                className={`m-2 ${this.state.menu == 'dashboard' ? 'active' : ''}`}
                                variant="outline-info"
                                size="lg"
                                block
                                onClick={() => this.setState({ menu: 'dashboard' })}
                            >
                                <MdDashboard /> Dashboard
                            </Button>
                            <Button
                                id="_clients"
                                className={`m-2 ${this.state.menu == 'clients' ? 'active' : ''}`}
                                variant="outline-info"
                                size="lg"
                                block
                                onClick={() => this.setState({ menu: 'clients' })}
                            >
                                <MdPeople /> Clientes
                            </Button>
                            <Button
                                id="_suport"
                                className={`m-2 ${this.state.menu == 'suport' ? 'active' : ''}`}
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
            </div>
        )
    }
}