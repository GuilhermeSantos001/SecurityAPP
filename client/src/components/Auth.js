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
            new_account: false,
            record_email: '',
            message_error: '',
            new_account_name: false,
            new_account_email: false
        }
    }

    componentWillMount() {
        document.body.style.backgroundImage = `url('./wallpaper_01.jpg')`;
        document.body.style.backgroundRepeat = `no-repeat`;
        document.body.style.backgroundSize = `cover`;
        document.body.style.animationDuration = `1s`;

        this.componentCallLoading('stop');
    }

    componentWillUnmount() {
        document.body.style.backgroundImage = null;
        document.body.style.backgroundRepeat = null;
        document.body.style.backgroundSize = null;
        document.body.style.animationDuration = null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.new_account !== this.state.new_account) {
            if (this.state.new_account)
                document.getElementById('password_confirm').value = '';

            if (
                document.getElementById('alertUser') &&
                !document.getElementById('alertUser').classList.contains('invisible')
            )
                document.getElementById('alertUser').classList.add("invisible");

            if (
                document.getElementById('name')) {
                document.getElementById('name').classList.remove('is-invalid');
                document.getElementById('name').classList.remove('is-valid');
            }

            if (document.getElementById('email')) {
                document.getElementById('email').classList.remove('is-invalid');
                document.getElementById('email').classList.remove('is-valid');
            }

            if (document.getElementById('password')) {
                document.getElementById('password').classList.remove('is-invalid');
                document.getElementById('password').classList.remove('is-valid');
            }

            document.getElementById('email').value = this.state.record_email;
            document.getElementById('password').value = '';
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

    handleConfirmPassword() {
        if (this.state.new_account) {
            if (
                document.getElementById('password_confirm').value !== document.getElementById('password').value
            ) {
                if (
                    String(document.getElementById('password_confirm').value).length > 0 &&
                    !document.getElementById('password').classList.contains("is-invalid")
                ) {
                    this.setState({ 'message_error': `As senhas não coincidem` });
                    document.getElementById('password').classList.add("is-invalid");
                    document.getElementById('password_confirm').classList.add("is-invalid");
                    if (document.getElementById('alertUser').classList.contains('invisible')) {
                        document.getElementById('alertUser').classList.remove("invisible");
                        animateCSS('alertUser', 'fadeInUp');
                    }
                }

                if (
                    String(document.getElementById('password_confirm').value).length <= 0 &&
                    document.getElementById('password').classList.contains("is-invalid")
                ) {
                    animateCSS('alertUser', 'fadeOutDown', () => {
                        document.getElementById('alertUser').classList.add("invisible");
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
                    animateCSS('alertUser', 'fadeOutDown', () => {
                        document.getElementById('alertUser').classList.add("invisible");
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

                animateCSS()

                this.componentCallChangePage('/app', {});
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

    handleEmailExist = () => {
        const
            email = document.getElementById('email').value,
            validation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

        if (email.length <= 0) return;
        else if (!validation.test(email)) {
            if (
                document.getElementById('email').classList.contains('is-invalid') ||
                document.getElementById('email').classList.contains('is-valid')
            ) {
                document.getElementById('email').classList.remove('is-invalid');
                document.getElementById('email').classList.remove('is-valid');
            }

            if (!document.getElementById('alertUser').classList.contains('invisible')) {
                animateCSS('alertUser', 'fadeOutDown', () => {
                    document.getElementById('alertUser').classList.add('invisible');
                });
            }
            return;
        };

        axios.get('http://localhost:5000/users', {
            headers: {
                'Content-Type': 'application/json',
                'api_key': 'b2$tp3i$Nw6uS9B$O_n64B7!!1$3$_*_!!t!@q*5lW6EuG@Hh6$BH$#2t453_$9839#p8_V33_$!@6H4m3-8@8_2f9##464e7ESEey*bjN432--r_#N5d_7T-jCW65f3@4-l6gd!5O1#-@i-5!84K#Q@**!#$-!9*-uG2-2R_r*N-7_u-k-P*b8y8@Cu@U!Jm@@#282pF7-2D#!S_*Tob39#@g_M8e43D7!i_!_9aI3up-b-d_83tJ*6585J*G9-'
            },
            params: {
                email: String(email)
            }
        })
            .then((response) => {
                const users = response.data.query.results;

                if (users.length > 0) {
                    this.setState({ 'message_error': `Endereço de email (${email}) já está em uso.` });
                    this.setState({ 'new_account_email': false });

                    if (document.getElementById('alertUser').classList.contains('invisible')) {
                        document.getElementById('alertUser').classList.remove('invisible');
                        document.getElementById('email').classList.add('is-invalid');
                        animateCSS('alertUser', 'fadeInUp');
                    }
                } else {
                    this.setState({ 'new_account_email': true });

                    if (!document.getElementById('alertUser').classList.contains('invisible')) {
                        animateCSS('alertUser', 'fadeOutDown', () => {
                            document.getElementById('alertUser').classList.add('invisible');
                        });
                    }

                    if (
                        document.getElementById('email').classList.contains('is-invalid') ||
                        !document.getElementById('email').classList.contains('is-valid')
                    ) {
                        document.getElementById('email').classList.remove('is-invalid');
                        document.getElementById('email').classList.add('is-valid');
                    }
                }
            })
            .catch((error) => {
                animateCSS('alertUser', 'fadeOutDown', () => {
                    document.getElementById('alertUser').classList.add('invisible');

                    document.getElementById('name').classList.remove('is-invalid');
                    document.getElementById('name').classList.remove('is-valid');

                    document.getElementById('email').classList.remove('is-invalid');
                    document.getElementById('email').classList.remove('is-valid');

                    document.getElementById('password').classList.remove('is-invalid');
                    document.getElementById('password').classList.remove('is-valid');

                    document.getElementById('password_confirm').classList.remove('is-invalid');
                    document.getElementById('password_confirm').classList.remove('is-valid');
                });
            })
    }

    handleClickNewAccount = () => {
        if (this.state.new_account_name && this.state.new_account_email) {
            const
                name = document.getElementById('name').value,
                email = document.getElementById('email').value,
                password = document.getElementById('password').value;

            axios.post('http://localhost:5000/users/register', {
                name: String(name),
                email: String(email),
                password: String(password)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': 'b2$tp3i$Nw6uS9B$O_n64B7!!1$3$_*_!!t!@q*5lW6EuG@Hh6$BH$#2t453_$9839#p8_V33_$!@6H4m3-8@8_2f9##464e7ESEey*bjN432--r_#N5d_7T-jCW65f3@4-l6gd!5O1#-@i-5!84K#Q@**!#$-!9*-uG2-2R_r*N-7_u-k-P*b8y8@Cu@U!Jm@@#282pF7-2D#!S_*Tob39#@g_M8e43D7!i_!_9aI3up-b-d_83tJ*6585J*G9-'
                }
            })
                .then((response) => {

                    console.log(response);

                    // this.props.history.push({ pathname: '/app', state: this.props.location.state });
                })
                .catch((error) => {

                    return console.error(error);

                    document.getElementById('name').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('password').value = '';
                    document.getElementById('password_confirm').value = '';

                    animateCSS('alertUser', 'fadeOutDown', () => {
                        document.getElementById('alertUser').classList.add('invisible');

                        document.getElementById('name').classList.remove('is-invalid');
                        document.getElementById('name').classList.remove('is-valid');

                        document.getElementById('email').classList.remove('is-invalid');
                        document.getElementById('email').classList.remove('is-valid');

                        document.getElementById('password').classList.remove('is-invalid');
                        document.getElementById('password').classList.remove('is-valid');

                        document.getElementById('password_confirm').classList.remove('is-invalid');
                        document.getElementById('password_confirm').classList.remove('is-valid');
                    });

                })
        }
    }

    handleNameConfirm = () => {
        const name = document.getElementById('name').value;

        if (name.length < 5) {
            this.setState({ 'message_error': `Por favor, seu nome deve conter pelo menos 5 caracteres.` });
            this.setState({ 'new_account_name': false });

            if (document.getElementById('alertUser').classList.contains('invisible')) {
                document.getElementById('alertUser').classList.remove('invisible');
                animateCSS('alertUser', 'fadeInUp');
            }

            if (!document.getElementById('name').classList.contains('is-invalid')) {
                document.getElementById('name').classList.add('is-invalid');
                document.getElementById('name').classList.remove('is-valid');
            }
        } else {
            this.setState({ 'new_account_name': true });
            if (!document.getElementById('alertUser').classList.contains('invisible')) {
                animateCSS('alertUser', 'fadeOutDown', () => {
                    document.getElementById('alertUser').classList.add('invisible');

                    document.getElementById('name').classList.remove('is-invalid');
                    document.getElementById('name').classList.add('is-valid');
                });
            }
        }
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
                        type="email"
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
                            context.setState({ 'new_account': true, 'record_email': document.getElementById('email').value });
                        }}>
                        Criar uma conta
                    </button>
                </div>
            )
        } else {
            return (
                <div className="col-4 align-self-center m-auto" id="form-container">
                    <div className="mb-2 alert alert-danger invisible" id="alertUser" role="alert">
                        {context.state.message_error}
                    </div>
                    <input
                        className="mb-2 form-control form-control-sm"
                        id="name"
                        type="text"
                        placeholder="Nome completo"
                        onChange={context.handleNameConfirm.bind(context)} />
                    <input
                        className="mb-2 form-control form-control-sm"
                        id="email"
                        type="email"
                        placeholder="Endereço de email"
                        onChange={context.handleEmailExist.bind(context)} />
                    <input
                        className="mb-2 mr-2 form-control form-control-sm"
                        id="password"
                        type="password"
                        onChange={context.handleConfirmPassword.bind(context)}
                        placeholder="Senha" />
                    <input
                        className="mb-2 form-control form-control-sm"
                        id="password_confirm"
                        type="password"
                        onChange={context.handleConfirmPassword.bind(context)}
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
                            context.setState({ 'new_account': false, 'record_email': document.getElementById('email').value });
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

function animateBodyCSS(animationName, callback) {
    const node = document.body;
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