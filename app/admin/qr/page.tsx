"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Printer, QrCode, RefreshCw, ExternalLink } from "lucide-react";

export default function QRCodePage() {
  const [menuUrl, setMenuUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load menu URL from settings
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const url = data.menu_url || `${window.location.origin}/menu`;
        setMenuUrl(url);
      })
      .catch(() => {
        setMenuUrl(`${window.location.origin}/menu`);
      });
  }, []);

  const generateQR = async () => {
    if (!menuUrl) return;
    setGenerating(true);
    try {
      // Dynamic import to avoid SSR issues
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(menuUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#2d5a3d",
          light: "#faf8f3",
        },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(dataUrl);
      toast.success("QR code generated");
    } catch {
      toast.error("Failed to generate QR code");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (menuUrl) generateQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = "hkcafe-menu-qr.png";
    link.href = qrDataUrl;
    link.click();
    toast.success("Downloaded as PNG");
  };

  const downloadSVG = async () => {
    if (!menuUrl) return;
    try {
      const QRCode = (await import("qrcode")).default;
      const svgString = await QRCode.toString(menuUrl, {
        type: "svg",
        color: { dark: "#2d5a3d", light: "#faf8f3" },
        errorCorrectionLevel: "H",
        margin: 2,
      });
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "hkcafe-menu-qr.svg";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded as SVG");
    } catch {
      toast.error("Failed to download SVG");
    }
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>HK Cafe — Menu QR Code</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, sans-serif;
              display: flex; align-items: center; justify-content: center;
              min-height: 100vh; background: #faf8f3;
            }
            .container {
              text-align: center; padding: 40px;
              border: 2px solid #c8973a; border-radius: 16px;
              background: white; max-width: 360px;
            }
            .logo { font-size: 48px; margin-bottom: 8px; }
            h1 { font-size: 28px; font-weight: 900; color: #2d5a3d; }
            .tagline { color: #6b5e4e; font-size: 13px; margin: 4px 0 24px; }
            img { width: 280px; height: 280px; }
            .url { font-size: 11px; color: #6b5e4e; margin-top: 16px; word-break: break-all; }
            .scan { color: #c8973a; font-weight: 600; font-size: 14px; margin-top: 12px; }
            @media print {
              body { background: white; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🍵</div>
            <h1>HK Cafe</h1>
            <p class="tagline">Authentic Hong Kong Flavours Since 1979</p>
            <img src="${qrDataUrl}" alt="Menu QR Code" />
            <p class="scan">📱 Scan to view our menu</p>
            <p class="url">${menuUrl}</p>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">QR Code</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Generate a QR code for your public menu
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* QR Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <QrCode className="w-4 h-4 text-accent" />
              QR Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {/* Branded QR card */}
            <div className="w-full max-w-[280px] mx-auto border-2 border-accent/30 rounded-2xl p-5 bg-card text-center shadow-sm">
              <div className="text-3xl mb-1">🍵</div>
              <div className="font-black text-primary text-lg">HK Cafe</div>
              <div className="text-xs text-muted-foreground mb-4">Authentic Hong Kong Flavours</div>

              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Menu QR Code"
                  className="w-full rounded-xl"
                />
              ) : (
                <div className="w-full aspect-square bg-muted rounded-xl flex items-center justify-center">
                  {generating ? (
                    <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : (
                    <QrCode className="w-12 h-12 text-muted-foreground/30" />
                  )}
                </div>
              )}

              <div className="text-xs text-muted-foreground mt-4 font-medium">
                📱 Scan to view menu
              </div>
            </div>

            {/* Download buttons */}
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPNG}
                disabled={!qrDataUrl}
                className="flex-1 gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSVG}
                disabled={!menuUrl}
                className="flex-1 gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                SVG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={!qrDataUrl}
                className="flex-1 gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Menu URL</CardTitle>
              <CardDescription>The URL this QR code will point to</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="menu-url">URL</Label>
                <Input
                  id="menu-url"
                  value={menuUrl}
                  onChange={(e) => setMenuUrl(e.target.value)}
                  placeholder="https://hkcafe.vercel.app/menu"
                />
              </div>
              <Button
                onClick={generateQR}
                disabled={generating || !menuUrl}
                className="w-full gap-1.5"
              >
                {generating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                Regenerate QR Code
              </Button>
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview menu
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>📌 Print and laminate for table placement</p>
              <p>🖼️ Use PNG for digital displays and social media</p>
              <p>🎨 SVG is scalable — ideal for large format print</p>
              <p>🔗 Update the URL if you change your domain</p>
              <p>📐 Minimum print size: 3cm × 3cm</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
