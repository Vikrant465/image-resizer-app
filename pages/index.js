import { useState } from 'react';
import { Button, Input, Card, CardBody, CardFooter, Image } from "@heroui/react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [processedImages, setProcessedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    // Call the Next.js API route to upload and process the image
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Image uploaded and processed successfully!');
      setProcessedImages(data.images); // store processed images paths from API response
    } else {
      setMessage('There was an error processing the image.');
    }
  };

  // When a card is pressed, open the modal and set the selected image
  const openModal = (img) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
      <Card className="w-full max-w-md p-6 mb-8">
        <h3 className="mb-4">Upload and Resize Image</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <Input 
            type="file" 
            onChange={handleFileChange} 
            bordered 
            fullWidth 
            accept="image/*" 
          />
          <Button type="submit" color="primary">
            Upload Image
          </Button>
        </form>
        {message && <div className="mt-4">{message}</div>}
      </Card>
      
      {/* Display processed images in a responsive grid */}
      {processedImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {processedImages.map((img, index) => (
            <Card 
              key={index} 
              isPressable 
              shadow="sm" 
              onPress={() => openModal(img)}
            >
              <CardBody className="overflow-visible p-0">
                <Image
                  alt={`Resized Image ${img.size}`}
                  className="w-full object-cover h-[140px]"
                  radius="lg"
                  shadow="sm"
                  src={img.path}
                  width="100%"
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{img.size}</b>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for full-screen image display */}
      {isModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-full max-h-full p-4"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
          >
            <Image
              alt={`Full view ${selectedImage.size}`}
              src={selectedImage.path}
              // Ensure image displays in its true dimensions or scaled to available space
              className="object-contain"
              width="auto"
              height="auto"
            />
            <Button 
              onPress={closeModal}
              className="absolute top-2 right-2"
              auto
              color="error"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
