import { useEffect, useRef } from 'react';

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
}

export default function LivePreview({ html, css, js }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const document = iframe.contentDocument;
    if (!document) return;

    const content = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch (error) {
            console.error('Script error:', error);
          }
        </script>
      </body>
      </html>
    `;

    document.open();
    document.write(content);
    document.close();
  }, [html, css, js]);

  return (
    <div className="flex-1 bg-gray-100 p-6 overflow-hidden">
      <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-400 text-sm ml-4">Preview</span>
        </div>
        <iframe
          ref={iframeRef}
          title="preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
