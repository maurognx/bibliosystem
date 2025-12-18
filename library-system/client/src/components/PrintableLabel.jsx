import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export const PrintableLabel = React.forwardRef(({ book, baseUrl }, ref) => {
    if (!book) return null;

    // URL that the QR Code will point to (use configured base or fallback to current origin)
    const origin = baseUrl || window.location.origin;
    const publicUrl = `${origin}/public/books/${book.id}`;

    return (
        <div ref={ref} className="printable-label-container">
            <div className="printable-label">
                <div style={{ flexShrink: 0 }}>
                    <QRCodeSVG value={publicUrl} size={70} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, overflow: 'hidden' }}>
                    <h3 style={{ margin: 0, fontSize: '12pt', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {book.title}
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '10pt', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {book.author}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '8pt', color: '#000' }}>
                            <b>ID:</b> {book.id}
                        </span>
                        <span style={{ fontSize: '8pt', color: '#000' }}>
                            <b>Aq:</b> {book.acquisition_date ? (() => {
                                const parts = book.acquisition_date.split('-');
                                return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : book.acquisition_date;
                            })() : '-'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});
