var times = 1; //How many iterations from every address
var TARGET = 'http://google.com'; //Target adress


var http = require('http');
var fs = require('fs');
var proxy_list = [];

function connect(times){
    for(var z = 0; z < times; z++){
        for(var i = 0; i < proxy_list.length; i++){
            console.log(proxy_list[i].host)
            var total = proxy_list.length;
            var success = 0;
            var req = http.get({
                host: proxy_list[i].host,
                port: proxy_list[i].port,
                path: TARGET,
                headers: {
                    'method':'GET',
                    'connection':'Keep-alive',
                    'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'user-agent':'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
                    'is-secure-connection':'True',
                    'x-forwarded-for':'',
                },
            }, function (response) {
                response.on('error', (e) => {
                    console.log("Error: "+ e.message);
                    response.resume();
                })
                response.on('end', (e) => {

                }).on('error', (e) => {
                    console.log(e.message)
                    response.end();
                })
                success += 1;
                console.log('Connection succeded! ' + success + '/' + total + '.');
                req.abort();
            });
            req.on('error', (e)=>{
                console.log(e.message);
                req.abort();
            })
        }
    }
}

fs.readFile('./proxy_list.txt', 'utf8', (err, data) => {
    proxy_list = data.split('\n');
    for(var i in proxy_list){
        proxy_list[i] = proxy_list[i].split(" ");
    }
    for(var i in proxy_list){
        proxy_list[i] = {host: proxy_list[i][0], port: parseInt(proxy_list[i][1])}
    }
    connect(times);
});

