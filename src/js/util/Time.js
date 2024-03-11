function Time() {}


Time.prototype.unixtsToLocate = function (ts) {
    if (!ts > 0) {
        return '';
    }
    var d = new Date(ts);

    return d.toLocaleDateString("default") + "  " + d.toLocaleTimeString("default")
}


const obj = new Time()
export default obj