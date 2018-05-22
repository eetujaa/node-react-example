var Sequelize = require('sequelize');

/** INIT DATABASE **/

const sequelize = new Sequelize({
  logging: false,
  dialect: 'sqlite',
  storage: './db/chat.sqlite',
});

/** INIT CHAT TABLE WITH MESSAGE **/

const Chat = sequelize.define('chats', {
    x1: Sequelize.FLOAT,
    y1: Sequelize.FLOAT,
    z1: Sequelize.FLOAT,
    a: Sequelize.FLOAT,
}, {
  timestamps: true,
  instanceMethods: {
    toJSON: async function () {
      return {
        // Id and timestamps are generated automatically
        id: this.id,
        createdAt: this.createdAt,

        // Message was added on the POST request
          x1: this.x1,
          y1: this.y1,
          z1: this.z1,
          a: this.a,
      };
    },
  },
});

/** EXPORT CHAT OBJECT **/

exports.sync = (options) => {
  return sequelize.sync(options);
};

exports.Chat = Chat;
