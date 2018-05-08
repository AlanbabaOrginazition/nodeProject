const db = require("./db");

module.exports = {
    'POST /d3/data': async (ctx, next) => {
        var distance = ctx.request.body.distance || 500;
        var neednum = ctx.request.body.neednum || 1;
        ctx.response.type = 'application/json';
        try{
            var data = await db.databaseHandle(`SELECT * from Buffer(${distance},${neednum});`);
            ctx.response.body = {
                result: data
            }
        }
        catch(e){
            ctx.response.body = {
                error: e.message
            }
        }  
    },
    'POST /vertify':async(ctx,next) => {
        ctx.response.type="application/json";
        var
            username = ctx.request.body.username || '',
            password = ctx.request.body.password || '';
        try{
            var data = await db.mysqlQuery(`SELECT * FROM USERINFO WHERE USERNAME='${username}' AND PASSWORD='${password}';`);
            if(data.length > 0){
                ctx.render('postSystem/Canvas.html', {
                    title: 'AlanBaBa'
                });
            }
        }catch(e){
            ctx.response.body = {
                error: e.message
            }
        }
    },
    'GET /getHeaderData':async(ctx,next)=>{
        ctx.response.type="application/json";
        var sql = 'SELECT * FROM HEADER ORDER BY PID';
        try{
            let data = await db.postsqlQuery(sql);
            if(data.counts>0){
                var res = new Map();
                data.value.map(item=>{
                    if(item.pid == 0){
                        res.set(item.id,{name:item.name,children:[]});
                    }else{
                        res.get(item.pid).children.push({name:item.name,link:item.link});
                    }
                })
                //map转json
                let arr = new Array();
                for (let[k,v] of res) {
                    arr[k-1] = v;
                  }
                ctx.response.body = {
                    data:arr
                }
            }
        }catch(e){
            ctx.response.body = {
                error: e.message
            }
        }
    }
}