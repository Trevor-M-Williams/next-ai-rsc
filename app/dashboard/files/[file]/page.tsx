"use client";
import { useState, useRef, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

export default function File({ params }: { params: { file: string } }) {
  const [pdfUrl, setPdfUrl] = useState("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    getDownloadURL(
      ref(storage, "org_2XGE0bZ9jyAIWjosyPMJm58yylU/" + params.file)
    )
      .then((url) => {
        setPdfUrl(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.file]);

  return (
    <div className="h-full w-full inset-0">
      <iframe
        ref={iframeRef}
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="PDF Viewer"
      ></iframe>
    </div>
  );
}
