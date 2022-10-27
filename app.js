var http = require("http");
var fs = require("fs");
var qs = require('querystring');
const mysql = require('mysql');

http.createServer(function(req, res) {
    if (req.url === "/" || req.url === "/index.html") {//Nếu req từ root hoặc /index.html thì sẽ chuyển đến giao diện chính
        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.createReadStream(__dirname + "/index.html").pipe(res);
    } else if (req.url === "/banner.jpeg") {
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        fs.readFile(__dirname + "/banner.jpeg",
            function (err, content) {
                // Serving the image
                res.end(content);
            });
    } else if (req.url === "/api/get-data") {
        const connection = mysql.createConnection({
            host: 'sql.freedb.tech',
            user: 'freedb_trunghieu',
            password: 'Y@&9xcwERSZn?eS',
            database: 'freedb_RokStatistic'
        });
        connection.connect((error) => {
            if(error){
                console.log('Error connecting to the MySQL Database');
                return;
            }

        });
        const sql = "SELECT * from rokstatistic"
        connection.query(sql, function (err, result) {
            if (err) throw err;
            connection.end((error) => {
            });
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({
                data: result
            }));
            res.end();
        });

    } else if (req.url === "/api/post-data") {
        var body='';
        req.on('data', function (data) {
            body +=data;
        }).on('end', function (data) {
            params = qs.parse(body);
            const id = makeid(20)
            const connection = mysql.createConnection({
                host: 'sql.freedb.tech',
                user: 'freedb_trunghieu',
                password: 'Y@&9xcwERSZn?eS',
                database: 'freedb_RokStatistic'
            });
            connection.connect((error) => {
                if(error){
                    console.log('Error connecting to the MySQL Database');
                    return;
                }

            });
            const sql = `INSERT INTO rokstatistic ` +
                `VALUES ("${params.new_id}", "${params.new_name}", "${params.new_sum}", "${params.new_died}", "${params.new_score}", "${id}");`
            connection.query(sql, function (err, result) {
                if (err) throw err;
                connection.end((error) => {
                });
                res.end(id);
            });

        });

    } else if (req.url === "/api/edit-data") {
        var body='';
        req.on('data', function (data) {
            body +=data;
        }).on('end', function (data) {
            params = qs.parse(body);
            const connection = mysql.createConnection({
                host: 'sql.freedb.tech',
                user: 'freedb_trunghieu',
                password: 'Y@&9xcwERSZn?eS',
                database: 'freedb_RokStatistic'
            });
            connection.connect((error) => {
                if(error){
                    console.log('Error connecting to the MySQL Database');
                    return;
                }

            });
            const sql = `UPDATE rokstatistic ` +
                `SET ID_rok = "${params.id}", Name_rok = "${params.name}", Died_rok = "${params.new_died}", Army_unit_rok = "${params.sum}", Kill_point_rok = "${params.new_score}" ` +
                `Where id = "${params.pk}"`
            const result = connection.query(sql, function (err, result) {
                if (err) throw err;
                return result
            });
            connection.end((error) => {
            });
            res.end(result);
        });
        res.end();
    }
}).listen(3000);

console.log("Listening on port 3000... ");

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}