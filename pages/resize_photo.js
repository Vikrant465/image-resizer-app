import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [processedImages, setProcessedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Use Hero UI's useDisclosure hook for modal control
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
      setProcessedImages(data.images); // store processed images from API response
    } else {
      setMessage('There was an error processing the image.');
    }
  };

  // When a card is pressed, open the modal and set the selected image
  const openModal = (img) => {
    setSelectedImage(img);
    onOpen();
  };

  // Modal close handler: clear selected image and update modal state
  const handleModalClose = () => {
    onOpenChange(false);
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
                  // Use dataUrl here, if available. Otherwise, use `img.path`
                  src={img.dataUrl || img.path}
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

      {/* Modal for full-screen image display using Hero UI */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {({ onClose }) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedImage ? `Full View ${selectedImage.size}` : 'Full View'}
              </ModalHeader>
              <ModalBody className="flex justify-center">
                {selectedImage && (
                  <Image
                    alt={`Full view ${selectedImage.size}`}
                    src={selectedImage.dataUrl || selectedImage.path}
                    className="object-contain max-h-[80vh] max-w-full"
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={() => { onClose(); handleModalClose(); }}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
