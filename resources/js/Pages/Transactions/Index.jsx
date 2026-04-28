import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Eye,
    Edit,
    Trash2,
    Search,
    Receipt,
    Banknote,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    FileText,
    AlertTriangle,
    X,
} from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ transactions, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [selectedIds, setSelectedIds] = useState([]);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [confirmingBulkDeletion, setConfirmingBulkDeletion] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const toggleSelectAll = () => {
        if (selectedIds.length === transactions.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(transactions.data.map((trx) => trx.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        setConfirmingBulkDeletion(true);
    };

    const performBulkDelete = () => {
        router.delete(route('transactions.bulk-destroy'), {
            data: { ids: selectedIds },
            onSuccess: () => {
                setSelectedIds([]);
                setConfirmingBulkDeletion(false);
            },
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('transactions.index'),
            { search, status },
            { preserveState: true }
        );
    };

    const handleDelete = (id) => {
        setDeletingId(id);
        setConfirmingDeletion(true);
    };

    const performDelete = () => {
        router.delete(route('transactions.destroy', deletingId), {
            onSuccess: () => {
                setConfirmingDeletion(false);
                setDeletingId(null);
            },
        });
    };

    const getStatusBadge = (s) => {
        const styles = {
            paid: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
            pending:
                'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        };
        const labels = { paid: 'Lunas', pending: 'Pending' };
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[s] || styles.pending}`}
            >
                {labels[s] || s}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Transaksi" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                Transaksi
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Daftar semua transaksi pasien
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('transactions.create')}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-md text-sm font-medium hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-500/20"
                            >
                                <Banknote className="w-4 h-4" />
                                Tambah Transaksi
                            </Link>
                            <a
                                href={route('transactions.export-pdf', { search, status })}
                                target="_blank"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors shadow-sm"
                            >
                                <FileText className="w-4 h-4 text-violet-400" />
                                Ekspor PDF
                            </a>
                        </div>
                    </div>

                    {/* Bulk Action Button - Elegant */}
                    {selectedIds.length > 0 && (
                        <div className="mb-4 flex justify-end animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={handleBulkDelete}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all shadow-md shadow-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" />
                                Hapus {selectedIds.length} Transaksi
                            </button>
                        </div>
                    )}

                    {/* Search & Filter */}
                    <div className="mb-4 flex flex-col sm:flex-row gap-3">
                        <form
                            onSubmit={handleSearch}
                            className="relative flex-1 max-w-xs"
                        >
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari transaksi..."
                                className="pl-9 pr-4 w-full py-2.5 rounded-md border border-input bg-card text-foreground text-sm shadow-sm focus:border-primary focus:ring-primary transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                        <select
                            className="px-4 rounded-md border border-input bg-card text-foreground text-sm shadow-sm focus:ring-primary focus:border-primary w-full sm:w-48 py-2.5 cursor-pointer transition-all"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                router.get(
                                    route('transactions.index'),
                                    { search, status: e.target.value },
                                    { preserveState: true }
                                );
                            }}
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Lunas</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="px-4 py-3 w-10">
                                            <input
                                                type="checkbox"
                                                className="rounded border-input bg-card text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                                checked={selectedIds.length === transactions.data.length && transactions.data.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-wide">
                                            No. Transaksi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-wide">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-wide">
                                            Pasien
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-wide">
                                            Asuransi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-wide">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground tracking-wide">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 w-24"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {transactions.data.map((trx) => (
                                        <tr
                                            key={trx.id}
                                            className={`hover:bg-muted/20 transition-colors ${selectedIds.includes(trx.id) ? 'bg-primary/5' : ''}`}
                                        >
                                            <td className="px-4 py-3.5">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-input bg-card text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                                    checked={selectedIds.includes(trx.id)}
                                                    onChange={() => toggleSelect(trx.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className="font-medium text-foreground">
                                                    {trx.transaction_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-muted-foreground">
                                                {new Date(
                                                    trx.created_at
                                                ).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <p className="font-medium text-foreground">
                                                    {trx.patient_name}
                                                </p>
                                                {trx.patient_id && (
                                                    <p className="text-xs text-muted-foreground">
                                                        MR: {trx.patient_id}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5 text-muted-foreground">
                                                {trx.insurance_name || 'Umum'}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                {getStatusBadge(trx.status)}
                                            </td>
                                            <td className="px-6 py-3.5 text-right font-medium text-foreground tabular-nums">
                                                Rp{' '}
                                                {parseInt(
                                                    trx.total
                                                ).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={route(
                                                            'transactions.show',
                                                            trx.id
                                                        )}
                                                        className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-muted transition-colors"
                                                        title="Lihat"
                                                    >
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Link>
                                                    {trx.status === 'pending' && (
                                                        <Link
                                                            href={route('transactions.edit', trx.id)}
                                                            className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-muted transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(trx.id)}
                                                        className="p-1.5 text-muted-foreground hover:text-red-400 rounded-md hover:bg-muted transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Empty State */}
                            {transactions.data.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 px-6">
                                    <div className="p-3 rounded-full bg-muted/50 mb-3">
                                        <Receipt className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Belum ada transaksi
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-1">
                                        Buat transaksi baru untuk memulai
                                    </p>
                                    <Link
                                        href={route('transactions.create')}
                                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Buat Transaksi Pertama
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {transactions.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t border-border">
                                <span className="text-xs text-muted-foreground">
                                    {transactions.from}–{transactions.to} dari{' '}
                                    {transactions.total}
                                </span>
                                <div className="flex items-center gap-1">
                                    {transactions.prev_page_url ? (
                                        <Link
                                            href={transactions.prev_page_url}
                                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border"
                                            preserveState
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <span className="p-2 text-muted-foreground/30 border border-border/50 rounded-lg">
                                            <ChevronLeft className="w-4 h-4" />
                                        </span>
                                    )}
                                    <span className="px-3 text-sm font-medium text-muted-foreground bg-muted/30 py-1.5 rounded-lg border border-border">
                                        {transactions.current_page} /{' '}
                                        {transactions.last_page}
                                    </span>
                                    {transactions.next_page_url ? (
                                        <Link
                                            href={transactions.next_page_url}
                                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border"
                                            preserveState
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <span className="p-2 text-muted-foreground/30 border border-border/50 rounded-lg">
                                            <ChevronRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Single Delete Confirmation Modal */}
            <Modal show={confirmingDeletion} onClose={() => setConfirmingDeletion(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Hapus Transaksi</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingDeletion(false)}>
                            Batal
                        </SecondaryButton>
                        <DangerButton onClick={performDelete}>
                            Ya, Hapus
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            {/* Bulk Delete Confirmation Modal */}
            <Modal show={confirmingBulkDeletion} onClose={() => setConfirmingBulkDeletion(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Hapus {selectedIds.length} Transaksi</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Anda akan menghapus <strong>{selectedIds.length}</strong> transaksi sekaligus. Data yang sudah dihapus akan hilang secara permanen.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingBulkDeletion(false)}>
                            Batal
                        </SecondaryButton>
                        <DangerButton onClick={performBulkDelete}>
                            Ya, Hapus Semua
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
