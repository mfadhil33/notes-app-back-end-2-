/* eslint-disable quotes */
const Hapi = require("@hapi/hapi");

require("dotenv").config();

// notes
const NotesService = require("./services/inMemory/NotesService");
const notes = require("./api/notes");
const NotesValidator = require("./validator/notes");

// user
const ClientError = require("./exceptions/ClientError");
const UserService = require("./services/postgres/UserService");
const UsersValidator = require("./validator/users");
const users = require("./api/users");

const init = async () => {
  // notes service
  const noteService = new NotesService();

  // users service
  const usersService = new UserService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== "production" ? process.env.HOST : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: noteService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);
  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request

    const { response } = request;

    //  penanganan  client error secara internal
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
