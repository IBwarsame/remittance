const { randomUUID } = require("crypto");

class UserDao {
    constructor(db) {
        this.db = db;
    }

    findById(id) {
        return this.db
            .prepare("SELECT * FROM users WHERE id = ?")
            .get(id);
    }

    findByEmail(email) {
        return this.db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(email.toLowerCase().trim());
    }

    findByToken(token) {
        return this.db
            .prepare("SELECT * FROM users WHERE verificationToken = ?")
            .get(token);
    }

    create(data) {
        this.db
            .prepare(
                `INSERT INTO users (
                    id, fullName, email, phone, passwordHash,
                    role, isVerified, verificationToken, createdAt
                ) VALUES (
                    @id, @fullName, @email, @phone, @passwordHash,
                    @role, 0, @verificationToken, @createdAt
                )`
            )
            .run(data);
    }

    verify(id) {
        this.db
            .prepare(
                "UPDATE users SET isVerified = 1, verificationToken = NULL WHERE id = ?"
            )
            .run(id);
    }

    updateRole(id, role) {
        this.db
            .prepare("UPDATE users SET role = ? WHERE id = ?")
            .run(role, id);
    }
    setPasswordResetToken(id, token, expiresAt) {
        this.db
          .prepare(
            `UPDATE users
             SET passwordResetToken = ?, passwordResetExpiresAt = ?
             WHERE id = ?`
          )
          .run(token, expiresAt, id);
      }
      
      findByPasswordResetToken(token) {
        return this.db
          .prepare("SELECT * FROM users WHERE passwordResetToken = ?")
          .get(token);
      }
      
      updatePassword(id, passwordHash) {
        this.db
          .prepare(
            `UPDATE users
             SET passwordHash = ?,
                 passwordResetToken = NULL,
                 passwordResetExpiresAt = NULL
             WHERE id = ?`
          )
          .run(passwordHash, id);
      }
      clearPasswordResetToken(id) {
        this.db
            .prepare(
                `UPDATE users
                 SET passwordResetToken = NULL,
                     passwordResetExpiresAt = NULL
                 WHERE id = ?`
            )
            .run(id);
    }
}

module.exports = UserDao;