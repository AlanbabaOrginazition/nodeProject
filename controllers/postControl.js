var request = require('request');
var fs = require('fs');
module.exports = {
    'GET /login': async (ctx, next) => {
        ctx.render('postSystem/login.html', { title: '登录' });
    }, 
    'GET /login.app': async (ctx, next) => {
        ctx.render('postSystem/login.html', { title: '登录' });
    },
    'GET /welcome': async(ctx,next)=>{
        ctx.render('postSystem/welcome.html');
    },
    'GET /home': async(ctx,next)=>{
        ctx.render('postSystem/home.html');
    },
    'POST /postsql/signin': async (ctx, next) => {
        var
            username = ctx.request.body.username || '',
            password = ctx.request.body.password || '';
        if (username === 'lx' && password === '1') {
            console.log('signin ok!');
            ctx.cookies.set('user', "lx");
            ctx.render('postSystem/Canvas.html', {
                title: 'AlanBaBa'
            });
        } else if (username === 'xiaobai' && password === '1') {
            console.log('signin ok!');
            ctx.cookies.set('user', "xiaobai");
            ctx.render('postSystem/Canvas.html', {
                title: 'AlanBaBa'
            });
        } else {
            console.log('signin failed!');
            ctx.render('signin-failed.html', {
                title: 'Sign In Failed'
            });
        }
    },
    'GET /postsql/Canvas': async (ctx, next) => {
        ctx.render('postSystem/Canvas.html', { title: 'Canvas' });
    },
    'GET /postsql/sockt': async (ctx, next) => {
        if (ctx.headers.cookie || ctx.accept.headers.cookie){
            ctx.render('postSystem/Sockt.html', { title: 'Sockt' });
        }
        else {
            ctx.redirect('../login', { title: '登录' });
        }
    },
    'GET /postsql/Map': async (ctx, next) => {
            ctx.render('postSystem/Map.html', { title: '地图' });
    },
    'GET /postsql/dynPoint': async (ctx, next) => {
        //var html = fs.readFileSync('views/postSystem/dynPoint.html','UTF-8')
        ctx.render('postSystem/dynPoint.html', { title: '大量点动态绘制' });
    },
    'POST /base64ToImg': async (ctx, next) => {
        try{
            ctx.response.type = 'application/json';
            var base64 = ctx.request.body.base || '',
                x = ctx.request.body.x || 0,
                y = ctx.request.body.y || 0,
                zoom = ctx.request.body.zoom || 0;
            var baseUrl = `static/title/L${zoom}/R${y}`;  ///L${zoom}/R${y}
            
            
            if(fs.existsSync(`${baseUrl}/C${x}.png`)){

            }
            else{
                creatFolider(baseUrl,'');//创建多级文件夹
                var baseData = base64.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = new Buffer(baseData, 'base64');
                fs.writeFileSync(`${baseUrl}/C${x}.png`, dataBuffer, function(err) {
                    if(err){
                        res.send(err);
                    }else{
                        res.send("保存成功！");
                    }
                });
            }
            
            ctx.response.body = {
                result: 'ok'
            }

        }catch(e){
            ctx.response.body = {
                result: e
            }
        }
        
    },
    'POST /saveIMG': async (ctx, next) => {
        try{
            ctx.response.type = 'application/json';
            var baseData = ctx.request.body.baseData,
                layername =  ctx.request.body.layername,
                name = ctx.request.body.name;
            if (!fs.existsSync(`static/map/${layername}`)) {
                fs.mkdirSync(`static/map/${layername}`);
            }
            var dataBuffer = new Buffer(baseData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
            fs.writeFileSync(`static/map/${layername}/${name}.png`, dataBuffer, function(err) {
                if(err){
                        console.log('error');
                }else{
                    console.log('保存成功');
                }
            });
            
            ctx.response.body = {
                result: 'ok'
            }

        }catch(e){
            ctx.response.body = {
                result: e
            }
        }
        
    },

}
/**
 * 循环递归创建多级文件夹
 * @param {string} path 
 * @param {string} currentPath 
 */
function creatFolider(path,currentPath){
    if(typeof path == 'string'){
        var arr = path.split('/');
    }
    else{
        var arr = path;
    }
        
    if(currentPath){
         if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(`${currentPath}`);
        }
    }
    if(arr.length > 0){
        var front = arr.shift();
        if(currentPath){
            creatFolider(arr,`${currentPath}/${front}`);
        }else{
            creatFolider(arr,`${front}`);
        }
       
    }
}
