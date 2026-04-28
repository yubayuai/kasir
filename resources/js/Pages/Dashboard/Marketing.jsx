import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    TrendingUp,
    TicketPercent,
    Building2,
    Receipt,
    Tag,
    Activity,
    Banknote,
    LayoutDashboard,
} from 'lucide-react';
import { 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

export default function MarketingDashboard({
    topInsurances,
    activeVouchers,
    totalVouchers,
    totalRevenue,
    revenueTrend = [],
    insuranceDistribution = [],
    recentTransactions,
}) {
    const { auth } = usePage().props;
    const now = new Date();
    const hour = now.getHours();
    const greeting =
        hour < 11
            ? 'Selamat Pagi'
            : hour < 15
              ? 'Selamat Siang'
              : hour < 18
                ? 'Selamat Sore'
                : 'Selamat Malam';

    const formattedDate = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const stats = [
        {
            label: 'Total Pendapatan',
            value: `Rp ${parseInt(totalRevenue || 0).toLocaleString('id-ID')}`,
            icon: Banknote,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            gradientFrom: 'from-emerald-500/10',
        },
        {
            label: 'Voucher Aktif',
            value: `${activeVouchers} / ${totalVouchers}`,
            icon: TicketPercent,
            color: 'text-violet-400',
            bgColor: 'bg-violet-500/10',
            borderColor: 'border-violet-500/20',
            gradientFrom: 'from-violet-500/10',
        },
        {
            label: 'Top Asuransi',
            value: topInsurances.length > 0 ? topInsurances[0].insurance_name : '—',
            icon: Building2,
            color: 'text-sky-400',
            bgColor: 'bg-sky-500/10',
            borderColor: 'border-sky-500/20',
            gradientFrom: 'from-sky-500/10',
        },
    ];

    const COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e'];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Marketing" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Header */}
                    <div className="relative rounded-2xl border border-border bg-linear-to-br from-card via-card to-violet-500/5 p-6 sm:p-8 mb-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <LayoutDashboard className="w-4 h-4 text-violet-400" />
                                    <span className="text-xs font-medium text-violet-400 tracking-wide">
                                        Dashboard Marketing
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                                    {greeting},{' '}
                                    <span className="text-violet-400">
                                        {auth.user.name.split(' ')[0]}
                                    </span>
                                </h1>
                                <p className="mt-1.5 text-sm text-muted-foreground flex items-center gap-2">
                                    <span>{formattedDate}</span>
                                    <span className="text-border">•</span>
                                    <span>{formattedTime} WIB</span>
                                </p>
                            </div>
                            <Link
                                href={route('vouchers.create')}
                                className="inline-flex items-center gap-2 px-5 py-3 bg-violet-500 text-white rounded-xl text-sm font-semibold hover:bg-violet-600 transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <TicketPercent className="w-4 h-4" />
                                Tambah Voucher
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`group relative rounded-xl border ${stat.borderColor} bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden`}
                            >
                                <div
                                    className={`absolute inset-0 bg-linear-to-br ${stat.gradientFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                />
                                <div className="relative flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground tracking-wide">
                                            {stat.label}
                                        </p>
                                        <p className="mt-2 text-2xl font-bold text-foreground">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-2.5 rounded-xl ${stat.bgColor} transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <stat.icon
                                            className={`w-5 h-5 ${stat.color}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Revenue Trend Line Chart */}
                        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-base font-semibold text-foreground">Tren Pendapatan</h2>
                                    <p className="text-xs text-muted-foreground">7 hari terakhir</p>
                                </div>
                                <div className="p-2 rounded-lg bg-emerald-500/10">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                </div>
                            </div>
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueTrend}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp${val/1000}k`} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                            itemStyle={{ color: '#10b981' }}
                                        />
                                        <Area type="monotone" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Insurance Distribution Pie Chart */}
                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-base font-semibold text-foreground">Distribusi Asuransi</h2>
                                    <p className="text-xs text-muted-foreground">Berdasarkan total kunjungan</p>
                                </div>
                                <div className="p-2 rounded-lg bg-violet-500/10">
                                    <Activity className="w-4 h-4 text-violet-400" />
                                </div>
                            </div>
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={insuranceDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {insuranceDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Insurances Detail */}
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-sky-500/10">
                                        <Building2 className="w-4 h-4 text-sky-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-foreground">Rincian Top Asuransi</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {topInsurances.map((ins, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium text-foreground">{ins.insurance_name}</span>
                                            <span className="text-xs text-muted-foreground">{ins.visits} Kunjungan</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-sky-500 transition-all duration-700"
                                                    style={{ width: `${(ins.visits / Math.max(...topInsurances.map(v => v.visits))) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-foreground tabular-nums w-24 text-right">
                                                Rp {parseInt(ins.revenue).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Usage */}
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-violet-500/10">
                                        <Receipt className="w-4 h-4 text-violet-400" />
                                    </div>
                                    <h2 className="text-base font-semibold text-foreground">Aktivitas Terbaru</h2>
                                </div>
                            </div>
                            <div className="divide-y divide-border">
                                {recentTransactions.map((trx) => (
                                    <div key={trx.id} className="p-4 flex items-center justify-between hover:bg-muted/20">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-foreground truncate">{trx.transaction_number}</p>
                                            <p className="text-xs text-muted-foreground truncate">{trx.patient_name} • {trx.voucher?.name || 'No Voucher'}</p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-sm font-bold text-foreground">Rp {parseInt(trx.total).toLocaleString('id-ID')}</p>
                                            <p className="text-[10px] text-muted-foreground">{new Date(trx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
