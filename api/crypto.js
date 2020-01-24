//================================================================================
// MODULOS DE SEGURANÇA
//================================================================================
const crypto = require('crypto'),
    algorithm = 'aes-256-gcm',
    password = require('../config/api').secret;

/**
 * @description Cria uma string para o vector da criptografia
 * @param {number} length Tamanho da string
 * @author GuilhermeSantos
 * @version 1.0.0
 * @returns {string}
 */
function ivGenerate(length) {
    var randomInt = function (max) {
        return Math.floor(max * Math.random());
    };
    var abc = [
        "a", "b", "c",
        "d", "e", "f",
        "g", "h", "i",
        "j", "k", "l",
        "m", "n", "o",
        "p", "q", "r",
        "s", "t", "u",
        "v", "w", "y",
        "z"
    ],
        nums = [
            1, 2, 3,
            4, 5, 6,
            7, 8, 9,
            0
        ],
        specials = [
            "_", "$", "@",
            "*", "#", "!",
            "-", "="
        ];
    var abc_length = abc.length - 1;
    var nums_length = nums.length - 1;
    var specials_length = specials.length - 1;
    var iv = "";
    while (iv.length < length) {
        let cif = randomInt(3);
        let uppercase = randomInt(2);
        if (cif == 0) {
            if (uppercase)
                iv += abc[randomInt(abc_length)].toUpperCase();
            else
                iv += abc[randomInt(abc_length)].toLowerCase();
        } else if (cif == 1) {
            iv += nums[randomInt(nums_length)];
        } else if (cif == 2) {
            iv += specials[randomInt(specials_length)];
        }
    }
    return iv;
};

/**
 * @description Cria uma criptografia para a string
 * @param {string} string Texto a ser criptografado
 * @author GuilhermeSantos
 * @version 1.0.0
 * @returns {{}}
 */
function encrypt(string) {
    if (!string || string && typeof string != 'string' ||
        string && typeof string === 'string' && string.length <= 0) {
        return false;
    }
    var iv = ivGenerate(64);
    var cipher = crypto.createCipheriv(algorithm, password, iv)
    var encrypted = cipher.update(string, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    var tag = cipher.getAuthTag();
    return {
        content: encrypted,
        tag: tag,
        iv: iv
    };
}

/**
 * @description Cria uma descriptografia para a string
 * @param {{}} encrypted Objeto a ser descriptografado
 * @author GuilhermeSantos
 * @version 1.0.0
 * @returns {string}
 */
function decrypt(encrypted) {
    try {
        var iv = encrypted.iv;
        var decipher = crypto.createDecipheriv(algorithm, password, iv);
        decipher.setAuthTag(encrypted.tag);
        var dec = decipher.update(encrypted.content, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (error) {
        return false;
    }
};

/**
 * @description Cria uma criptografia para a string que converte o Buffer em JSON
 * @param {string} string Texto a ser criptografado
 * @author GuilhermeSantos
 * @version 1.0.0
 * @returns {{}}
 */
function encryptJSON(string) {
    var encryptContent = encrypt(string);
    return {
        content: encryptContent.content,
        tag: JSON.stringify(encryptContent.tag),
        iv: encryptContent.iv
    }
};

/**
 * @description Cria uma descriptografia para a string com o Buffer em JSON
 * @param {{}} encrypted Objeto a ser descriptografado
 * @author GuilhermeSantos
 * @version 1.0.0
 * @returns {string}
 */
function decryptJSON(encrypted) {
    try {
        var iv = encrypted.iv;
        var decipher = crypto.createDecipheriv(algorithm, password, iv)
        decipher.setAuthTag(Buffer.from(JSON.parse(encrypted.tag).data));
        var dec = decipher.update(encrypted.content, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (error) {
        return false;
    }
};

module.exports = {
    encrypt,
    decrypt,
    encryptJSON,
    decryptJSON
}