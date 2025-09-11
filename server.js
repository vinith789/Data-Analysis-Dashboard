const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");

const app = express();
app.use(express.static("public"));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("excelFile"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet);

  res.json({ data: jsonData, columns: Object.keys(jsonData[0] || {}) });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
