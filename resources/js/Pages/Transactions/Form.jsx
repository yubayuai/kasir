import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Plus, Trash2, Search, X } from 'lucide-react';

export default function TransactionForm({ transaction = null, vouchers = [], insurances: initialInsurances = [], procedures: initialProcedures = [], isEdit = false }) {
    const { data, setData, post, put, processing, errors } = useForm({
        patient_name: transaction?.patient_name || '',
        patient_id: transaction?.patient_id || '',
        insurance_id: transaction?.insurance_id || '',
        insurance_name: transaction?.insurance_name || '',
        voucher_id: transaction?.voucher_id || '',
        items: transaction?.items || [],
    });

    const [insurances, setInsurances] = useState(initialInsurances);
    const [procedures, setProcedures] = useState(initialProcedures);
    const [loadingData, setLoadingData] = useState(initialInsurances.length === 0 || initialProcedures.length === 0);
    
    const [searchProcedure, setSearchProcedure] = useState('');
    const [showProcedureDropdown, setShowProcedureDropdown] = useState(false);
    
    // Live Preview States
    const [preview, setPreview] = useState({
        items: [],
        subtotal: 0,
        total_discount: 0,
        total: 0
    });
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        if (initialInsurances.length > 0 && initialProcedures.length > 0) {
            setLoadingData(false);
            return;
        }

        const fetchData = async () => {
            setLoadingData(true);
            try {
                const [insRes, procRes] = await Promise.all([
                    axios.get('/api/insurances'),
                    axios.get('/api/procedures'),
                ]);
                setInsurances(insRes.data.data);
                setProcedures(procRes.data.data);
            } catch (err) {
                console.error("Failed to fetch data from API, using defaults", err);
                // Fallback handled in states if needed
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [initialInsurances, initialProcedures]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.procedure-search-container')) {
                setShowProcedureDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Effect for Live Preview
    useEffect(() => {
        const calculatePreview = async () => {
            if (data.items.length === 0) {
                setPreview({ items: [], subtotal: 0, total_discount: 0, total: 0 });
                return;
            }

            setIsCalculating(true);
            try {
                const response = await axios.post('/api/transactions/preview', {
                    insurance_id: data.insurance_id,
                    voucher_id: data.voucher_id,
                    items: data.items.map(item => ({
                        procedure_id: item.procedure_id,
                        quantity: item.quantity
                    }))
                });
                setPreview(response.data);
            } catch (err) {
                console.error("Failed to calculate preview", err);
            } finally {
                setIsCalculating(false);
            }
        };

        const timeoutId = setTimeout(calculatePreview, 50); // Reduced debounce for "instant" feel
        return () => clearTimeout(timeoutId);
    }, [data.items, data.insurance_id, data.voucher_id]);

    const filteredProcedures = procedures.filter(p => 
        p.name.toLowerCase().includes(searchProcedure.toLowerCase())
    ).slice(0, 100);

    const displayProcedures = searchProcedure ? filteredProcedures : procedures.slice(0, 20);

    const submit = (e) => {
        e.preventDefault();
        if (data.items.length === 0) {
            alert('Pilih setidaknya satu tindakan medis.');
            return;
        }

        if (isEdit) {
            put(route('transactions.update', transaction.id));
        } else {
            post(route('transactions.store'));
        }
    };

    const handleInsuranceChange = (e) => {
        const insId = e.target.value;
        const insName = insurances.find(i => i.id === insId)?.name || '';
        setData(prev => ({ ...prev, insurance_id: insId, insurance_name: insName }));
    };

    const handleVoucherChange = (e) => {
        const vId = e.target.value;
        const voucher = vouchers.find(v => v.id === vId);
        
        if (voucher && voucher.insurance_id) {
            setData(prev => ({ 
                ...prev, 
                voucher_id: vId,
                insurance_id: voucher.insurance_id,
                insurance_name: voucher.insurance_name
            }));
        } else {
            setData('voucher_id', vId);
        }
    };

    const addProcedure = async (proc) => {
        const existingItemIndex = data.items.findIndex(item => item.procedure_id === proc.id);
        
        if (existingItemIndex >= 0) {
            const newItems = [...data.items];
            newItems[existingItemIndex].quantity += 1;
            setData('items', newItems);
        } else {
            setData('items', [
                ...data.items, 
                {
                    procedure_id: proc.id,
                    procedure_name: proc.name,
                    quantity: 1,
                }
            ]);
        }
        
        setSearchProcedure('');
        setShowProcedureDropdown(false);
    };

    const updateItemQuantity = (index, delta) => {
        const newItems = [...data.items];
        const newQuantity = newItems[index].quantity + delta;
        if (newQuantity > 0) {
            newItems[index].quantity = newQuantity;
            setData('items', newItems);
        }
    };

    const removeItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">{isEdit ? 'Edit' : 'Tambah'} Transaksi</h2>}
        >
            <Head title={`${isEdit ? 'Edit' : 'Tambah'} Transaksi`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column - Patient Info & Settings */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-card shadow-sm rounded-xl border border-border p-6">
                                <h3 className="text-lg font-medium text-foreground mb-4">Informasi Pasien</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Nama Pasien</label>
                                        <input
                                            type="text"
                                            className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm transition-all"
                                            value={data.patient_name}
                                            onChange={e => setData('patient_name', e.target.value)}
                                            required
                                        />
                                        {errors.patient_name && <p className="mt-1 text-sm text-destructive">{errors.patient_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">ID Pasien (No. RM) - Opsional</label>
                                        <input
                                            type="text"
                                            className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm transition-all"
                                            value={data.patient_id}
                                            onChange={e => setData('patient_id', e.target.value)}
                                        />
                                        {errors.patient_id && <p className="mt-1 text-sm text-destructive">{errors.patient_id}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card shadow-sm rounded-xl border border-border p-6">
                                <h3 className="text-lg font-medium text-foreground mb-4">Detail Tagihan</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Jenis Asuransi</label>
                                        <select
                                            className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm transition-all"
                                            value={data.insurance_id}
                                            onChange={handleInsuranceChange}
                                        >
                                            <option value="">UMUM</option>
                                            {loadingData && <option value="" disabled>Memuat...</option>}
                                            {insurances.map(ins => (
                                                <option key={ins.id} value={ins.id}>{ins.name}</option>
                                            ))}
                                        </select>
                                        {errors.insurance_id && <p className="mt-1 text-sm text-destructive">{errors.insurance_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Voucher Diskon</label>
                                        <select
                                            className="px-3 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm transition-all"
                                            value={data.voucher_id}
                                            onChange={handleVoucherChange}
                                        >
                                            <option value="">Tidak ada Voucher</option>
                                            {vouchers.map(v => (
                                                <option key={v.id} value={v.id}>{v.name} ({v.insurance_name})</option>
                                            ))}
                                        </select>
                                        {errors.voucher_id && <p className="mt-1 text-sm text-destructive">{errors.voucher_id}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-violet-500/5 shadow-sm rounded-xl border border-violet-500/20 p-6">
                                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center justify-between">
                                    <span>Ringkasan Langsung</span>
                                    {isCalculating && <Loader2 className="w-4 h-4 animate-spin text-violet-400" />}
                                </h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className={`font-medium ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>Rp {preview.subtotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Total Diskon</span>
                                        <span className={`font-medium text-rose-400 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>- Rp {preview.total_discount.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="pt-3 border-t border-border flex justify-between">
                                        <span className="font-semibold">Total Keseluruhan</span>
                                        <span className={`font-bold text-violet-400 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>Rp {preview.total.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Procedures */}
                        <div className="lg:col-span-2">
                            <div className="bg-card shadow-sm rounded-xl border border-border p-6 h-full flex flex-col">
                                <h3 className="text-lg font-medium text-foreground mb-4">Tindakan Medis</h3>
                                
                                {/* Search Procedure */}
                                <div className="relative mb-6 procedure-search-container">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Cari dan tambahkan tindakan..."
                                            className="pl-9 py-2.5 w-full rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm transition-all"
                                            value={searchProcedure}
                                            onChange={e => {
                                                setSearchProcedure(e.target.value);
                                                setShowProcedureDropdown(true);
                                            }}
                                            onFocus={() => setShowProcedureDropdown(true)}
                                        />
                                        {searchProcedure && (
                                            <button 
                                                type="button" 
                                                onClick={() => { setSearchProcedure(''); setShowProcedureDropdown(false); }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                            >
                                                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Dropdown */}
                                    {showProcedureDropdown && (
                                        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                            {loadingData ? (
                                                <div className="p-4 text-center text-sm text-muted-foreground flex justify-center items-center">
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memuat...
                                                </div>
                                            ) : displayProcedures.length > 0 ? (
                                                <div className="py-1">
                                                    {!searchProcedure && (
                                                        <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground tracking-wide bg-muted/50">
                                                            Layanan Tersedia
                                                        </div>
                                                    )}
                                                    {displayProcedures.map(proc => (
                                                        <button
                                                            key={proc.id}
                                                            type="button"
                                                            onClick={() => addProcedure(proc)}
                                                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex justify-between items-center transition-colors"
                                                        >
                                                            <span className="font-medium">{proc.name}</span>
                                                            <div className="p-1 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground">Tidak ada tindakan ditemukan.</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Selected Items */}
                                <div className="flex-1 overflow-y-auto border border-border rounded-md bg-muted/20">
                                    {data.items.length > 0 ? (
                                        <ul className="divide-y divide-border">
                                            {data.items.map((item, index) => {
                                                const itemPreview = preview.items.find(pi => pi.procedure_id === item.procedure_id);
                                                return (
                                                    <li key={index} className="p-4 flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-foreground">{item.procedure_name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs text-muted-foreground">
                                                                    Rp {(itemPreview?.price || 0).toLocaleString('id-ID')}
                                                                </span>
                                                                {itemPreview?.discount_amount > 0 && (
                                                                    <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded">
                                                                        -Rp {(itemPreview.discount_amount).toLocaleString('id-ID')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right mr-2">
                                                                <p className="text-sm font-semibold text-foreground">
                                                                    Rp {(itemPreview?.subtotal || 0).toLocaleString('id-ID')}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center border border-border rounded-md">
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => updateItemQuantity(index, -1)}
                                                                    className="px-2 py-1 text-muted-foreground hover:bg-muted rounded-l-md"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => updateItemQuantity(index, 1)}
                                                                    className="px-2 py-1 text-muted-foreground hover:bg-muted rounded-r-md"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeItem(index)}
                                                                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                                            <Search className="w-8 h-8 mb-2 opacity-50" />
                                            <p>Cari dan tambahkan tindakan dari kotak pencarian di atas.</p>
                                        </div>
                                    )}
                                </div>
                                {errors.items && <p className="mt-2 text-sm text-destructive">{errors.items}</p>}

                                <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-border">
                                    <Link
                                        href={route('transactions.index')}
                                        className="px-4 py-2.5 bg-transparent border border-border rounded-lg font-medium text-sm text-foreground tracking-wide hover:bg-muted transition"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || data.items.length === 0 || isCalculating}
                                        className="inline-flex items-center justify-center px-4 py-2.5 bg-primary border border-transparent rounded-lg font-medium text-sm text-primary-foreground tracking-wide hover:bg-primary/90 transition disabled:opacity-50"
                                    >
                                        {(processing || isCalculating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        {isEdit ? 'Perbarui' : 'Buat'} Transaksi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
