/**
 * Import React
 */
import React from "react";

/**
 * Import Axios
 */
import axios from 'axios';

/**
 * Import LZ-String
 */
import * as LZString from 'lz-string';

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
            record_webtoken: '',
            record_email: '',
            message_error: '',
            message_error_code: 0,
            new_account_invitetoken: false,
            new_account_webtoken: false,
            new_account_name: false,
            new_account_email: false,
            new_account_password: false
        }
    }

    componentDidMount() {
        document.body.style.backgroundColor = '#282c34';
        document.body.style.backgroundSize = 'cover';
        document.body.style.animationDuration = '1s';

        axios.defaults.baseURL = 'http://localhost:5000';

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
                document.getElementById('invitetoken').value = '';
                document.getElementById('webtoken').value = String(this.state.record_webtoken).length > 0 ? String(this.state.record_webtoken) : '';
                document.getElementById('email').value = String(this.state.record_email).length > 0 ? String(this.state.record_email) : '';
                document.getElementById('name').value = '';
                document.getElementById('password').value = '';
                document.getElementById('password_confirm').value = '';

                this.handleEmailExist();
            } else if (this.state.forgot_password && this.state.forgot_password['reset_password']) {
                document.getElementById('webtoken').value = this.state.forgot_password['webtoken'];
                document.getElementById('email').value = this.state.forgot_password['email'];
                document.getElementById('token_resetPassword').value = '';
                document.getElementById('password').value = '';
                document.getElementById('password_confirm').value = '';
            } else {
                if (document.getElementById('webtoken')) {
                    if (this.state.message_error_code !== 1) {
                        document.getElementById('webtoken').value = String(this.state.record_webtoken).length > 0 ? String(this.state.record_webtoken) : '';
                        document.getElementById('webtoken').disabled = false;
                    }
                }

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

    getApiKey() {
        return "5i@41Yb#!##@P4!NsrvJ-D3DK$Q89-3*Y-#59#$*CW2#!P@U45#q*#$42H4q!63gsQ-64b991IK$R#8r_-$*_46#*1@5s!@A3@_56e36!*@65n517W76_@9P#!$54s@-dQ45#7rtp7-5!2!34@#4Fj44g1-_7-@8-#Smf37Bkg@1D$6-_eT#3@@3PHpPa55q_7@-4-aj2788K_@K1g!913_S72h3$@5#71-g!5vN34*uH834o-7t@t#$@9QH4sp1";
    }

    setSessionUser(data) {

        if (typeof data !== 'object') return false;

        return localStorage.setItem('auth', LZString.compressToBase64(JSON.stringify({
            'id': data['id'],
            'name': data['name'],
            'email': data['email'],
            'token': data['token'],
            'webtoken': data['webtoken']
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
                typeof forgotPassword.webtoken !== 'string' ||
                typeof forgotPassword.email !== 'string' ||
                !forgotPassword.expires
            ) {
                return sessionStorage.removeItem('reset_password');
            }

            forgotPassword.expires = new Date(forgotPassword.expires);

            if (now > forgotPassword.expires) {
                return sessionStorage.removeItem('reset_password');
            } else {
                this.setState({ 'forgot_password': { 'email': forgotPassword.email, 'webtoken': forgotPassword.webtoken, 'reset_password': true } });
                if (document.getElementById('email'))
                    document.getElementById('email').value = String(forgotPassword.email);
                if (document.getElementById('webtoken'))
                    document.getElementById('webtoken').value = String(forgotPassword.webtoken);
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

        const
            webtoken = document.getElementById('webtoken').value,
            email = document.getElementById('email').value;

        if (
            String(webtoken).length <= 0
        ) return animateCSS('webtoken', 'shake');

        if (
            String(email).length <= 0
        ) return animateCSS('email', 'shake');

        axios.post('/api/auth/forgot_password',
            {
                webtoken: String(webtoken),
                email: String(email)
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

                    if (data.user) {
                        let now = new Date();

                        now.setHours(now.getHours() + 1);

                        sessionStorage.setItem('reset_password', LZString.compressToBase64(JSON.stringify({
                            'email': String(email),
                            'webtoken': String(webtoken),
                            'expires': now
                        })))

                        animateCSS('form-container', 'fadeOutDown', () => {
                            this.setState({ 'forgot_password': { 'email': String(email), 'webtoken': String(webtoken) } });
                            animateCSS('alertForgotPassword', 'fadeInUp');
                        });
                    }
                } else {
                    this.setState({ 'message_error': `Não foi possivel enviar a solicitação para a troca de senha no endereço de email (${email})` });
                    if (document.getElementById('alertUser').classList.contains('invisible')) {
                        document.getElementById('alertUser').classList.remove("invisible");
                        animateCSS('alertUser', 'fadeInUp');
                    }
                }
            })
            .catch((err) => {
                return new Error(err);
            })
    }

    handleClickResetPassword() {
        const
            webtoken = document.getElementById('webtoken').value,
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
            axios.post('/api/auth/reset_password',
                {
                    webtoken: String(webtoken),
                    email: String(email),
                    token: String(token),
                    password: String(password)
                },
                {
                    headers: {
                        "content-type": "application/json",
                        "api_key": this.getApiKey()
                    }
                })
                .then((data) => {
                    if (!data['error']) {
                        data = data['data']['query']['results'];

                        if (data.user) {
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
                    } else {
                        const code = Number(data['code']);

                        if (code === 1) {
                            this.setState({ 'message_error': `Não foi possivel encontrar seu token` });
                            sessionStorage.removeItem('reset_password');
                        } else if (code === 2) {
                            this.setState({ 'message_error': `Token invalido` });
                        } else if (code === 3) {
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
                    }
                })
                .catch((err) => {
                    return new Error(err);
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
            webtoken = document.getElementById('webtoken').value,
            email = document.getElementById('email').value,
            password = document.getElementById('password').value;

        if (
            String(webtoken).length <= 0 ||
            String(email).length <= 0 ||
            String(password).length <= 0
        ) {
            animateCSS('webtoken', 'shake');
            animateCSS('email', 'shake');
            animateCSS('password', 'shake');
            return;
        }

        const
            http = require("http"),
            options = {
                "method": "POST",
                "hostname": 'base_url',
                "port": "5000",
                "path": "/api/auth/sign",
                "headers": {
                    "content-type": "application/json",
                    "api_key": this.getApiKey(),
                    "content-length": "57"
                }
            },
            context = this,
            req = http.request(options, function (res) {
                let chunks = [];

                const
                    onSuccess = (data) => {
                        const
                            user = data.user,
                            token = data.token;

                        if (user) {
                            context.setSessionUser({
                                'name': String(user['nome']),
                                'email': String(user['email']),
                                'token': String(token),
                                'webtoken': String(webtoken),
                            })
                            context.componentCallChangePage('/app', {});
                        }
                    },
                    onError = (code) => {

                        document.getElementById('password').value = '';

                        if (
                            !document.getElementById('webtoken').classList.contains("is-invalid") ||
                            !document.getElementById('email').classList.contains("is-invalid") ||
                            !document.getElementById('password').classList.contains("is-invalid")
                        ) {
                            document.getElementById('webtoken').classList.add("is-invalid");
                            document.getElementById('email').classList.add("is-invalid");
                            document.getElementById('password').classList.add("is-invalid");
                        }

                        switch (code) {
                            case 1:
                                context.setState({ 'message_error': `Chave de acesso inválida.`, 'message_error_code': 1 });
                                break;
                            case 2:
                                context.setState({ 'message_error': `Senha inválida.`, 'message_error_code': 1 });
                                break;
                            case 3:
                                context.setState({ 'message_error': `Endereço de email não existe.`, 'message_error_code': 1 });
                                break;
                            default:
                                context.setState({ 'message_error': `Não foi possível efetuar o login, tente novamente mais tarde...`, 'message_error_code': 1 });
                                break;
                        }

                        if (document.getElementById('alertUser').classList.contains("invisible")) {
                            document.getElementById('alertUser').classList.remove("invisible");
                            animateCSS('alertUser', 'fadeInUp');
                        }
                    }

                res.on("data", chunk => chunks.push(chunk));

                res.on("end", () => {
                    const body = Buffer.concat(chunks);

                    try {
                        const data = JSON.parse(body.toString());

                        if (data['error']) {
                            return onError(data['code']);
                        } else {
                            return onSuccess(data['query']['results']);
                        }

                    } catch (err) {
                        return new Error(err);
                    }

                });
            });

        req.write(JSON.stringify({ webtoken: String(webtoken), email: String(email), password: String(password) }));
        req.end();
    }

    handleEmailExist = () => {
        const
            webtoken = document.getElementById('webtoken').value,
            email = document.getElementById('email').value,
            validation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

        if (String(webtoken).length <= 0) { return; }

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

        const
            http = require("http"),
            options = {
                "method": "GET",
                "hostname": 'base_url',
                "port": "5000",
                "path": "/api/users/all",
                "headers": {
                    "content-type": "application/json",
                    "api_key": this.getApiKey(),
                    "content-length": "57"
                }
            },
            context = this,
            req = http.request(options, function (res) {
                let chunks = [];

                const
                    onSuccess = (data) => {
                        if (data.length > 0 && data.filter(user => user['email'] === String(email)).length > 0) {
                            context.setState({ 'message_error': `Endereço de email (${email}) já está em uso.`, 'new_account_email': false });

                            if (document.getElementById('alertUser').classList.contains('invisible')) {
                                document.getElementById('alertUser').classList.remove('invisible');
                                document.getElementById('email').classList.add('is-invalid');
                                animateCSS('alertUser', 'fadeInUp');
                            }
                        } else {
                            context.setState({ 'new_account_email': true });

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
                    },
                    onError = () => {
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
                    }

                res.on("data", chunk => chunks.push(chunk));

                res.on("end", () => {
                    const body = Buffer.concat(chunks);

                    try {
                        const data = JSON.parse(body.toString());

                        if (data['error']) {
                            return onError();
                        } else {
                            return onSuccess(data['query']['results']);
                        }

                    } catch (err) {
                        return new Error(err);
                    }

                });
            });

        req.write(JSON.stringify({ webtoken: String(webtoken), email: String(email) }));
        req.end();
    }

    handleClickNewAccount = () => {

        const
            invitetoken = document.getElementById('invitetoken').value,
            webtoken = document.getElementById('webtoken').value,
            name = document.getElementById('name').value,
            email = document.getElementById('email').value,
            password = document.getElementById('password').value,
            password_confirm = document.getElementById('password_confirm').value;

        if (
            String(invitetoken).length <= 0 ||
            String(webtoken).length <= 0 ||
            String(password).length <= 0 ||
            String(email).length <= 0 ||
            String(password).length <= 0 ||
            String(password_confirm).length <= 0
        ) {
            animateCSS('invitetoken', 'shake');
            animateCSS('webtoken', 'shake');
            animateCSS('name', 'shake');
            animateCSS('email', 'shake');
            animateCSS('password', 'shake');
            animateCSS('password_confirm', 'shake');
            return;
        }

        if (this.state.new_account_invitetoken && this.state.new_account_webtoken && this.state.new_account_name && this.state.new_account_email && this.state.new_account_password) {
            const
                http = require("http"),
                options = {
                    "method": "POST",
                    "hostname": 'base_url',
                    "port": "5000",
                    "path": "/api/users/register",
                    "headers": {
                        "content-type": "application/json",
                        "api_key": this.getApiKey(),
                        "content-length": "57"
                    }
                },
                context = this,
                req = http.request(options, function (res) {
                    let chunks = [];

                    const
                        onSuccess = (data) => {
                            const
                                user = data.user,
                                token = data.token;

                            if (user) {
                                context.setSessionUser({
                                    'id': String(user['ID']),
                                    'name': String(user['nome']),
                                    'email': String(user['email']),
                                    'token': String(token),
                                    'webtoken': String(webtoken)
                                })
                                context.componentCallChangePage('/app', {});
                            }
                        },
                        onError = () => {
                            if (
                                document.getElementById('invitetoken').classList.contains('is-valid') ||
                                document.getElementById('invitetoken').classList.contains('is-invalid')
                            ) {
                                document.getElementById('invitetoken').classList.remove('is-valid');
                                document.getElementById('invitetoken').classList.remove('is-invalid');
                            }

                            if (
                                document.getElementById('webtoken').classList.contains('is-valid') ||
                                document.getElementById('webtoken').classList.contains('is-invalid')
                            ) {
                                document.getElementById('webtoken').classList.remove('is-valid');
                                document.getElementById('webtoken').classList.remove('is-invalid');
                            }

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

                            document.getElementById('invitetoken').value = '';
                            document.getElementById('webtoken').value = '';
                            document.getElementById('name').value = '';
                            document.getElementById('email').value = '';
                            document.getElementById('password').value = '';
                            document.getElementById('password_confirm').value = '';

                            context.setState({ 'message_error': `Não foi possivel criar sua conta` });
                            if (document.getElementById('alertUser').classList.contains('invisible')) {
                                document.getElementById('alertUser').classList.remove("invisible");
                                animateCSS('alertUser', 'fadeInUp');
                            }
                        }

                    res.on("data", chunk => chunks.push(chunk));

                    res.on("end", () => {
                        const body = Buffer.concat(chunks);

                        try {
                            const data = JSON.parse(body.toString());

                            if (data['error']) {
                                return onError();
                            } else {
                                return onSuccess(data['query']['results']);
                            }

                        } catch (err) {
                            return new Error(err);
                        }

                    });
                });

            req.write(JSON.stringify({ invitetoken: String(invitetoken), webtoken: String(webtoken), name: String(name), email: String(email), password: String(password) }));
            req.end();
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

    handleInviteToken() {
        const invitetoken = document.getElementById('invitetoken').value;

        if (invitetoken.length <= 0) {
            this.setState({ 'new_account_invitetoken': false });
        } else {
            this.setState({ 'new_account_invitetoken': true });
        }
    }

    handleWebToken() {
        const webtoken = document.getElementById('webtoken').value;

        if (webtoken.length <= 0) {
            this.setState({ 'new_account_webtoken': false });
        } else {
            this.setState({ 'new_account_webtoken': true });
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
                        id="webtoken"
                        type="text"
                        placeholder="Codigo de acesso"
                        defaultValue={forgot_password.webtoken}
                        disabled />
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
                                context.setState({ 'forgot_password': false, 'record_email': document.getElementById('email').value, 'record_webtoken': document.getElementById('webtoken').value });
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
                                    context.setState({ 'forgot_password': { 'email': forgot_password.email, 'webtoken': forgot_password.webtoken, 'reset_password': true } });
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
                        id="webtoken"
                        type="text"
                        placeholder="Chave de acesso"
                        onFocus={context.handleFocusRemoveAlert.bind(context)} />
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
                            context.setState({ 'new_account': true, 'record_email': document.getElementById('email').value, 'record_webtoken': document.getElementById('webtoken').value });
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
                        id="invitetoken"
                        type="text"
                        placeholder="Chave de segurança"
                        onChange={context.handleInviteToken.bind(context)} />
                    <input
                        className="mb-2 form-control form-control-lg"
                        id="webtoken"
                        type="text"
                        placeholder="Chave de acesso"
                        onChange={context.handleWebToken.bind(context)} />
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
                            context.setState({ 'new_account': false, 'record_email': document.getElementById('email').value, 'record_webtoken': document.getElementById('webtoken').value });
                        }}>
                        Voltar
                    </button>
                </div >
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