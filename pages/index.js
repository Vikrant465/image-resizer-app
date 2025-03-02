'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-gray-100">
      <Button onPress={() => router.push('/resize_photo')} className="w-48">
        Open Image Resizer
      </Button>
      <Button onPress={() => router.push('/teleprompt')} className="w-48">
        Open Teleprompter
      </Button>
    </div>
  );
}
