/* eslint-disable quotes */
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPass = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedPass, fullname],
    };

    const result = await this._pool.query(query);
  }

  async verifyUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user. Username sudah di gunakan"
      );
    }
  }
}

module.exports = UserService;
