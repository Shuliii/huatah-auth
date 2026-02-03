const connection = require("./db");
const bcrypt = require("bcryptjs");

class User {
  static async createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      "INSERT INTO userlist (Username, Password, isActive, isAdmin) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, 0, 0],
    );
    return result;
  }
  static async findUser(username) {
    const [result] = await connection.query(
      "SELECT * FROM userlist WHERE Username = ?",
      [username],
    );
    return result[0];
  }
  static async changePassword(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      "UPDATE userlist SET Password = ?, isActive = 0 WHERE Username = ?",
      [hashedPassword, username],
    );
    // Check if any rows were affected
    if (result.affectedRows === 0) {
      throw new Error("Password update failed");
    }
  }
}

module.exports = User;
