module.exports = (str, length) => {
    while (String(str).length < length) {
        let new_str = '0' + str;
        str = new_str;
    }
    return str;
}