/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
class NotesHandler {
  constructor(service) {
    this._service = service;
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getnoteByIdHandler = this.getnoteByIdHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    try {
      const { title = "untitled", body, tags } = request.payload;
      const noteId = await this._service.addNote({ title, body, tags });
      const response = h.response({
        status: "success",
        message: "Catatan berhasil ditambahkan",
        data: {
          noteId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });

      response.code(400);
      return response;
    }
  }

  async getNotesHandler(request) {
    const notes = await this.service.getNotes();
    return {
      status: "success",
      data: {
        notes,
      },
    };
  }

  async getnoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const notesById = await this.service.getNotesById(id);
      return {
        status: "success",
        message: `Data berhasil di temukan dengan id ${id}`,
        data: {
          notesById,
        },
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });

      response.code(404);
      return response;
    }
  }

  async putNoteByIdHandler(requst, h) {
    try {
      const { id } = request.params;

      await this._service.editNoteById(id, request.payload);
      return {
        status: "success",
        message: "Catatan berhasil di  perbarui",
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        mesasge: error.message,
      });

      response.code(404);
      return response;
    }
  }

  async deleteNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteNoteById(id);
      return {
        status: "success",
        message: "Catatan berhasil dihapus",
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }
}

module.exports = NotesHandler;
