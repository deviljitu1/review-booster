import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

export const QRCard = ({ url, businessName }) => {
  const handleDownload = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${businessName || 'business'}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border-white/20 shadow-xl">
      <CardContent className="p-8 flex flex-col items-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <QRCodeSVG 
            id="qr-code"
            value={url} 
            size={200} 
            level="H"
            fgColor="#673de6"
          />
        </div>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Customers scan this to leave a review.
        </p>
        <div className="flex gap-3 w-full">
          <Button variant="outline" className="w-full" onClick={() => window.open(url, '_blank')}>
            Preview
          </Button>
          <Button className="w-full" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
