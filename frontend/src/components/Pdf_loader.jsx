import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Upload, ChevronLeft, ChevronRight , ZoomIn , ZoomOut } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

export const Pdf_loader = ({file}) => {
    const pdfFile = file;
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [zoomNumber, setZoomNumber] = useState(1);
    const onDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages);
    };
  
    const changePage = (offset) => {
      setPageNumber(prevPageNumber => {
        const newPageNumber = prevPageNumber + offset;
        return Math.min(Math.max(1, newPageNumber), numPages);
      });
    };

    const pageZoom = (value) => {
      const currentZoom = zoomNumber + value
      setZoomNumber(currentZoom)
    }

    if(pdfFile==null) {
      return <>
        <div className="d-flex flex-column align-items-center justify-content-center bg-white h-100">
          choose the pdf file to render here
        </div>
      </>
    }

    return (
      <div className="container">
          {pdfFile && (
              <div className="d-flex flex-column align-items-center">
                <div className={`w-100 h-100 overflow-auto p-4 d-flex ${zoomNumber == 1 ? "justify-content-center" : ''}`}>
                  <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess} className="d-flex">
                    <Page pageNumber={pageNumber} scale={zoomNumber} renderTextLayer renderAnnotationLayer className="shadow"/>
                  </Document>
                </div>
                <div className="d-flex align-items-center gap-3 p-2 mt-2 bg-white rounded">
                  <button onClick={() => changePage(-1)} disabled={pageNumber <= 1} className="btn btn-outline-secondary btn-sm">
                    <ChevronLeft size={20} />
                  </button>

                  <p className="mb-0 text-muted">Page {pageNumber} of {numPages}</p>
                  <button onClick={() => pageZoom(0.5)} disabled={zoomNumber == 2}  className="btn btn-outline-secondary btn-sm">
                    <ZoomIn size={20}/>
                  </button>
                  <button onClick={() => pageZoom(-0.5)}  disabled={zoomNumber == 1} className="btn btn-outline-secondary btn-sm">
                    <ZoomOut size={20}/>
                  </button>
                  <button onClick={() => changePage(1)} disabled={pageNumber >= numPages} className="btn btn-outline-secondary btn-sm">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
      </div>
    )
}
