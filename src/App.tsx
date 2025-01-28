import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, Share2, Sparkles, RefreshCcw, Terminal, Code2 } from 'lucide-react';

const MEME_TEMPLATES = [
 "When the code works on first try \nbut you don't know why",
  "Me debugging my own code from \n*6 months ago*",
  "POV: You forgot a semicolon \nand spent 2 hours debugging",
  "When someone asks if you \ntested the code before deploying",
  "My code when my professor walks by \nvs. my code normally",
  "When the junior fixes the bug \nyou've been stuck on for days",
  "When Ctrl+Z doesn't undo my life choices.",
  "404: Motivation not found",
  "My brain after 10 hours of debugging",
  "When my career plan \nfeels like a 404 error",
  "When you find out your bug is actually \na *feature*",
  "Me: *fixes one bug*\nCode: *50 new bugs appear*",
  "When you write perfect code \nbut forgot to save the file",
  "My code doesn't work, I have no idea why.\nMy code works, I have no idea why.",
  "When you finally fix the bug \nbut don't remember how",
  "Me pretending to understand the legacy code",
  "When you realize you've been \ndebugging the wrong file for an *hour*",
  "Me: I'll comment my code later\n*2 years later*",
  "When someone touches your perfectly balanced CSS:\n*Everything breaks*",
  "The bug in production:\n'You can't find me'\nMe with console.log: 'Oh yes I can'",
  "When you find a workaround \nthat shouldn't work but it does",
  "The code: *breaks in production*\nMe: But it worked on my machine!",
  "When I asked for help; \nbut they sent me a documentation",
  "When you fix a bug \nby removing your previous fix",
  "The project deadline: *approaches*\nMe: Time to write 'temporary' solutions",
  "When you see your old code and \nactually understand it:*Impossible*",
  "My code comments:\n// I have no idea why this works\n// DO NOT TOUCH!",
  "When you spend hours debugging, \nand it's just a missing bracket",
  "When you deploy on Friday \nand regret it instantly",
  "That moment when your code runs \nbut gives completely unexpected output",
  "When you Google an error,\nand the only result is your question",
  "Debugging be like: 'I have no idea what I am doing, \nbut it's working'"
];

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedMeme, setGeneratedMeme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedImage]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const generateMeme = async () => {
    setIsLoading(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    const randomTemplate = MEME_TEMPLATES[Math.floor(Math.random() * MEME_TEMPLATES.length)];
    setGeneratedMeme(randomTemplate);
    setIsLoading(false);
  };

  const handleShare = async () => {
    if (capturedImage && generatedMeme) {
      try {
        const memeImage = await createMemeImage();
        await navigator.share({
          title: 'Tech Meme',
          text: generatedMeme,
          url: memeImage
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const createMemeImage = async (): Promise<string> => {
    return new Promise((resolve) => {
      if (downloadCanvasRef.current && capturedImage && generatedMeme) {
        const img = new Image();
        img.onload = () => {
          const canvas = downloadCanvasRef.current!;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
  
          // Draw the image
          ctx.drawImage(img, 0, 0);
  
          // Configure text style
          ctx.fillStyle = 'white';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 4;
          ctx.textAlign = 'center';
          ctx.font = `bold ${Math.floor(canvas.width / 20)}px Arial`;
  
          // Split text into lines
          const lines = generatedMeme.split('\n');
          const lineHeight = Math.floor(canvas.width / 15);
          const startY = 40; // Start from the top
  
          // Draw each line of text at the top
          lines.forEach((line, index) => {
            const y = startY + index * lineHeight; // Increment y for each line
            ctx.strokeText(line, canvas.width / 2, y);
            ctx.fillText(line, canvas.width / 2, y);
          });
  
          resolve(canvas.toDataURL('image/jpeg'));
        };
        img.src = capturedImage;
      }
    });
  };
  
  

  const handleDownload = async () => {
    if (capturedImage && generatedMeme) {
      const memeImage = await createMemeImage();
      const link = document.createElement('a');
      link.href = memeImage;
      link.download = 'tech-meme.jpg';
      link.click();
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setGeneratedMeme(null);
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#64ffda] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Terminal className="w-8 h-8" />
            <h1 className="text-4xl font-mono font-bold">Tech Meme Generator</h1>
            <Code2 className="w-8 h-8" />
          </div>
          <p className="text-[#8892b0] font-mono">
            $ sudo generate-meme --type=tech --mode=funny
          </p>
        </header>

        <div className="bg-[#112240] rounded-xl p-6 shadow-2xl border border-[#233554]">
          <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full rounded-lg"
                />
                {generatedMeme && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}>
                        {generatedMeme}
                      </h2>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
          <canvas ref={downloadCanvasRef} className="hidden" />

          <div className="flex flex-wrap gap-4 justify-center">
            {!capturedImage ? (
              <button
                onClick={captureImage}
                className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] hover:bg-[#64ffda]/90 px-6 py-3 rounded-lg font-mono font-semibold transition-colors"
              >
                <Camera className="w-5 h-5" />
                capture_image()
              </button>
            ) : (
              <>
                <button
                  onClick={generateMeme}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] hover:bg-[#64ffda]/90 px-6 py-3 rounded-lg font-mono font-semibold transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" />
                  {isLoading ? 'processing...' : 'generate_meme()'}
                </button>
                
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 border border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10 px-6 py-3 rounded-lg font-mono font-semibold transition-colors"
                >
                  <Download className="w-5 h-5" />
                  download_meme()
                </button>
                <button
                  onClick={resetCapture}
                  className="flex items-center gap-2 bg-[#233554] hover:bg-[#233554]/80 px-6 py-3 rounded-lg font-mono font-semibold transition-colors"
                >
                  <RefreshCcw className="w-5 h-5" />
                  reset()
                </button>
              </>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default App;