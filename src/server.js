const Hapi = require("@hapi/hapi");

require("dotenv").config();

const NotesService = require("./services/inMemory/NotesService");
const notes = require("./api/notes");

const init = async () => {
  const noteServices = new NotesService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== "production" ? process.env.HOST : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: noteServices,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
