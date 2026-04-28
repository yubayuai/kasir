import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Search, TicketPercent, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Index({ vouchers, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('vouchers.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus voucher ini?')) {
            router.delete(route('vouchers.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Voucher" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                Voucher Diskon
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Kelola voucher diskon per asuransi
                            </p>
                        </div>
                        <Link
                            href={route('vouchers.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Voucher
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <form onSubmit={handleSearch} className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari nama voucher atau asuransi..."
                                className="pl-9 py-2.5 w-full rounded-md border border-input bg-card text-foreground text-sm shadow-sm focus:border-primary focus:ring-primary transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-wide">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-wide">
                                            Asuransi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-wide">
                                            Diskon
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-wide">
                                            Periode
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-wide">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 w-24"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {vouchers.data.map((voucher) => (
                                        <tr
                                            key={voucher.id}
                                            className="hover:bg-muted/20 transition-colors"
                                        >
                                            <td className="px-6 py-3.5">
                                                <span className="font-medium text-foreground">
                                                    {voucher.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-muted-foreground">
                                                {voucher.insurance_name}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className="text-foreground">
                                                    {voucher.discount_type === 'percentage'
                                                        ? `${voucher.discount_value}%`
                                                        : `Rp ${parseInt(voucher.discount_value).toLocaleString('id-ID')}`}
                                                </span>
                                                {voucher.discount_type === 'percentage' && voucher.max_discount && (
                                                    <span className="block text-xs text-muted-foreground">
                                                        Maks Rp {parseInt(voucher.max_discount).toLocaleString('id-ID')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5 text-xs text-muted-foreground">
                                                {voucher.valid_from && voucher.valid_until
                                                    ? `${voucher.valid_from} — ${voucher.valid_until}`
                                                    : voucher.valid_from
                                                      ? `Mulai ${voucher.valid_from}`
                                                      : voucher.valid_until
                                                        ? `Sampai ${voucher.valid_until}`
                                                        : 'Tanpa batas'}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        voucher.is_active
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}
                                                >
                                                    {voucher.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={route('vouchers.edit', voucher.id)}
                                                        className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-muted transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(voucher.id)}
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
                            {vouchers.data.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 px-6">
                                    <div className="p-3 rounded-full bg-muted/50 mb-3">
                                        <TicketPercent className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Belum ada voucher
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-1">
                                        Buat voucher diskon pertama untuk asuransi
                                    </p>
                                    <Link
                                        href={route('vouchers.create')}
                                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Buat Voucher Pertama
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {vouchers.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t border-border">
                                <span className="text-xs text-muted-foreground">
                                    {vouchers.from}–{vouchers.to} dari {vouchers.total}
                                </span>
                                <div className="flex items-center gap-1">
                                    {vouchers.prev_page_url ? (
                                        <Link
                                            href={vouchers.prev_page_url}
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                            preserveState
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <span className="p-1.5 text-muted-foreground/30">
                                            <ChevronLeft className="w-4 h-4" />
                                        </span>
                                    )}
                                    <span className="px-2 text-xs text-muted-foreground">
                                        {vouchers.current_page} / {vouchers.last_page}
                                    </span>
                                    {vouchers.next_page_url ? (
                                        <Link
                                            href={vouchers.next_page_url}
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                            preserveState
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <span className="p-1.5 text-muted-foreground/30">
                                            <ChevronRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
