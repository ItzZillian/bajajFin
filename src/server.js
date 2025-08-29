const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { classifyData, makeUserId } = require("./logic");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "BFHL API is running" });
});

// Spec endpoint
app.post("/bfhl", (req, res) => {
  try {
    const body = req.body;

    if (!body || !Array.isArray(body.data)) {
      return res.status(400).json({
        is_success: false,
        message: "Request body must be { data: string[] }"
      });
    }

    const {
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum,
      concat_string
    } = classifyData(body.data);

    const fullName = process.env.FULL_NAME || "";
    const dob = process.env.DOB_DDMMYYYY || "";
    const email = process.env.EMAIL || "";
    const roll = process.env.ROLL_NUMBER || "";

    const response = {
      is_success: true,
      user_id: makeUserId(fullName, dob),
      email,
      roll_number: roll,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum,
      concat_string
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      is_success: false,
      message: "Internal server error"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BFHL API listening on port ${PORT}`);
});
