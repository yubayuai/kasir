import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Printer, CheckCircle, ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ transaction }) {
    const { post, processing } = useForm();

    const [confirmingPayment, setConfirmingPayment] = useState(false);

    const handlePayment = () => {
        setConfirmingPayment(true);
    };

    const confirmPayment = () => {
        post(route('transactions.pay', transaction.id), {
            onSuccess: () => {
                setConfirmingPayment(false);
                toast.success('Pembayaran berhasil diproses!', {
                    duration: 4000,
                    style: {
                        borderRadius: '12px',
                        background: '#181b21',
                        color: '#f8fafc',
                        border: '1px solid #272a33',
                        padding: '16px 20px',
                        fontSize: '14.5px',
                        fontWeight: '500',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px -5px rgba(16, 185, 129, 0.15)',
                    },
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                    },
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('transactions.index')} className="text-muted-foreground hover:text-foreground transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-foreground leading-tight">
                            Transaksi #{transaction.transaction_number}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                            transaction.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                            {transaction.status === 'paid' && <CheckCircle className="w-4 h-4" />}
                            {transaction.status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                        </span>
                        
                        {transaction.status === 'pending' && (
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2.5 bg-emerald-500 border border-transparent rounded-lg font-medium text-sm text-white tracking-wide hover:bg-emerald-600 focus:bg-emerald-600 active:bg-emerald-700 transition ease-in-out duration-150 disabled:opacity-50"
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Bayar Sekarang
                            </button>
                        )}

                        {transaction.status === 'paid' && (
                            <a
                                href={route('transactions.receipt', transaction.id)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center px-4 py-2.5 bg-primary border border-transparent rounded-lg font-medium text-sm text-primary-foreground tracking-wide hover:bg-primary/90 transition ease-in-out duration-150"
                            >
                                <Printer className="w-4 h-4 mr-2" /> Cetak Kwitansi
                            </a>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Transaksi ${transaction.transaction_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card shadow-sm rounded-xl border border-border overflow-hidden">
                        
                        {/* Info Header */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-border bg-muted/10">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Info Pasien</p>
                                <p className="font-semibold text-foreground text-lg">{transaction.patient_name}</p>
                                {transaction.patient_id && <p className="text-sm text-muted-foreground">ID: {transaction.patient_id}</p>}
                            </div>
                            <div className="md:text-right">
                                <p className="text-sm text-muted-foreground mb-1">Info Tagihan</p>
                                <p className="font-medium text-foreground">Asuransi: {transaction.insurance_name || 'Umum'}</p>
                                {transaction.voucher && (
                                    <p className="text-sm text-primary mt-1">
                                        Voucher: {transaction.voucher.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-foreground mb-4">Daftar Tindakan</h3>
                            
                            <div className="overflow-x-auto border border-border rounded-lg mb-6">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground bg-muted/50 border-b border-border">
                                        <tr>
                                            <th className="px-6 py-3">Tindakan</th>
                                            <th className="px-6 py-3 text-right">Harga</th>
                                            <th className="px-6 py-3 text-center">Jml</th>
                                            <th className="px-6 py-3 text-right">Diskon</th>
                                            <th className="px-6 py-3 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {transaction.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-muted/30">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-foreground">{item.procedure_name}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    Rp {parseInt(item.price).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 text-right text-destructive whitespace-nowrap">
                                                    {item.discount_amount > 0 ? `- Rp ${parseInt(item.discount_amount * item.quantity).toLocaleString('id-ID')}` : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium whitespace-nowrap">
                                                    Rp {parseInt(item.subtotal).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-t border-border pt-6">
                                <div className="text-sm text-muted-foreground mb-4 md:mb-0">
                                    <p>Kasir: {transaction.user?.name}</p>
                                    <p>Dibuat: {new Date(transaction.created_at).toLocaleString('id-ID')}</p>
                                    {transaction.paid_at && <p>Dibayar: {new Date(transaction.paid_at).toLocaleString('id-ID')}</p>}
                                </div>
                                <div className="w-full md:w-64 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium text-foreground">Rp {parseInt(transaction.subtotal).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-destructive">
                                        <span>Total Diskon</span>
                                        <span>- Rp {parseInt(transaction.discount_amount).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
                                        <span className="text-foreground">Total</span>
                                        <span className="text-primary">Rp {parseInt(transaction.total).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Modal show={confirmingPayment} onClose={() => setConfirmingPayment(false)} maxWidth="md">
                <div className="p-8 bg-card text-foreground">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Konfirmasi Pembayaran</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Pastikan nominal pembayaran sudah sesuai.
                            </p>
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-5 mb-8 border border-border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Total Tagihan</span>
                            <span className="text-lg font-bold text-primary">
                                Rp {parseInt(transaction.total).toLocaleString('id-ID')}
                            </span>
                        </div>
                        <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                            Status: <span className="text-orange-500 font-medium">Belum Bayar</span>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-8 text-center bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                        Apakah Anda yakin ingin memproses pembayaran untuk transaksi ini? Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingPayment(false)} className="px-6">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={confirmPayment}
                            disabled={processing}
                            className="bg-emerald-500 hover:bg-emerald-600 px-6"
                        >
                            {processing ? 'Memproses...' : 'Ya, Bayar Sekarang'}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
