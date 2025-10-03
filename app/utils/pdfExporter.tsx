import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define TypeScript interfaces
interface Transaction {
    date: string;
    description: string;
    department: string;
    amount: string;
    status: string;
}

interface TransactionPDFProps {
    transactions: Transaction[];
    title: string;
    reportType?: string;
}

// Create styles - using StyleSheet.create without explicit casting
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 12,
    },
    header: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 5,
        textAlign: 'center',
        color: '#6b7280',
    },
    date: {
        fontSize: 11,
        marginBottom: 20,
        textAlign: 'center',
        color: '#9ca3af',
    },
    // Fixed table styling - remove display property or use flex
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        borderBottomStyle: 'solid',
        minHeight: 30,
    },
    tableHeader: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 8,
        flex: 1,
        fontSize: 10,
        borderRightWidth: 1,
        borderRightColor: '#e5e7eb',
        borderRightStyle: 'solid',
    },
    tableCellHeader: {
        padding: 8,
        flex: 1,
        fontSize: 11,
        fontWeight: 'bold',
        borderRightWidth: 1,
        borderRightColor: '#ffffff',
        borderRightStyle: 'solid',
    },
    amountCell: {
        fontFamily: 'Courier',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    centerCell: {
        textAlign: 'center',
    },
    summary: {
        backgroundColor: '#f0f9ff',
        padding: 15,
        border: '1pt solid #bae6fd',
        borderRadius: 4,
        marginBottom: 20,
    },
    summaryText: {
        fontSize: 11,
        marginBottom: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 9,
        color: '#9ca3af',
        borderTop: '1pt solid #e5e7eb',
        paddingTop: 10,
    },
    badge: {
        padding: '4px 8px',
        borderRadius: 10,
        fontSize: 9,
        fontWeight: 'bold',
    },
    badgeCompleted: {
        backgroundColor: '#dcfce7',
        color: '#166534',
    },
    badgePending: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
    },
    badgeHealth: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
    },
    badgeEducation: {
        backgroundColor: '#f3e8ff',
        color: '#7c3aed',
    },
    badgeSocial: {
        backgroundColor: '#fce7f3',
        color: '#be185d',
    },
    badgeLivelihoods: {
        backgroundColor: '#ecfccb',
        color: '#4d7c0f',
    },
    badgeAdmin: {
        backgroundColor: '#ffe4e6',
        color: '#be123c',
    },
});

// PDF Document Component
const TransactionPDF: React.FC<TransactionPDFProps> = ({
                                                           transactions,
                                                           title,
                                                           reportType = 'Transactions'
                                                       }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <Text style={styles.header}>KENYA COMMUNITY NGO</Text>
            <Text style={styles.subtitle}>{title.toUpperCase()}</Text>
            <Text style={styles.date}>Generated on {new Date().toLocaleDateString()}</Text>

            {/* Table Container */}
            <View style={styles.table}>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCellHeader}>Date</Text>
                    <Text style={styles.tableCellHeader}>Description</Text>
                    <Text style={styles.tableCellHeader}>Department</Text>
                    <Text style={styles.tableCellHeader}>Amount</Text>
                    <Text style={styles.tableCellHeader}>Status</Text>
                </View>

                {/* Table Rows */}
                {transactions.map((transaction, index) => {
                    const badgeStyle = transaction.status === 'Completed'
                        ? styles.badgeCompleted
                        : styles.badgePending;

                    const departmentBadgeStyle =
                        transaction.department === 'Health' ? styles.badgeHealth :
                            transaction.department === 'Education' ? styles.badgeEducation :
                                transaction.department === 'Social Services' ? styles.badgeSocial :
                                    transaction.department === 'Livelihoods' ? styles.badgeLivelihoods :
                                        transaction.department === 'Administration' ? styles.badgeAdmin :
                                            styles.badgeHealth;

                    return (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCell}>{transaction.date}</Text>
                            <Text style={styles.tableCell}>{transaction.description}</Text>
                            <View style={[styles.tableCell, styles.centerCell]}>
                                <Text style={[styles.badge, departmentBadgeStyle]}>
                                    {transaction.department}
                                </Text>
                            </View>
                            <Text style={[styles.tableCell, styles.amountCell]}>
                                {transaction.amount}
                            </Text>
                            <View style={[styles.tableCell, styles.centerCell]}>
                                <Text style={[styles.badge, badgeStyle]}>
                                    {transaction.status}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Summary Section */}
            {transactions.length > 0 && (
                <View style={styles.summary}>
                    <Text style={[styles.summaryText, { fontWeight: 'bold', marginBottom: 8 }]}>
                        REPORT SUMMARY
                    </Text>
                    <Text style={styles.summaryText}>
                        Total Transactions: {transactions.length}
                    </Text>
                    <Text style={styles.summaryText}>
                        Completed: {transactions.filter(tx => tx.status === 'Completed').length} •
                        Pending: {transactions.filter(tx => tx.status === 'Pending').length}
                    </Text>
                    <Text style={styles.summaryText}>
                        Total Amount: KSh {transactions
                        .reduce((sum, tx) => sum + parseInt(tx.amount.replace(/[^\d]/g, '') || '0'), 0)
                        .toLocaleString()}
                    </Text>
                </View>
            )}

            {/* Empty State */}
            {transactions.length === 0 && (
                <View style={{ textAlign: 'center', padding: 40 }}>
                    <Text style={{ color: '#6b7280', fontStyle: 'italic' }}>
                        No transactions to display
                    </Text>
                </View>
            )}

            {/* Footer */}
            <Text style={styles.footer}>
                CONFIDENTIAL - FOR INTERNAL USE ONLY • Generated from Kenya Community NGO Fund Management System
            </Text>
        </Page>
    </Document>
);

// Main export function
export const exportToPDFReact = async (
    transactions: Transaction[],
    filename: string = 'report',
    title: string = 'Report'
): Promise<void> => {
    try {
        // Create PDF blob
        const blob = await pdf(<TransactionPDF transactions={transactions} title={title} />).toBlob();

        // Download the file
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
};

// Export for multiple report types
export const PDFExporter = {
    transactions: (data: Transaction[], title: string = 'Transactions Report'): Promise<void> =>
        exportToPDFReact(data, 'transactions', title),

    cashbook: (data: Transaction[], title: string = 'Cashbook Report'): Promise<void> =>
        exportToPDFReact(data, 'cashbook', title),

    ledger: (data: Transaction[], title: string = 'Ledger Report'): Promise<void> =>
        exportToPDFReact(data, 'ledger', title),

    vouchers: (data: Transaction[], title: string = 'Vouchers Report'): Promise<void> =>
        exportToPDFReact(data, 'vouchers', title),
};