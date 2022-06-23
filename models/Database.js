const mysql = require('mysql');
class Database {
    constructor() {
    }

    static connect() {
        return mysql.createConnection({
            'host': '127.0.0.1',
            'user': 'root',
            'password': 'password',
            'port': '3305',
            'database': 'manager',
            'charset': 'utf8_general_ci'
        })
    }
}
module.exports = Database;