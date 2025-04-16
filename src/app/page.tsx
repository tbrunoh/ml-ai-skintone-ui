"use client"; // This is a client component

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface SkinToneResponse {
  number: number;
  name: string;
  orb: string;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [response, setResponse] = useState<SkinToneResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isCameraOpen && videoRef.current) {
      const constraints = { video: true };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          setError("Error accessing camera: " + err.message);
          setIsCameraOpen(false);
        });
    } else if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [isCameraOpen]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
      setResponse(null); // Clear previous response
      setError(null); // Clear any previous errors
      setIsCameraOpen(false);
      setUploadedImageUrl(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
          setSelectedImage(file);
          setImageUrl(URL.createObjectURL(file));
          setResponse(null); // Clear previous response
          setError(null); // Clear any previous errors
          setIsCameraOpen(false);
          setUploadedImageUrl(null);
        }
      }, "image/jpeg");
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      setError("Please select or capture an image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadedImageUrl(null);

    const formData = new FormData();
    formData.append("image", selectedImage); // Correctly append the file

    try {
      const apiEndpoint = process.env.UPLOAD_API_ENDPOINT || "";
      console.log(`API ENDPOINT: ${apiEndpoint}`);
      const uploadResponse = await fetch(apiEndpoint, {
        method: "POST",
        body: formData, // Send the FormData object
        redirect: "manual",
      });

      if (!uploadResponse.ok) {
        throw new Error(
          `Image upload failed with status ${uploadResponse.status}`
        );
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = `${process.env.IMAGE_URL_PREFIX}/${uploadData.filename}`;
      setUploadedImageUrl(imageUrl);
    } catch (err: any) {
      setError(err.message || "An error occurred during image upload.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImageUrl) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiEndpoint = process.env.API_ENDPOINT;
      const response = await fetch(`${apiEndpoint}/skintone/infer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: uploadedImageUrl }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: SkinToneResponse = await response.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during the API request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Skin Tone Analysis</h1>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button
          className={styles.secondary}
          onClick={() => setIsCameraOpen(!isCameraOpen)}
        >
          {isCameraOpen ? "Close Camera" : "Open Camera"}
        </button>

        {isCameraOpen && (
          <div className={styles.cameraContainer}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={styles.video}
            ></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <button className={styles.secondary} onClick={handleCapture}>
              Capture
            </button>
          </div>
        )}

        {imageUrl && (
          <div className={styles.imagePreview}>
            <Image
              src={imageUrl}
              alt="Selected Image"
              width={300}
              height={300}
            />
          </div>
        )}

        <button
          className={styles.primary}
          onClick={handleUploadImage}
          disabled={isLoading || !selectedImage}
        >
          {isLoading ? "Uploading..." : "Upload Image"}
        </button>

        <button
          className={styles.primary}
          onClick={handleAnalyze}
          disabled={isLoading || !uploadedImageUrl}
        >
          {isLoading ? "Analyzing..." : "Analyze"}
        </button>

        {error && <div className={styles.error}>{error}</div>}

        {response && (
          <div className={styles.response}>
            <h2>Analysis Results:</h2>
            <p>
              <strong>Number:</strong> {response.number}
            </p>
            <p>
              <strong>Name:</strong> {response.name}
            </p>
            <p>
              <strong>Orb:</strong>
            </p>
            <div className={styles.orbImage}>
              <Image
                src={response.orb}
                alt="Orb Image"
                width={300}
                height={300}
              />
            </div>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
        </a>
      </footer>
    </div>
  );
}
