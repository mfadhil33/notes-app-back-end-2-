/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const ClientError = require("../../exceptions/ClientError");

/* eslint-disable no-underscore-dangle */
class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
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
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(400);
        return response;
      }

      // server error
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami",
      });
      response.code(500);
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

  async getNoteByIdHandler(request, h) {
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
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
    }

    // server error
    const response = h.response({
      status: "error",
      message: "Maaf, terjadi kegagalan pada server kami",
    });
    response.code(500);
    return response;
  }

  async putNoteByIdHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { id } = request.params;

      await this._service.editNoteById(id, request.payload);
      return {
        status: "success",
        message: "Catatan berhasil di  perbarui",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami",
      });
      response.code(500);
      console.error(error);
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
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami",
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = NotesHandler;
