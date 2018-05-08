const config = require('./services.config');
var { Client } = require('pg');
const mysql = require('mysql');

async function postsqlQuery(sql) {
    var postConfig = config.postConfig;
    var promise = new Promise(function (resolve, reject) {
        const client = new Client({
            user: postConfig.user,
            host: postConfig.host,
            database: postConfig.database,
            password: postConfig.password,
            port: postConfig.port,
        })
        client.connect();
        client.query(
            sql,
            (err, results) => {
                if (results) {
                    //console.log(results);
                    resolve(TableToJson(results));
                }
                if (err) {
                    reject(err);
                }
                client.end();
            }
        );
    });
    /*promise.then(function (value) {
        //console.log(value);
        return value;
        // success
    }, function (err) {
        // failure
        return err
    });*/
    return promise;//必须返回promise对象
}
async function mysqlQuery(sql) {
    var promise = new Promise(function (resolve, reject) {
        var mysql_connection = mysql.createConnection({
            host: '35.201.150.105',
            user: 'TabGis',
            password: 'liuxin',
            database: 'TabGis'
        });
        mysql_connection.connect();
        mysql_connection.query(sql, function (error, results, fields) {
            if (error) reject(error);
            else {
                resolve(results);
            }
            mysql_connection.end();
        });
    });
    return promise;
}
function TableToJson(dt) {
    var fields = dt.fields.map((val, index, arr) => {
        return val.name;
    })
    var value = dt.rows.map((val, index, arr) => {
        if (val.st_asgeojson) {
            val.st_asgeojson = JSON.parse(val.st_asgeojson);
        }
        return val;
    });
    var counts = dt.rowCount;
    var result = {
        fields: fields,
        value: value,
        counts: counts
    };
    return result;
}

module.exports = {
    postsqlQuery: postsqlQuery,
    mysqlQuery: mysqlQuery
}