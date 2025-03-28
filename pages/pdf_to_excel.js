// // pages/index.js
// import { useState } from "react";
// import { ArrowDownTrayIcon, Button, Input } from "@heroui/react";

// export default function Home() {
//   const [file, setFile] = useState(null);
//   const [extractedData, setExtractedData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "application/pdf") {
//       setFile(selectedFile);
//       setError(null);
//     } else {
//       setFile(null);
//       setError("Please upload a valid PDF file.");
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return setError("Please upload a file!");
//     setLoading(true);
//     setError(null);
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await fetch("/api/upload1", {
//         method: "POST",
//         body: formData,
//       });
//       if (!response.ok) throw new Error("Failed to extract names");
//       const data = await response.json();
//       console.log(data);
//       setExtractedData(data.extractedData || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       const response = await fetch("/api/generateExcel", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ extractedData }),
//       });

//       if (!response.ok) throw new Error("Failed to generate Excel file");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "names.xlsx";
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <h1 className="text-2xl font-semibold mb-4">PDF Name Extractor</h1>
//       <div className="flex flex-wrap md:flex-nowrap gap-4">
//         <Input 
//             type="file" 
//             onChange={handleFileChange} 
//             accept="application/pdf" 
//         />
//       </div>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
      
//       <Button 
//         onPress={handleUpload} 
//         color="primary" 
//         disabled={loading}
//       >
//         {loading ? "Extracting..." : "Upload & Extract"}
//       </Button>

//       {extractedData.length > 0 && (
//         <div className="mt-6 w-full max-w-2xl bg-white p-4 shadow-md rounded">
//           <h2 className="text-lg font-medium mb-2">Extracted Names</h2>
//           <table className="w-full border-collapse border">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border px-4 py-2">Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {extractedData.map((item, index) => (
//                 <tr key={index}>
//                   <td className="border px-4 py-2">{item.name}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <Button 
//             onPress={handleDownload} 
//             color="primary" 
//             className="mt-4"
//           >
//             <ArrowDownTrayIcon />
//             Download Excel
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
import Head from "next/head";
import OCRProcessor from "../components/OCRProcessor";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>OCR PDF Extractor</title>
      </Head>

      <OCRProcessor />
    </div>
  );
}
// export async function getServerSideProps() {
//   return { props: {} };
// }

// OR if you need static generation
// export async function getStaticProps() {
//   return { props: {} };
// }
