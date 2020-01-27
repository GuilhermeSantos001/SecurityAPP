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

    render() {
        return (
            <div className="container-fluid">
                <div className="row auth-container">
                    <div className="col-4 align-self-center m-auto">
                        <div className="mb-2 alert alert-danger invisible" id="alertUser" role="alert">
                            Nome de usuario/senha invalidos!
                        </div>
                        <input
                            className="mb-2 form-control form-control-sm"
                            id="email"
                            type="text"
                            placeholder="Endereço de email"
                            onFocus={this.handleFocusRemoveAlert.bind(this)} />
                        <input
                            className="mb-2 form-control form-control-sm"
                            id="password"
                            type="password"
                            placeholder="Senha"
                            onFocus={this.handleFocusRemoveAlert.bind(this)} />
                        <button
                            type="button"
                            className="mb-2 btn btn-primary btn-sm btn-block"
                            onClick={this.handleClickLogin.bind(this)}>
                            Acessar
                        </button>
                        {/* <button type="button" className="mb-2 btn btn-primary btn-sm btn-block">Criar uma conta</button> */}
                    </div>
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