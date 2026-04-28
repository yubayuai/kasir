import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function VoucherForm({ voucher, isEdit = false }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: voucher?.name || '',
        insurance_id: voucher?.insurance_id || '',
        insurance_name: voucher?.insurance_name || '',
        discount_type: voucher?.discount_type || 'percentage',
        discount_value: voucher?.discount_value || '',
        max_discount: voucher?.max_discount || '',
        valid_from: voucher?.valid_from || '',
        valid_until: voucher?.valid_until || '',
        is_active: voucher?.is_active ?? true,
    });

    const [insurances, setInsurances] = useState([]);
    const [loadingInsurances, setLoadingInsurances] = useState(false);

    useEffect(() => {
        setLoadingInsurances(true);
        axios.get('/api/insurances')
            .then(res => {
                setInsurances(res.data.data);
            })
            .catch(err => console.error("Failed to load insurances", err))
            .finally(() => setLoadingInsurances(false));
    }, []);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('vouchers.update', voucher.id));
        } else {
            post(route('vouchers.store'));
        }
    };

    const handleInsuranceChange = (e) => {
        const insId = e.target.value;
        const insName = insurances.find(i => i.id === insId)?.name || '';
        setData(prev => ({ ...prev, insurance_id: insId, insurance_name: insName }));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">{isEdit ? 'Edit' : 'Tambah'} Voucher</h2>}
        >
            <Head title={`${isEdit ? 'Edit' : 'Tambah'} Voucher`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card shadow-sm rounded-xl border border-border overflow-hidden">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Nama Voucher</label>
                                <input
                                    type="text"
                                    className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. Diskon 5% Reliance Jan 2026"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Target Asuransi</label>
                                <select
                                    className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                    value={data.insurance_id}
                                    onChange={handleInsuranceChange}
                                    required
                                >
                                    <option value="" disabled>Pilih Asuransi</option>
                                    {loadingInsurances && <option value="" disabled>Loading...</option>}
                                    {insurances.map(ins => (
                                        <option key={ins.id} value={ins.id}>{ins.name}</option>
                                    ))}
                                </select>
                                {errors.insurance_id && <p className="mt-1 text-sm text-destructive">{errors.insurance_id}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Tipe Diskon</label>
                                    <select
                                        className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        value={data.discount_type}
                                        onChange={e => setData('discount_type', e.target.value)}
                                        required
                                    >
                                        <option value="percentage">Persentase (%)</option>
                                        <option value="fixed">Nominal Tetap (Rp)</option>
                                    </select>
                                    {errors.discount_type && <p className="mt-1 text-sm text-destructive">{errors.discount_type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Nilai Diskon {data.discount_type === 'percentage' ? '(%)' : '(Rp)'}
                                    </label>
                                    <input
                                        type="number"
                                        className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        value={data.discount_value}
                                        onChange={e => setData('discount_value', e.target.value)}
                                        min="0"
                                        step={data.discount_type === 'percentage' ? '0.1' : '1000'}
                                        required
                                    />
                                    {errors.discount_value && <p className="mt-1 text-sm text-destructive">{errors.discount_value}</p>}
                                </div>
                            </div>

                            {data.discount_type === 'percentage' && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Batas Maksimal Diskon (Rp) - Opsional</label>
                                    <input
                                        type="number"
                                        className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        value={data.max_discount}
                                        onChange={e => setData('max_discount', e.target.value)}
                                        min="0"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">Kosongkan jika tidak ada batas</p>
                                    {errors.max_discount && <p className="mt-1 text-sm text-destructive">{errors.max_discount}</p>}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Berlaku Mulai (Opsional)</label>
                                    <input
                                        type="date"
                                        className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        value={data.valid_from}
                                        onChange={e => setData('valid_from', e.target.value)}
                                    />
                                    {errors.valid_from && <p className="mt-1 text-sm text-destructive">{errors.valid_from}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Berlaku Sampai (Opsional)</label>
                                    <input
                                        type="date"
                                        className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        value={data.valid_until}
                                        onChange={e => setData('valid_until', e.target.value)}
                                    />
                                    {errors.valid_until && <p className="mt-1 text-sm text-destructive">{errors.valid_until}</p>}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="rounded border-input text-primary focus:ring-primary mr-2"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-foreground">Aktif</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2.5 bg-transparent border border-border rounded-lg font-medium text-sm text-foreground tracking-wide hover:bg-muted transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center px-4 py-2.5 bg-primary border border-transparent rounded-lg font-medium text-sm text-primary-foreground tracking-wide hover:bg-primary/90 transition disabled:opacity-50"
                                >
                                    {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {isEdit ? 'Perbarui' : 'Buat'} Voucher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
