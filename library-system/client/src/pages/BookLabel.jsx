import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { Printer, ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

import { PrintableLabel } from '../components/PrintableLabel';

// Pimaco 6180 Dimensions (approximate CSS pixels for 25.4mm x 101.6mm)
// 1mm = 3.78px
// Height: 96px, Width: 384px (landscapeish for spine) or varied.
// Let's use a standard responsive card for the preview and specific print css.

export default function BookLabel() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [baseUrl, setBaseUrl] = useState('');
    const componentRef = useRef();

    useEffect(() => {
        api.get(`/books/${id}`)
            .then(res => setBook(res.data))
            .catch(err => alert("Erro ao carregar livro"));

        api.get('/settings').then(res => {
            setBaseUrl(res.data.app_base_url);
        });
    }, [id]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Etiqueta-${id}`,
    });

    if (!book) return <div>Carregando...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link to="/books" className="btn btn-outline" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Imprimir Etiqueta</h1>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '3rem' }}>

                {/* Visual Preview */}
                <div style={{ border: '1px dashed #ccc', padding: '1rem' }}>
                    <PrintableLabel ref={componentRef} book={book} baseUrl={baseUrl} />
                </div>

                <button onClick={handlePrint} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Printer size={20} /> Imprimir Etiqueta
                </button>
            </div>
        </div>
    );
}
