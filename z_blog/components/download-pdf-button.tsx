"use client";

type Props = {
  children: React.ReactNode;
};

export default function DownloadPdfButton({ children }: Props) {
  async function handleDownloadPdf() {
    const res = await fetch("/api/download-pdf");

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    window.open(data.url, "_blank");
  }

  return (
    <button
      onClick={handleDownloadPdf}
      className="block w-full text-left"
    >
      {children}
    </button>
  );
}