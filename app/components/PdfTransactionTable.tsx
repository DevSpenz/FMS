'use client';

interface Transaction {
    date: string;
    description: string;
    department: string;
    amount: string;
    status: string;
}

interface PdfTransactionTableProps {
    transactions: Transaction[];
}

export default function PdfTransactionTable({ transactions }: PdfTransactionTableProps) {
    return (
        <div
            className="bg-white p-6"
            style={{
                width: '100%',
                minWidth: '800px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px'
            }}
        >
            {/* Report Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '25px',
                paddingBottom: '15px',
                borderBottom: '2px solid #e5e7eb'
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '8px'
                }}>
                    RECENT TRANSACTIONS REPORT
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    marginBottom: '6px'
                }}>
                    Kenya Community NGO
                </p>
                <p style={{
                    fontSize: '14px',
                    color: '#9ca3af'
                }}>
                    Generated on {new Date().toLocaleDateString()}
                </p>
            </div>

            {/* PDF-optimized table with larger fonts */}
            <table
                className="w-full border-collapse"
                style={{
                    fontSize: '13px',
                    lineHeight: '1.4',
                    width: '100%',
                    tableLayout: 'fixed'
                }}
            >
                <colgroup>
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '40%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '15%' }} />
                </colgroup>
                <thead>
                <tr style={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '2px solid #e5e7eb',
                    borderTop: '2px solid #e5e7eb'
                }}>
                    <th style={{
                        padding: '12px 8px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '12px'
                    }}>
                        Date
                    </th>
                    <th style={{
                        padding: '12px 8px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '12px'
                    }}>
                        Description
                    </th>
                    <th style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '12px'
                    }}>
                        Department
                    </th>
                    <th style={{
                        padding: '12px 8px',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '12px'
                    }}>
                        Amount
                    </th>
                    <th style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '12px'
                    }}>
                        Status
                    </th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction, index) => (
                    <tr
                        key={index}
                        style={{
                            borderBottom: '1px solid #e5e7eb',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                            pageBreakInside: 'avoid'
                        }}
                    >
                        <td style={{
                            padding: '12px 8px',
                            color: '#374151',
                            fontWeight: '500',
                            fontSize: '12px'
                        }}>
                            {transaction.date}
                        </td>
                        <td style={{
                            padding: '12px 8px',
                            color: '#6b7280',
                            fontSize: '12px'
                        }}>
                            {transaction.description}
                        </td>
                        <td style={{
                            padding: '12px 8px',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                display: 'inline-block',
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '600',
                                lineHeight: '1.2'
                            }}>
                                {transaction.department}
                            </div>
                        </td>
                        <td style={{
                            padding: '12px 8px',
                            color: '#059669',
                            fontWeight: '600',
                            fontFamily: 'monospace, Courier New',
                            textAlign: 'right',
                            fontSize: '12px'
                        }}>
                            {transaction.amount}
                        </td>
                        <td style={{
                            padding: '12px 8px',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                display: 'inline-block',
                                backgroundColor: transaction.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                                color: transaction.status === 'Completed' ? '#166534' : '#92400e',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '600',
                                lineHeight: '1.2',
                                minWidth: '80px'
                            }}>
                                {transaction.status}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Summary section for PDF */}
            {transactions.length > 0 && (
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px'
                    }}>
                        <div>
                            <strong style={{ color: '#0369a1', fontSize: '14px' }}>Report Summary</strong>
                            <div style={{ color: '#6b7280', marginTop: '4px', fontSize: '12px' }}>
                                {transactions.length} transactions • Generated on {new Date().toLocaleDateString()}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#374151', fontWeight: '600', fontSize: '13px' }}>
                                Total: <span style={{ color: '#059669', fontFamily: 'monospace, Courier New' }}>
                                    KSh {transactions
                                .reduce((sum, tx) => sum + parseInt(tx.amount.replace(/[^\d]/g, '') || '0'), 0)
                                .toLocaleString()}
                                </span>
                            </div>
                            <div style={{ color: '#6b7280', marginTop: '4px', fontSize: '12px' }}>
                                ✅ {transactions.filter(tx => tx.status === 'Completed').length} Completed •
                                ⏳ {transactions.filter(tx => tx.status === 'Pending').length} Pending
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {transactions.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '50px 20px',
                    color: '#6b7280',
                    fontSize: '16px',
                    fontStyle: 'italic'
                }}>
                    No transactions to display
                </div>
            )}

            {/* Footer note */}
            <div style={{
                marginTop: '20px',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '11px',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '12px'
            }}>
                This report was generated automatically from Kenya Community NGO Fund Management System
            </div>
        </div>
    );
}