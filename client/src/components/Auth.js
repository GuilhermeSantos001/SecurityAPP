/**
 * Import React
 */
import React from "react";

/**
 * Import LZ-String
 */
import * as LZString from 'lz-string';

/**
 * Import Axios
 */
import axios from 'axios';

/**
 * Import Resources from Page
 */
import '../css/Auth.css';

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            new_account: false
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
            this.update()
        }, 500);
    }

    update() {
        if (this.state.new_account) {
            if (
                document.getElementById('password_confirm').value != document.getElementById('password').value
            ) {
                if (
                    String(document.getElementById('password_confirm').value).length > 0 &&
                    !document.getElementById('password').classList.contains("is-invalid")
                ) {
                    document.getElementById('password').classList.add("is-invalid");
                    document.getElementById('password_confirm').classList.add("is-invalid");
                    document.getElementById('alertUser2').classList.remove("invisible");
                    animateCSS('alertUser2', 'fadeInUp');
                }

                if (
                    String(document.getElementById('password_confirm').value).length <= 0 &&
                    document.getElementById('password').classList.contains("is-invalid")
                ) {
                    animateCSS('alertUser2', 'fadeOutDown', () => {
                        document.getElementById('alertUser2').classList.add("invisible");
                        document.getElementById('password').classList.remove("is-invalid");
                        document.getElementById('password_confirm').classList.remove("is-invalid");
                    });
                }

                if (document.getElementById('password').classList.contains("is-valid")) {
                    document.getElementById('password').classList.remove("is-valid");
                    document.getElementById('password_confirm').classList.remove("is-valid");
                }

            } else {
                if (
                    String(document.getElementById('password_confirm').value).length > 0 &&
                    !document.getElementById('password').classList.contains("is-valid")
                ) {
                    document.getElementById('password').classList.add("is-valid");
                    document.getElementById('password_confirm').classList.add("is-valid");
                }

                if (document.getElementById('password').classList.contains("is-invalid")) {
                    animateCSS('alertUser2', 'fadeOutDown', () => {
                        document.getElementById('alertUser2').classList.add("invisible");
                        document.getElementById('password').classList.remove("is-invalid");
                        document.getElementById('password_confirm').classList.remove("is-invalid");
                    });
                }
            }
        }
    }

    handleFocusRemoveAlert = () => {
        if (
            document.getElementById('email').classList.contains("is-invalid") ||
            document.getElementById('password').classList.contains("is-invalid") ||
            !document.getElementById('alertUser').classList.contains("invisible")
        ) {
            animateCSS('alertUser', 'fadeOutDown', () => {
                document.getElementById('alertUser').classList.add("invisible");
                document.getElementById('email').classList.remove("is-invalid");
                document.getElementById('password').classList.remove("is-invalid");
            });
        }
    }

    handleClickLogin = () => {

        const
            email = document.getElementById('email').value,
            password = document.getElementById('password').value;

        axios.post('http://localhost:5000/auth/sign', {
            email: String(email),
            password: String(password)
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {

                localStorage.setItem('auth', LZString.compressToBase64(JSON.stringify({
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                })));

                this.props.history.push({ pathname: '/app', state: this.props.location.state });
            })
            .catch((error) => {
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';

                if (
                    !document.getElementById('email').classList.contains("is-invalid") ||
                    !document.getElementById('password').classList.contains("is-invalid")
                ) {
                    document.getElementById('email').classList.add("is-invalid");
                    document.getElementById('password').classList.add("is-invalid");
                }

                if (document.getElementById('alertUser').classList.contains("invisible")) {
                    document.getElementById('alertUser').classList.remove("invisible");
                    animateCSS('alertUser', 'fadeInUp');
                }

            })
    }

    handleClickNewAccount = () => {

    }

    Auth(props) {
        const context = props.context;
        const new_account = props.newAccount;
        if (!new_account) {
            return (
                <div className="col-4 align-self-center m-auto" id="form-container">
                    <div className="mb-2 alert alert-danger invisible" id="alertUser" role="alert">
                        Nome de usuario/senha invalidos!
                    </div>
                    <input
                        className="mb-2 form-control form-control-sm"
                        id="email"
                        type="text"
                        placeholder="Endereço de email"
                        onFocus={context.handleFocusRemoveAlert.bind(context)} />
                    <input
                        className="mb-2 form-control form-control-sm"
                        id="password"
                        type="password"
                        placeholder="Senha"
                        onFocus={context.handleFocusRemoveAlert.bind(context)} />
                    <button
                        type="button"
                        className="mb-2 btn btn-primary btn-sm btn-block"
                        onClick={context.handleClickLogin.bind(context)}>
                        Acessar
                        </button>
                    <button
                        type="button"
                        className="mb-2 btn btn-primary btn-sm btn-block"
                        onClick={() => {
                            animateCSS('form-container', 'bounceIn');
                            context.setState({ 'new_account': true });
                        }}>
                        Criar uma conta
                    </button>
                </div>
            )
        } else {
            return (
                <div className="col-4 align-self-center m-auto" id="form-container">
                    <div className="mb-2 alert alert-danger invisible" id="alertUser" role="alert">
                        Endereço de email em uso
                    </div>
                    <div className="mb-2 alert alert-danger invisible" id="alertUser2" role="alert">
                        As duas senhas não coincidem
                    </div>
                    <input
                        className="mb-2 form-control form-control-sm"
                        id="email"
                        type="text"
                        placeholder="Endereço de email"
                        onFocus={context.handleFocusRemoveAlert.bind(context)} />
                    <input
                        className="mb-2 mr-2 form-control form-control-sm"
                        id="password"
                        type="password"
                        placeholder="Senha" />
                    <input
                        className="mb-2 form-control form-control-sm"
                        id="password_confirm"
                        type="password"
                        placeholder="Confirme a senha" />
                    <button
                        type="button"
                        className="mb-2 btn btn-primary btn-sm btn-block"
                        onClick={context.handleClickNewAccount.bind(context)}>
                        Criar a conta
                    </button>
                    <button
                        type="button"
                        className="mb-2 btn btn-primary btn-sm btn-block"
                        onClick={() => {
                            animateCSS('form-container', 'bounceIn');
                            context.setState({ 'new_account': false });
                        }}>
                        Acessar
                    </button>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row auth-container">
                    <this.Auth context={this} newAccount={this.state.new_account} />
                </div>
            </div >
        )
    }
}

/**
 * Functions
 */
function animateCSS(element, animationName, callback) {
    const node = document.getElementById(`${element}`);
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