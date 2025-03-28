import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { Button } from "@heroui/react";

const OCRProcessor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }, []);

  const extractTextFromPDF = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setExtractedText("");

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const typedarray = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let extracted = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        extracted += textContent.items.map(item => item.str).join(" ") + "\n";
      }

      setExtractedText(extracted);
    } catch (error) {
      console.error("Error extracting text:", error);
      alert("Error processing PDF");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">PDF Text Extractor</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="mb-4"
      />

      <Button
        onPress={extractTextFromPDF}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Extract Text'}
      </Button>

      {extractedText && (
        <div className="mt-4 p-4 bg-gray-100 border rounded">
          <h3 className="font-bold mb-2">Extracted Text:</h3>
          <div className="whitespace-pre-wrap max-h-96 overflow-auto">
            {extractedText}
          </div>
        </div>
      )}
    </div>
  );
};

export default OCRProcessor;