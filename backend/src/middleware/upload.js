// middleware/upload.js
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/proofs"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        // Random filename — never trust the original name
        const name = crypto.randomBytes(16).toString("hex");
        cb(null, `${name}${ext}`);
    },
});

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
        }
    },
});

module.exports = upload;