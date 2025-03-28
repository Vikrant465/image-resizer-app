// // // pages/api/upload1.js
// // import fs from "fs";
// // import path from "path";
// // import multer from "multer";
// // import pdfParse from "pdf-parse";
// // import { promisify } from "util";

// // const uploadDir = "/tmp/uploads";
// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir, { recursive: true });
// // }

// // const upload = multer({ dest: uploadDir });
// // export const config = { api: { bodyParser: false } };

// // const uploadMiddleware = promisify(upload.single("file"));

// // export default async function handler(req, res) {
// //   if (req.method !== "POST") return res.status(405).end();

// //   try {
// //     await uploadMiddleware(req, res);

// //     if (!req.file) {
// //       return res.status(400).json({ error: "No file uploaded" });
// //     }

// //     const filePath = path.join(uploadDir, req.file.filename);
// //     const fileBuffer = fs.readFileSync(filePath);

// //     // Extract text from PDF
// //     const data = await pdfParse(fileBuffer);
// //     const text = data.text;

// //     // Extract names using regex
// //     const nameRegex = /Name:\s*([^\n]+)/gi;
// //     const matches = [...text.matchAll(nameRegex)];
// //     const extractedData = matches.map(match => ({
// //       name: match[1].trim().replace(/^\d+/g, "") // Remove leading numbers
// //     }));

// //     fs.unlinkSync(filePath); // Cleanup

// //     res.status(200).json({ extractedData });
// //   } catch (error) {
// //     console.error("Error:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // }
// import fs from "fs";
// import path from "path";
// import multer from "multer";
// import pdfParse from "pdf-parse";
// import { promisify } from "util";

// const uploadDir = "/tmp/uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const upload = multer({ dest: uploadDir });
// export const config = { api: { bodyParser: false } };

// const uploadMiddleware = promisify(upload.single("file"));

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   try {
//     await uploadMiddleware(req, res);

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const filePath = path.join(uploadDir, req.file.filename);
//     const fileBuffer = fs.readFileSync(filePath);

//     // Extract full text from PDF
//     const data = await pdfParse(fileBuffer);
//     const extractedText = data.text;
//     console.log(extractedText);
//     fs.unlinkSync(filePath); // Cleanup

//     res.status(200).json({ extractedText });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// }
import fs from "fs";
import path from "path";
import multer from "multer";
import pdfParse from "pdf-parse";
import { promisify } from "util";

const uploadDir = "/tmp/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });
export const config = { api: { bodyParser: false } };

const uploadMiddleware = promisify(upload.single("file"));

// Helper function to clean and parse numbers
const cleanNumber = (str) => parseFloat(str.replace(/[.,]/g, (m) => m === "." ? "" : "."));

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await uploadMiddleware(req, res);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(uploadDir, req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);

    // Extract text from PDF
    const data = await pdfParse(fileBuffer);
    const text = data.text;
    
    // Extract header information
    const companyMatch = text.match(/Company\s*:\s*([^\n]+)/i);
    const accountNumberMatch = text.match(/Account Number\s*:\s*([^\n]+)/i);
    const reportIdMatch = text.match(/Report ID\s*:\s*([^\n]+)/i);
    const currencyMatch = text.match(/Currency\s*:\s*([^\n]+)/i);

    // Extract balances
    const openingBalanceMatch = text.match(/Opening Ledger Balance\s*:\s*([\d.,]+)/i);
    const closingBalanceMatch = text.match(/Closing Ledger Balance\s*:\s*([\d.,]+)/i);

    // Extract transactions
    const transactionLines = text.split('\n').filter(line => {
      const datePattern = /\d{2} \w{3} \d{4}/;
      return datePattern.test(line) && line.includes("|");
    });

    const transactions = transactionLines.map(line => {
      const columns = line.split(/\s{2,}/).filter(col => col.trim());
      return {
        transactionDate: columns[0],
        valueDate: columns[1],
        transactionReference: columns[2],
        customerReference: columns[3],
        branch: columns[4],
        debitCredit: columns[5],
        amount: cleanNumber(columns[6]),
        transactionDetails: columns[7],
        transactionType: columns[8]
      };
    });

    const result = {
      company: companyMatch ? companyMatch[1].trim() : null,
      accountNumber: accountNumberMatch ? accountNumberMatch[1].trim() : null,
      reportId: reportIdMatch ? reportIdMatch[1].trim() : null,
      currency: currencyMatch ? currencyMatch[1].trim() : null,
      openingBalance: openingBalanceMatch ? cleanNumber(openingBalanceMatch[1]) : null,
      closingBalance: closingBalanceMatch ? cleanNumber(closingBalanceMatch[1]) : null,
      transactions: transactions
    };
    console.log(result);
    fs.unlinkSync(filePath); // Cleanup

    res.status(200).json({ extractedData: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}