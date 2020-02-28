import React, { Component } from 'react';

import {
    MDBCollapse,
    MDBContainer,
    MDBHamburgerToggler,
    MDBRow,
    MDBCol,
    MDBTypography,
    MDBBtn
} from 'mdbreact';

import {
    Image
} from 'react-bootstrap';

import {
    MdDashboard,
    MdWork,
    MdAnnouncement,
    MdExitToApp,
    MdFolderShared,
    MdLocalAtm,
    MdSecurity,
    MdMessage
} from 'react-icons/md';

import 'animate.css';

import logo from '../../logo.svg';

class IndexMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            collapse1: false,
            collapseID: '',
            usermessages: {
                menu: '',
                data: [],
                selected: 0
            }
        }
    }

    toggleCollapse = collapseID => () => {
        this.props.setActivatedMenu(prevState => ({ collapseID: (prevState.collapseID !== collapseID ? collapseID : '') }));
    }

    toggleSingleCollapse = collapseId => {
        this.props.setActivatedMenu({
            ...this.state,
            [collapseId]: !this.state[collapseId]
        });
    }

    render() {
        return (
            <MDBContainer fluid>
                <MDBRow style={{ 'backgroundColor': '#282c34' }}>
                    <MDBCol size="12" sm="12" lg="12">
                        <Image className="col-12" src={logo} style={{ 'height': '10vh' }} />
                    </MDBCol>
                    <MDBCol size="12" sm="12" lg="12">
                        <MDBTypography tag="h1" colorText="cyan" className="text-center">Grupo Mave</MDBTypography>
                        <hr style={{ 'border': '1px solid #00d9ff' }} />
                    </MDBCol>
                </MDBRow>
                {
                    /* 
                        Menu for Big and XL Monitors
                    */
                }
                <MDBRow className="d-none d-lg-block d-xl-block" style={{ 'width': '20vw', 'height': '100vh', 'backgroundColor': '#282c34' }}>
                    <MDBCol size="12" sm="12" lg="12" className="d-none d-lg-block d-xl-block overflow-auto" style={{ 'height': '80vh' }}>
                        <MDBRow className="d-flex flex-column">
                            <MDBBtn
                                id="_dashboard"
                                className="col-10 ml-auto mr-auto"
                                outline={this.props.menu === 'dashboard' ? false : true}
                                color="info"
                                onClick={() => this.props.setActivatedMenu({ menu: 'dashboard' })}>
                                <MdDashboard /> Dashboard
                            </MDBBtn>
                            <MDBBtn
                                id="_messages"
                                className="col-10 ml-auto mr-auto"
                                outline={this.props.menu === 'messages' ? false : true}
                                color="info"
                                onClick={() => this.props.setActivatedMenu({ menu: 'messages' })}>
                                <MdMessage /> Mensagens(<span style={{ 'color': '#00d9ff' }}>{this.state.usermessages.data.length}</span>)
                            </MDBBtn>
                            <MDBBtn
                                id="_comercial"
                                className="col-10 ml-auto mr-auto"
                                outline={this.props.menu === 'comercial' ? false : true}
                                color="info"
                                onClick={() => this.props.setActivatedMenu({ menu: 'comercial' })}>
                                <MdWork /> Comercial
                            </MDBBtn>
                            <MDBBtn
                                id="_dp_rh"
                                className="col-10 ml-auto mr-auto"
                                outline={this.props.menu === 'dp_rh' ? false : true}
                                color="info"
                                onClick={() => this.props.setActivatedMenu({ menu: 'dp_rh' })}>
                                <MdFolderShared /> DP/RH
                            </MDBBtn>
                            <MDBBtn
                                id="_operacional"
                                className="col-10 ml-auto mr-auto"
                                outline={this.props.menu === 'operacional' ? false : true}
                                color="info"
                                onClick={() => this.props.setActivatedMenu({ menu: 'operacional' })}>
                                <MdSecurity /> Operacional
                            </MDBBtn>
                            <MDBBtn
                                id="_financeiro"
                                className="col-10 ml-auto mr-auto"
                                outline={this.props.menu === 'financeiro' ? false : true}
                                color="info"
                                onClick={() => this.props.setActivatedMenu({ menu: 'financeiro' })}>
                                <MdLocalAtm /> Financeiro
                            </MDBBtn>
                            <MDBBtn
                                id="_suport"
                                className="col-10 ml-auto mr-auto"
                                outline={this.props.menu === 'suport' ? false : true}
                                color="info"
                                onClick={() => this.props.setActivatedMenu({ menu: 'suport' })}>
                                <MdAnnouncement /> Suporte
                            </MDBBtn>
                            <MDBBtn
                                id="_exit"
                                className="col-10 ml-auto mr-auto"
                                outline={this.props.menu === 'exit' ? false : true}
                                color="info"
                                onClick={() => {
                                    this.props.setActivatedMenu({ menu: 'exit' });
                                    this.props.animateCSS('container-all', 'flash');
                                    sessionStorage.setItem('authRemove', true);
                                    this.props.componentCallChangePage('/', {});
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
                    <MDBHamburgerToggler className="ml-2" color="cyan" id="hamburger1" onClick={() => this.toggleSingleCollapse('collapse1')} />
                    <MDBCollapse isOpen={this.state.collapse1} className="overflow-auto" style={{ 'maxHeight': '50vh', 'width': '100vw' }}>
                        <MDBCol className="m-auto">
                            <MDBCol>
                                <MDBRow>
                                    {
                                        /* 
                                            Menu for Mobile
                                        */
                                    }
                                    <MDBCol size="12" sm="12" lg="12" className="d-block d-sm-none">
                                        <MDBRow className="d-flex flex-column">
                                            <MDBBtn
                                                id="_dashboard"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'dashboard' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'dashboard' })}>
                                                <MdDashboard /> Dashboard
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_messages"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'messages' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'messages' })}>
                                                <MdMessage /> Mensagens(<span style={{ 'color': '#00d9ff' }}>{this.state.usermessages.data.length}</span>)
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_comercial"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'comercial' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'comercial' })}>
                                                <MdWork /> Comercial
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_dp_rh"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'dp_rh' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'dp_rh' })}>
                                                <MdFolderShared /> DP/RH
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_operacional"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'operacional' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'operacional' })}>
                                                <MdSecurity /> Operacional
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_financeiro"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'financeiro' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'financeiro' })}>
                                                <MdLocalAtm /> Financeiro
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_suport"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'suport' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'suport' })}>
                                                <MdAnnouncement /> Suporte
                                            </MDBBtn>
                                            <MDBBtn
                                                id="_exit"
                                                className="col-8 ml-auto mr-auto"
                                                outline
                                                color="info"
                                                onClick={() => {
                                                    this.props.animateCSS('container-all', 'flash');
                                                    sessionStorage.setItem('authRemove', true);
                                                    this.props.componentCallChangePage('/', {});
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
                                    <MDBCol size="12" sm="12" lg="12" className="d-none d-md-block d-sm-block d-lg-none m-auto">
                                        <MDBRow>
                                            <MDBBtn
                                                id="_dashboard"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'dashboard' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'dashboard' })}>
                                                <MdDashboard /> Dashboard
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_messages"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'messages' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'messages' })}>
                                                <MdMessage /> Mensagens(<span style={{ 'color': '#00d9ff' }}>{this.state.usermessages.data.length}</span>)
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_comercial"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'comercial' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'comercial' })}>
                                                <MdWork /> Comercial
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_dp_rh"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'dp_rh' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'dp_rh' })}>
                                                <MdFolderShared /> DP/RH
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_operacional"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'operacional' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'operacional' })}>
                                                <MdSecurity /> Operacional
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_financeiro"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'financeiro' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'financeiro' })}>
                                                <MdLocalAtm /> Financeiro
                                                </MDBBtn>
                                            <MDBBtn
                                                id="_suport"
                                                className="col-8 ml-auto mr-auto"
                                                outline={this.props.menu === 'suport' ? false : true}
                                                color="info"
                                                onClick={() => this.props.setActivatedMenu({ menu: 'suport' })}>
                                                <MdAnnouncement /> Suporte
                                            </MDBBtn>
                                            <MDBBtn
                                                id="_exit"
                                                className="col-8 ml-auto mr-auto"
                                                outline
                                                color="info"
                                                onClick={() => {
                                                    this.props.animateCSS('container-all', 'flash');
                                                    sessionStorage.setItem('authRemove', true);
                                                    this.props.componentCallChangePage('/', {});
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
            </MDBContainer >
        );
    }
}

export default IndexMenu;