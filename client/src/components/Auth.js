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

import {
    Image
} from 'react-bootstrap';

import logo from '../logo.svg';

export default class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            new_account: false,
            forgot_password: false,
            record_email: '',
            message_error: '',
            message_error_code: 0,
            new_account_name: false,
            new_account_email: false,
            new_account_password: false
        }
    }

    getApiKey() {
        return "5i@41Yb#!##@P4!NsrvJ-D3DK$Q89-3*Y-#59#$*CW2#!P@U45#q*#$42H4q!63gsQ-64b991IK$R#8r_-$*_46#*1@5s!@A3@_56e36!*@65n517W76_@9P#!$54s@-dQ45#7rtp7-5!2!34@#4Fj44g1-_7-@8-#Smf37Bkg@1D$6-_eT#3@@3PHpPa55q_7@-4-aj2788K_@K1g!913_S72h3$@5#71-g!5vN34*uH834o-7t@t#$@9QH4sp1";
    }

    UNSAFE_componentWillMount() {
        document.body.style.backgroundColor = '#282c34';
        document.body.style.backgroundSize = 'cover';
        document.body.style.animationDuration = '1s';

        this.componentCallLoading('stop');
        this.userSessionLogin();
        this.forgotPasswordSessionStorage();
    }

    componentWillUnmount() {
        document.body.style.backgroundImage = null;
        document.body.style.backgroundRepeat = null;
        document.body.style.backgroundSize = null;
        document.body.style.animationDuration = null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.new_account !== this.state.new_account ||
            prevState.forgot_password !== this.state.forgot_password
        ) {
            if (this.state.new_account) {
                document.getElementById('email').value = document.getElementById('name').value;
                document.getElementById('name').value = '';
                document.getElementById('password').value = '';
                document.getElementById('password_confirm').value = '';

                this.handleEmailExist();
            } else if (this.state.forgot_password && this.state.forgot_password['reset_password']) {
                document.getElementById('token_resetPassword').value = '';
                document.getElementById('password').value = '';
                document.getElementById('password_confirm').value = '';
            } else {
                if (document.getElementById('email')) {
                    if (this.state.message_error_code !== 1) {
                        document.getElementById('email').value = String(this.state.record_email).length > 0 ? String(this.state.record_email) : '';
                        document.getElementById('email').disabled = false;
                    }
                }

                if (document.getElementById('password'))
                    document.getElementById('password').value = '';

                if (this.buttonCreateNewAccount)
                    this.buttonCreateNewAccount.disabled = false;
            }

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

    setSessionUser(data) {

        if (typeof data !== 'object') return false;

        return localStorage.setItem('auth', LZString.compressToBase64(JSON.stringify({
            'id': data['id'],
            'name': data['name'],
            'email': data['email'],
            'token': data['token']
        })));

    }

    userSessionLogin() {

        if (sessionStorage.getItem('authRemove')) {
            sessionStorage.removeItem('authRemove');
            return localStorage.removeItem('auth');
        }

        if (localStorage.getItem('auth'))
            return this.componentCallChangePage('/app', {});
    }

    forgotPasswordSessionStorage() {

        try {
            let
                forgotPassword = JSON.parse(LZString.decompressFromBase64(sessionStorage.getItem('reset_password'))) || null,
                now = new Date();

            if (
                typeof forgotPassword !== 'object' ||
                typeof forgotPassword.email !== 'string' ||
                !forgotPassword.expires
            ) {
                return sessionStorage.removeItem('reset_password');
            }

            forgotPassword.expires = new Date(forgotPassword.expires);

            if (now > forgotPassword.expires) {
                return sessionStorage.removeItem('reset_password');
            } else {
                this.setState({ 'forgot_password': { 'email': forgotPassword.email, 'reset_password': true } });
                if (document.getElementById('email'))
                    document.getElementById('email').value = String(forgotPassword.email);
            }

        } catch { return; }

    }

    handleClickForgotPassword() {

        if (sessionStorage.getItem('reset_password')) {
            return animateCSS('form-container', 'fadeOutDown', () => {
                animateCSS('form-container', 'bounceIn');
                this.forgotPasswordSessionStorage();
            });
        }

        const email = document.getElementById('email').value;

        if (
            String(email).length <= 0
        ) return animateCSS('email', 'shake');

        axios.post('http://localhost:5000/api/auth/forgot_password', {
            email: String(email)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api_key': this.getApiKey()
            }
        })
            .then((response) => {
                if (response.data.query.results.user) {

                    let now = new Date();

                    now.setHours(now.getHours() + 1);

                    sessionStorage.setItem('reset_password', LZString.compressToBase64(JSON.stringify({
                        'email': String(email),
                        'expires': now
                    })))

                    animateCSS('form-container', 'fadeOutDown', () => {
                        this.setState({ 'forgot_password': { 'email': email } });
                        animateCSS('alertForgotPassword', 'fadeInUp');
                    });
                }
            })
            .catch((error) => {
                this.setState({ 'message_error': `Não foi possivel enviar a solicitação para a troca de senha no endereço de email (${email})` });
                if (document.getElementById('alertUser').classList.contains('invisible')) {
                    document.getElementById('alertUser').classList.remove("invisible");
                    animateCSS('alertUser', 'fadeInUp');
                }
            })
    }

    handleClickResetPassword() {
        const
            email = document.getElementById('email').value,
            token = document.getElementById('token_resetPassword').value,
            password = document.getElementById('password').value,
            password_confirm = document.getElementById('password_confirm').value;

        if (
            String(token).length <= 0 ||
            String(password).length <= 0 ||
            String(password_confirm).length <= 0
        ) {
            animateCSS('token_resetPassword', 'shake');
            animateCSS('password', 'shake');
            animateCSS('password_confirm', 'shake');
            return;
        }

        if (this.state.new_account_password) {
            axios.post('http://localhost:5000/api/auth/reset_password', {
                email: String(email),
                token: String(token),
                password: String(password)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': this.getApiKey()
                }
            })
                .then((response) => {
                    if (response.data.query.results.user) {

                        sessionStorage.removeItem('reset_password');
                        document.getElementById('token_resetPassword').disabled = true;
                        document.getElementById('email').disabled = true;
                        document.getElementById('password').disabled = true;
                        document.getElementById('password_confirm').disabled = true;
                        this.buttonResetPassword.disabled = true;

                        this.setState({ 'message_error': `Senha alterada com sucesso!` });
                        if (document.getElementById('alertUser').classList.contains('alert-danger')) {
                            document.getElementById('alertUser').classList.remove("alert-danger");
                            document.getElementById('alertUser').classList.add("alert-success");
                        }

                        if (document.getElementById('alertUser').classList.contains('invisible')) {
                            document.getElementById('alertUser').classList.remove("invisible");
                            document.getElementById('alertUser').classList.add("alert-success");
                            animateCSS('alertUser', 'fadeInUp');
                        }
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.data.code === 1) {
                        this.setState({ 'message_error': `Não foi possivel encontrar seu token` });
                        sessionStorage.removeItem('reset_password');
                    } else if (error.response && error.response.data.code === 2) {
                        this.setState({ 'message_error': `Token invalido` });
                    } else if (error.response && error.response.data.code === 3) {
                        this.setState({ 'message_error': `Token expirado` });
                        sessionStorage.removeItem('reset_password');
                    } else {
                        this.setState({ 'message_error': `Não foi possivel redefinir sua senha` });
                        sessionStorage.removeItem('reset_password');
                    }

                    if (document.getElementById('alertUser').classList.contains('invisible')) {
                        document.getElementById('alertUser').classList.remove("invisible");
                        animateCSS('alertUser', 'fadeInUp');
                    }
                })
        }

    }

    handleConfirmPassword() {
        if (
            this.state.new_account ||
            (this.state.forgot_password && this.state.forgot_password['reset_password'])
        ) {
            if (
                document.getElementById('password_confirm').value !== document.getElementById('password').value
            ) {
                if (
                    String(document.getElementById('password_confirm').value).length > 0 &&
                    !document.getElementById('password').classList.contains("is-invalid")
                ) {
                    this.setState({ 'message_error': `As senhas não coincidem`, 'new_account_password': false });
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
                this.setState({ 'new_account_password': true });
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

        if (
            String(email).length <= 0 ||
            String(password).length <= 0
        ) {
            animateCSS('email', 'shake');
            animateCSS('password', 'shake');
            return;
        }

        axios.post('http://localhost:5000/api/auth/sign', {
            email: String(email),
            password: String(password)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api_key': this.getApiKey()
            }
        })
            .then((response) => {

                const
                    user = response.data.query.results.user,
                    token = response.data.query.results.token;

                if (user) {
                    this.setSessionUser({
                        'id': user['ID'],
                        'name': user['Nome'],
                        'email': user['Email'],
                        'token': token
                    })
                    this.componentCallChangePage('/app', {});
                }

            })
            .catch((error) => {

                document.getElementById('password').value = '';

                if (
                    !document.getElementById('email').classList.contains("is-invalid") ||
                    !document.getElementById('password').classList.contains("is-invalid")
                ) {
                    document.getElementById('email').classList.add("is-invalid");
                    document.getElementById('password').classList.add("is-invalid");
                }

                this.setState({ 'message_error': `Endereço de Email/Senha Invalidos`, 'message_error_code': 1 });
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

        if (String(email).length <= 0) {
            if (
                document.getElementById('email').classList.contains('is-invalid') ||
                document.getElementById('email').classList.contains('is-valid')
            ) {
                document.getElementById('email').classList.remove('is-invalid');
                document.getElementById('email').classList.remove('is-valid');
            }
            return;
        }
        else if (!validation.test(String(email))) {
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
                    this.setState({ 'message_error': `Endereço de email (${email}) já está em uso.`, 'new_account_email': false });

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
                    if (document.getElementById('alertUser'))
                        document.getElementById('alertUser').classList.add('invisible');

                    if (document.getElementById('name')) {
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

                    if (document.getElementById('password_confirm')) {
                        document.getElementById('password_confirm').classList.remove('is-invalid');
                        document.getElementById('password_confirm').classList.remove('is-valid');
                    }
                });
            })
    }

    handleClickNewAccount = () => {

        const
            name = document.getElementById('name').value,
            email = document.getElementById('email').value,
            password = document.getElementById('password').value,
            password_confirm = document.getElementById('password_confirm').value;

        if (
            String(password).length <= 0 ||
            String(email).length <= 0 ||
            String(password).length <= 0 ||
            String(password_confirm).length <= 0
        ) {
            animateCSS('name', 'shake');
            animateCSS('email', 'shake');
            animateCSS('password', 'shake');
            animateCSS('password_confirm', 'shake');
            return;
        }

        if (this.state.new_account_name && this.state.new_account_email && this.state.new_account_password) {

            axios.post('http://localhost:5000/api/users/register', {
                name: String(name),
                email: String(email),
                password: String(password)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': this.getApiKey()
                }
            })
                .then((response) => {

                    const
                        user = response.data.query.results.user,
                        token = response.data.query.results.token;

                    if (user) {
                        this.setSessionUser({
                            'id': user['ID'],
                            'name': user['Nome'],
                            'email': user['Email'],
                            'token': token
                        })
                        this.componentCallChangePage('/app', {});
                    }

                })
                .catch((error) => {
                    if (
                        document.getElementById('name').classList.contains('is-valid') ||
                        document.getElementById('name').classList.contains('is-invalid')
                    ) {
                        document.getElementById('name').classList.remove('is-valid');
                        document.getElementById('name').classList.remove('is-invalid');
                    }

                    if (
                        document.getElementById('email').classList.contains('is-valid') ||
                        document.getElementById('email').classList.contains('is-invalid')
                    ) {
                        document.getElementById('email').classList.remove('is-valid');
                        document.getElementById('email').classList.remove('is-invalid');
                    }

                    if (
                        document.getElementById('password').classList.contains('is-valid') ||
                        document.getElementById('password').classList.contains('is-invalid')
                    ) {
                        document.getElementById('password').classList.remove('is-valid');
                        document.getElementById('password').classList.remove('is-invalid');
                    }

                    if (
                        document.getElementById('password_confirm').classList.contains('is-valid') ||
                        document.getElementById('password_confirm').classList.contains('is-invalid')
                    ) {
                        document.getElementById('password_confirm').classList.remove('is-valid');
                        document.getElementById('password_confirm').classList.remove('is-invalid');
                    }

                    document.getElementById('name').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('password').value = '';
                    document.getElementById('password_confirm').value = '';

                    this.setState({ 'message_error': `Não foi possivel criar sua conta` });
                    if (document.getElementById('alertUser').classList.contains('invisible')) {
                        document.getElementById('alertUser').classList.remove("invisible");
                        animateCSS('alertUser', 'fadeInUp');
                    }

                })
        }
    }

    handleNameConfirm = () => {
        const name = document.getElementById('name').value;

        if (name.length < 5) {
            this.setState({ 'message_error': `Por favor, seu nome deve conter pelo menos 5 caracteres.`, 'new_account_name': false });

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
        const
            context = props.context,
            new_account = props.newAccount,
            forgot_password = props.forgotPassword;

        if (
            forgot_password &&
            forgot_password['reset_password']
        ) {
            return (
                <div className="col-sm-4 col-md-4 align-self-center m-auto" id="form-container">
                    <div className="col-10 mt-3 ml-auto mr-auto alert alert-danger font-weight-bold invisible fixed-top" id="alertUser" role="alert">
                        {context.state.message_error}
                    </div>
                    <input
                        className="mb-2 form-control form-control-lg"
                        id="token_resetPassword"
                        type="text"
                        placeholder="Codigo de verificação" />
                    <input
                        className="mb-2 form-control form-control-lg"
                        id="email"
                        type="email"
                        placeholder="Endereço de email"
                        defaultValue={forgot_password.email}
                        disabled />
                    <input
                        className="mb-2 form-control form-control-lg"
                        id="password"
                        type="password"
                        onChange={context.handleConfirmPassword.bind(context)}
                        placeholder="Nova senha" />
                    <input
                        className="mb-2 form-control form-control-lg"
                        id="password_confirm"
                        type="password"
                        onChange={context.handleConfirmPassword.bind(context)}
                        placeholder="Confirme a senha" />
                    <button
                        type="button"
                        className="mb-2 btn btn-primary btn-lg btn-block"
                        ref={btn => context.buttonResetPassword = btn}
                        onClick={context.handleClickResetPassword.bind(context)}>
                        Confirmar nova senha
                    </button>
                    <button
                        type="button"
                        className="mb-2 btn btn-primary btn-lg btn-block"
                        onClick={() => {
                            animateCSS('form-container', 'fadeOutDown', () => {
                                context.setState({ 'forgot_password': false, 'record_email': document.getElementById('email').value });
                                animateCSS('form-container', 'bounceIn');
                            });
                        }}>
                        Login
                    </button>
                    <div className="col-10 ml-auto mr-auto alert alert-light font-weight-bold text-dark text-justify fixed-bottom" id="alertUser" role="alert">
                        Essa janela só será exibida na sessão atual, a mesma tem 1 hora de duração.
                        Após o periodo de duração ao reiniciar a pagina a janela não será exibida.
                        Caso a aba do navegador seja fechada e você precise abrir o site novamente
                        um novo pedido de redefinição de senha devera ser feito.
                    </div>
                </div>
            )
        } else if (forgot_password) {
            return (
                <div className="container-fluid m-auto">
                    <div id="alertForgotPassword" ref={alert => context.alertForgotPassword = alert} className="col-12 alert alert-success alert-dismissible" role="alert">
                        <p className="text-center text-justify m-2">
                            <strong>Solicitação de redefinição de senha enviada!</strong>
                            <br />
                            Verifique sua caixa de entrada, endereço de email: {forgot_password.email}
                        </p>
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                            onClick={() => {
                                animateCSS('alertForgotPassword', 'fadeOut', () => {
                                    context.alertForgotPassword.classList.remove('show');
                                    context.setState({ 'forgot_password': { 'email': forgot_password.email, 'reset_password': true } });
                                    animateCSS('form-container', 'bounceIn');
                                });
                            }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            )
        }

        if (!new_account) {
            return (
                <div className="col-sm-4 col-md-4 align-self-center m-auto" id="form-container">
                    <div className="col-10 mt-3 ml-auto mr-auto alert alert-danger font-weight-bold invisible fixed-top" id="alertUser" role="alert">
                        {context.state.message_error}
                    </div>
                    <input
                        className="mb-2 form-control form-control-lg"
                        id="email"
                        type="email"
                        placeholder="Endereço de email"
                        onFocus={context.handleFocusRemoveAlert.bind(context)} />
                    <input
                        className="mb-2 form-control form-control-lg"
                        id="password"
                        type="password"
                        placeholder="Senha"
                        onFocus={context.handleFocusRemoveAlert.bind(context)} />
                    <button
                        type="button"
                        className="mb-2 btn btn-info btn-lg btn-block"
                        onClick={context.handleClickForgotPassword.bind(context)}>
                        Esqueceu sua senha?
                    </button>
                    <button
                        type="button"
                        className="mb-2 btn btn-primary btn-lg btn-block"
                        onClick={context.handleClickLogin.bind(context)}>
                        Acessar
                    </button>
                    <button
                        type="button"
                        className="mb-2 btn btn-primary btn-lg btn-block"
                        ref={btn => context.buttonCreateNewAccount = btn}
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
                <div className="col-sm-4 col-md-4 align-self-center m-auto" id="form-container">
                    <div className="col-10 mt-3 ml-auto mr-auto alert alert-danger font-weight-bold invisible fixed-top" id="alertUser" role="alert">
                        {context.state.message_error}
                    </div>
                    <input
                        className="mb-2 form-control form-control-lg"
                        id="name"
                        type="text"
                        placeholder="Nome completo"
                        onChange={context.handleNameConfirm.bind(context)} />
                    <input
                        className="mb-2 form-control form-control-lg"
                        id="email"
                        type="email"
                        placeholder="Endereço de email"
                        onChange={context.handleEmailExist.bind(context)} />
                    <input
                        className="mb-2 mr-2 form-control form-control-lg"
                        id="password"
                        type="password"
                        onChange={context.handleConfirmPassword.bind(context)}
                        placeholder="Senha" />
                    <input
                        className="mb-2 form-control form-control-lg"
                        id="password_confirm"
                        type="password"
                        onChange={context.handleConfirmPassword.bind(context)}
                        placeholder="Confirme a senha" />
                    <button
                        type="button"
                        className="mb-2 btn btn-primary btn-lg btn-block"
                        onClick={context.handleClickNewAccount.bind(context)}>
                        Criar a conta
                    </button>
                    <button
                        type="button"
                        className="mb-2 btn btn-primary btn-lg btn-block"
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
                    <div className="col-12 m-auto">
                        <div className="col-12">
                            <Image className="col-12" src={logo} style={{ 'height': '10vh' }} />
                            <h1 className="text-center text-uppercase" style={{ 'color': 'cyan' }}>Grupo Mave</h1>
                        </div>
                        <div className="col-12 overflow-auto" style={{ 'height': '70vh' }}>
                            <this.Auth context={this} newAccount={this.state.new_account} forgotPassword={this.state.forgot_password} />
                        </div>
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