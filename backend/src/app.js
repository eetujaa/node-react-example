const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('kcors');

const database = require('./database');

/** CREATE AND CONF THE WEB SERVER **/

const app = module.exports = new Koa();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}

app.use(cors({ credentials: true }));
app.use(bodyParser());

/** METHODS TO RESPOND TO THE ROUTES **/

const listChats = async (ctx) => {
  let options = {limit: 2};

  let result = await database.Chat.findAll(options);
  let chats = await Promise.all(result.map(chat => chat.toJSON()));
  
  let a = 0;

  if (chats.length > 1) {
    const x1 = chats[0].x - chats[1].x;
    const y1 = chats[0].y - chats[1].y;
    const z1 = chats[0].z - chats[1].z;
    const timediff = chats[0].createdAt - chats[1].createdAt;

    a = Math.sqrt( Math.pow(x1,2)+Math.pow(y1,2)+Math.pow(z1,2));
  }

  let response = {
    results: chats,
    a: a,
  };

  ctx.body = response;
};

const createChat = async (ctx) => {
  const params = ctx.request.body;

  const chat = await database.Chat.create({x: params.x, y: params.y, z: params.z});

  ctx.body = await chat.toJSON();
  ctx.status = 201;
};

/** CONFIGURING THE API ROUTES **/

const publicRouter = new Router({ prefix: '/api' });

publicRouter.get('/chats', listChats);
publicRouter.post('/chats', createChat);

app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());

/** jaaha **/