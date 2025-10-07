import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
    },
    header: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 4,
        textAlign: 'center',
        color: '#6b7280',
    },
    date: {
        fontSize: 9,
        marginBottom: 15,
        textAlign: 'center',
        color: '#9ca3af',
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 15,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        borderBottomStyle: 'solid',
        minHeight: 25,
    },
    tableHeader: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 6,
        fontSize: 9,
        borderRightWidth: 1,
        borderRightColor: '#e5e7eb',
        borderRightStyle: 'solid',
    },
    tableCellHeader: {
        padding: 6,
        fontSize: 9,
        fontWeight: 'bold',
        borderRightWidth: 1,
        borderRightColor: '#ffffff',
        borderRightStyle: 'solid',
    },
    rightAlign: {
        textAlign: 'right',
    },
    summary: {
        backgroundColor: '#f0f9ff',
        padding: 12,
        marginTop: 10,
        marginBottom: 15,
    },
    summaryText: {
        fontSize: 10,
        marginBottom: 3,
    },
    footer: {
        position: 'absolute',
        bottom: 25,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#9ca3af',
        borderTop: '1pt solid #e5e7eb',
        paddingTop: 8,
    },
});

interface CashbookEntry {
    date: string;
    voucher_number: string;
    description: string;
    cash_in: string;
    cash_out: string;
    balance: string;
}

interface LedgerEntry {
    date: string;
    voucher: string;
    description: string;
    debit: string;
    credit: string;
}

const CashbookPDF: React.FC<{ entries: CashbookEntry[]; title: string }> = ({ entries, title }) => {
    const totalCashIn = entries.reduce((sum, e) => sum + parseFloat(e.cash_in || '0'), 0);
    const totalCashOut = entries.reduce((sum, e) => sum + parseFloat(e.cash_out || '0'), 0);

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <Text style={styles.header}>KENYA COMMUNITY NGO</Text>
                <Text style={styles.subtitle}>{title}</Text>
                <Text style={styles.date}>Generated on {new Date().toLocaleDateString()}</Text>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Date</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1.2 }]}>Voucher</Text>
                        <Text style={[styles.tableCellHeader, { flex: 3 }]}>Description</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1.5, textAlign: 'right' }]}>Cash In (KSh)</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1.5, textAlign: 'right' }]}>Cash Out (KSh)</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1.5, textAlign: 'right' }]}>Balance (KSh)</Text>
                    </View>

                    {entries.map((entry, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.tableCell, { flex: 1 }]}>{entry.date}</Text>
                            <Text style={[styles.tableCell, { flex: 1.2 }]}>{entry.voucher_number}</Text>
                            <Text style={[styles.tableCell, { flex: 3 }]}>{entry.description}</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }, styles.rightAlign]}>
                                {parseFloat(entry.cash_in) > 0 ? parseFloat(entry.cash_in).toLocaleString() : '-'}
                            </Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }, styles.rightAlign]}>
                                {parseFloat(entry.cash_out) > 0 ? parseFloat(entry.cash_out).toLocaleString() : '-'}
                            </Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }, styles.rightAlign]}>
                                {parseFloat(entry.balance).toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.summary}>
                    <Text style={[styles.summaryText, { fontWeight: 'bold', marginBottom: 6 }]}>
                        CASHBOOK SUMMARY
                    </Text>
                    <Text style={styles.summaryText}>Total Transactions: {entries.length}</Text>
                    <Text style={styles.summaryText}>Total Cash In: KSh {totalCashIn.toLocaleString()}</Text>
                    <Text style={styles.summaryText}>Total Cash Out: KSh {totalCashOut.toLocaleString()}</Text>
                    <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>
                        Net Cash Flow: KSh {(totalCashIn - totalCashOut).toLocaleString()}
                    </Text>
                </View>

                <Text style={styles.footer}>
                    CONFIDENTIAL - FOR INTERNAL USE ONLY • Generated from Kenya Community NGO Fund Management System
                </Text>
            </Page>
        </Document>
    );
};

const LedgerPDF: React.FC<{ entries: LedgerEntry[]; title: string }> = ({ entries, title }) => {
    const totalDebit = entries.reduce((sum, e) => sum + parseFloat(e.debit || '0'), 0);
    const totalCredit = entries.reduce((sum, e) => sum + parseFloat(e.credit || '0'), 0);

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <Text style={styles.header}>KENYA COMMUNITY NGO</Text>
                <Text style={styles.subtitle}>{title}</Text>
                <Text style={styles.date}>Generated on {new Date().toLocaleDateString()}</Text>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Date</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1.2 }]}>Voucher</Text>
                        <Text style={[styles.tableCellHeader, { flex: 3 }]}>Description</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1.5, textAlign: 'right' }]}>Debit (KSh)</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1.5, textAlign: 'right' }]}>Credit (KSh)</Text>
                    </View>

                    {entries.map((entry, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.tableCell, { flex: 1 }]}>{entry.date}</Text>
                            <Text style={[styles.tableCell, { flex: 1.2 }]}>{entry.voucher}</Text>
                            <Text style={[styles.tableCell, { flex: 3 }]}>{entry.description}</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }, styles.rightAlign]}>
                                {parseFloat(entry.debit) > 0 ? parseFloat(entry.debit).toLocaleString() : '-'}
                            </Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }, styles.rightAlign]}>
                                {parseFloat(entry.credit) > 0 ? parseFloat(entry.credit).toLocaleString() : '-'}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.summary}>
                    <Text style={[styles.summaryText, { fontWeight: 'bold', marginBottom: 6 }]}>
                        LEDGER SUMMARY
                    </Text>
                    <Text style={styles.summaryText}>Total Entries: {entries.length}</Text>
                    <Text style={styles.summaryText}>Total Debit: KSh {totalDebit.toLocaleString()}</Text>
                    <Text style={styles.summaryText}>Total Credit: KSh {totalCredit.toLocaleString()}</Text>
                    <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>
                        Difference: KSh {Math.abs(totalDebit - totalCredit).toLocaleString()}
                        {Math.abs(totalDebit - totalCredit) < 0.01 ? ' (Balanced)' : ' (Unbalanced)'}
                    </Text>
                </View>

                <Text style={styles.footer}>
                    CONFIDENTIAL - FOR INTERNAL USE ONLY • Generated from Kenya Community NGO Fund Management System
                </Text>
            </Page>
        </Document>
    );
};

export const exportCashbookToPDF = async (entries: CashbookEntry[], filename: string = 'cashbook'): Promise<void> => {
    try {
        const blob = await pdf(
            <CashbookPDF entries={entries} title="CASHBOOK REPORT" />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating Cashbook PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
};

export const exportLedgerToPDF = async (entries: LedgerEntry[], filename: string = 'general_ledger'): Promise<void> => {
    try {
        const blob = await pdf(
            <LedgerPDF entries={entries} title="GENERAL LEDGER REPORT" />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating Ledger PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
};
