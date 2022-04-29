function timeConverterFromUNIX(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = {
        year, month, date, hour, min, sec
    }
    return time;
}

function addLeadingZeros(number, targetLenght = 2) {
    return ('00000000000' + number).slice(-targetLenght);
}

export { timeConverterFromUNIX, addLeadingZeros };