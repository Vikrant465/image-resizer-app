'use client';

import { useState, useRef, useEffect } from 'react';

import { Button, Slider} from "@heroui/react";
export default function Teleprompter() {
  const [script, setScript] = useState('');
  const [speed, setSpeed] = useState(50);
  const [fontSize, setFontSize] = useState(20);
  const [scrolling, setScrolling] = useState(false);
  const textRef = useRef(null);
  
  useEffect(() => {
    let interval;
    if (scrolling) {
      interval = setInterval(() => {
        if (textRef.current) {
          textRef.current.scrollTop += 1;
        }
      }, 110 - speed);
      
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [scrolling, speed]);
  const resetScroll = () => {
    if (textRef.current) {
      textRef.current.scrollTop = 0;
    }
    setScrolling(false);
  };
  const handleSpeedChange = (value) => {
    setSpeed(value[0]);
    console.log(`Speed changed to: ${value[0]}`);
  };
  const increaseSpeed = () => setSpeed((prev) => Math.min(prev + 5, 100));
  const decreaseSpeed = () => setSpeed((prev) => Math.max(prev - 5, 10));

  const handleFontSizeChange = (value) => {
    setFontSize(value[0]);
    console.log(`Font size changed to: ${value[0]}px`);
  };
  const increaseFont = () => setFontSize((prev) => Math.min(prev + 2, 30));
  const decreaseFont = () => setFontSize((prev) => Math.max(prev - 2, 5));

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <textarea
        className="w-full h-40 p-2 border rounded-lg"
        placeholder="Enter your script here..."
        value={script}
        onChange={(e) => setScript(e.target.value)}
      ></textarea>
      
      <div className="flex items-center gap-4">
        <Button onPress={() => setScrolling(!scrolling)}>
          {scrolling ? 'Pause' : 'Start'}
        </Button>
        <Button onPress={resetScroll}>Reset</Button>
        <Button onPress={decreaseSpeed}>-</Button>
        <div className="w-40 ">
          <Slider
            label="speed"
            value={[speed]}
            min={10}
            max={100}
            step={5}
            onValueChange={handleSpeedChange}
          />
        </div>
        <Button onPress={increaseSpeed}>+</Button>
      </div>
      <div className="flex items-center gap-2">
      <Button onPress={decreaseFont}>-</Button>
        <div className="w-40">
          <Slider
            label="Font Size"
            value={[fontSize]}
            min={5}
            max={30}
            step={2}
            onValueChange={handleFontSizeChange}
          />
        </div>
        <Button onPress={increaseFont}>+</Button>
      </div>
      
      <div ref={textRef} className="h-60 overflow-hidden border p-4 text-lg  rounded-lg bg-black text-white"style={{ fontSize: `${fontSize}px` }}>
        {script.split('\n').map((line, index) => (
          <p key={index} className="mb-2">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
