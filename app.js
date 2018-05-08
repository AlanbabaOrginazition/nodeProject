const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const templating = require('./templating');
const cors = require('koa-cors');
const app = new Koa();

const isProduction = process.env.NODE_ENV === 'production'; 
var koaBody = require('koa-body')({
    "formLimit":"500mb",
    "jsonLimit":"500mb",
    "textLimit":"500mb"
});

app.use(cors({
    origin:function(ctx){
        return "http://localhost:8081";
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));//跨域配置
app.use(koaBody);
// log request URL:


// static file support:
if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// parse request body:
app.use(bodyParser());




// add nunjucks as view:
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

app.use(async (ctx, next) => {
    await next();
});

// add controller:
app.use(controller());

app.listen(2008);
console.log('app started at port 2008...');

//WebSocket服务器
// 导入WebSocket模块:
const ws = require('ws');
const WebSocketServer = ws.Server;

function createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
    let wss = new WebSocketServer ({
        server: server
    });
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
    onConnection = onConnection || function () {
        console.log('[WebSocket] connected.');
    };
    onMessage = onMessage || function (msg) {
        console.log('[WebSocket] message received: ' + msg);
    };
    onClose = onClose || function (code, message) {
        console.log(`[WebSocket] closed: ${code} - ${message}`);
    };
    onError = onError || function (err) {
        console.log('[WebSocket] error: ' + err);
    };
    wss.on('connection', function (ws) {
   
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);
        // check user:
        let user = parseUser(ws.upgradeReq);
        if (!user) {
            ws.close(4001, 'Invalid user');
        }
        ws.user = user;
        ws.wss = wss;
        onConnection.apply(ws);
    });
    console.log('WebSocketServer was attached.');
    return wss;
}

function onConnect() {
    let user = this.user;
    
    // build user list:每个用户登陆上来先初始化在线用户列表
    let users = this.wss.clients.map(function (client) {
            return client.user;
    });
    //筛选用户名
    let username = users.map(function(user){
        return user.name;
    });
    //筛选出重复的用户名
    let repeatUser = username.filter(function(name,i){
        if(username.indexOf(name) != i){
            return name;
        }
        return false;
    })
    //剔除重复登陆的用户
    this.wss.clients.map(function (client) {
        if(repeatUser.indexOf(client.user.name)> -1 ){
            delete repeatUser[repeatUser.indexOf(client.user.name)];
            client.send(createMessage('repeat', user, `${user.name} has login repeat`));
        }
    });

    //this为当前登录的client
    let userlist = username.filter(function(value,i){
        if(username.indexOf(value) == i){
            return true;
        }
        else{
            return false;
        }
    })
    this.send(createMessage('list', user, userlist));

    let msg = createMessage('join', user, `${user.name} joined.`);
    this.wss.broadcast(msg);
}

function onMessage(message) {
    console.log(message);
    if (message && message.trim()) {
        let msg = createMessage('chat', this.user, message.trim());
        this.wss.broadcast(msg);
    }
}

function onClose() {
    let user = this.user;
    let msg = createMessage('left', user, `${user.name} is left.`);
    this.wss.broadcast(msg);
}

let server = app.listen(3000);
app.wss = createWebSocketServer(server, onConnect, onMessage, onClose);

function createMessage(type, user, data) {
    return JSON.stringify({
        type: type,
        user: user,
        data: data
    });
}

function parseUser(obj) {
    if (!obj) {
        return;
    }
    console.log('try parse: ' + obj);
    let s = '';
    if (typeof obj === 'string') {
        s = obj;
    } else if (obj.headers.cookie) {
        let cookies = obj.headers.cookie;
        var reg = /user=.*/;
        s = cookies.match(reg)[0].split("=")[1];
    }
    if (s) {
        try {
            console.log(`User: ${s}`);
            var user = {name : s};
            return user;
        } catch (e) {
            // ignore
        }
    }
}