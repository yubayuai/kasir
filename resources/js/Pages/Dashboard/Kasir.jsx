import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    Receipt,
    Clock,
    Plus,
    TrendingUp,
    FileText,
    AlertCircle,
    Activity,
    Banknote,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function KasirDashboard({
    todayTransactions,
    pendingTransactions,
    todayRevenue,
    revenueTrend = [],
    recentTransactions,
}) {
    const { auth } = usePage().props;
    const now = new Date();
    const hour = now.getHours();
    const greeting =
        hour < 11
            ? "Selamat Pagi"
            : hour < 15
              ? "Selamat Siang"
              : hour < 18
                ? "Selamat Sore"
                : "Selamat Malam";

    const formattedDate = now.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedTime = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const stats = [
        {
            label: "Transaksi Hari Ini",
            value: todayTransactions,
            icon: Receipt,
            color: "text-sky-400",
            bgColor: "bg-sky-500/10",
            borderColor: "border-sky-500/20",
            gradientFrom: "from-sky-500/10",
            gradientTo: "to-transparent",
        },
        {
            label: "Menunggu Pembayaran",
            value: pendingTransactions,
            icon: Clock,
            color: "text-amber-400",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/20",
            gradientFrom: "from-amber-500/10",
            gradientTo: "to-transparent",
        },
        {
            label: "Pendapatan Hari Ini",
            value: `Rp ${parseInt(todayRevenue || 0).toLocaleString("id-ID")}`,
            icon: Banknote,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/20",
            gradientFrom: "from-emerald-500/10",
            gradientTo: "to-transparent",
        },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
            pending:
                "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        };
        const labels = { paid: "Lunas", pending: "Pending" };
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}
            >
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Kasir" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Header */}
                    <div className="relative rounded-2xl border border-border bg-linear-to-br from-card via-card to-primary/5 p-6 sm:p-8 mb-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Activity className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-medium text-primary tracking-wide">
                                        Dashboard Kasir
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                                    {greeting},{" "}
                                    <span className="text-primary">
                                        {auth.user.name.split(" ")[0]}
                                    </span>
                                </h1>
                                <p className="mt-1.5 text-sm text-muted-foreground flex items-center gap-2">
                                    <span>{formattedDate}</span>
                                    <span className="text-border">•</span>
                                    <span>{formattedTime} WIB</span>
                                </p>
                            </div>
                            <Link
                                href={route("transactions.create")}
                                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20"
                            >
                                <Banknote className="w-4 h-4" />
                                Tambah Transaksi
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`group relative rounded-2xl border ${stat.borderColor} bg-card/40 backdrop-blur-md p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden`}
                            >
                                <div
                                    className={`absolute inset-0 bg-linear-to-br ${stat.gradientFrom} ${stat.gradientTo} opacity-10 group-hover:opacity-30 transition-opacity duration-500`}
                                />
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />

                                <div className="relative flex items-start justify-between z-10">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-extrabold text-foreground tracking-tight drop-shadow-sm">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-3 rounded-xl ${stat.bgColor} ring-1 ring-white/5 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                                    >
                                        <stat.icon
                                            className={`w-6 h-6 ${stat.color}`}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Revenue Trend Chart */}
                    <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-md p-6 sm:p-8 mb-8 shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 shadow-inner">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-foreground tracking-tight">
                                        Tren Pendapatan
                                    </h2>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Performa 7 hari terakhir
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={revenueTrend}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorRevenue"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#34d399"
                                                stopOpacity={0.4}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#34d399"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#334155"
                                        opacity={0.4}
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        fontWeight={500}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        fontWeight={500}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) =>
                                            `Rp${val / 1000}k`
                                        }
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                "rgba(15, 23, 42, 0.9)",
                                            backdropFilter: "blur(8px)",
                                            border: "1px solid rgba(255, 255, 255, 0.1)",
                                            borderRadius: "12px",
                                            boxShadow:
                                                "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                                        }}
                                        itemStyle={{
                                            color: "#34d399",
                                            fontWeight: 600,
                                        }}
                                        labelStyle={{
                                            color: "#f8fafc",
                                            fontWeight: 600,
                                            marginBottom: "4px",
                                        }}
                                        cursor={{
                                            stroke: "#34d399",
                                            strokeWidth: 1,
                                            strokeDasharray: "4 4",
                                            fill: "rgba(52, 211, 153, 0.05)",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        strokeWidth={3}
                                        activeDot={{
                                            r: 6,
                                            fill: "#10b981",
                                            stroke: "#fff",
                                            strokeWidth: 2,
                                            className: "drop-shadow-md",
                                        }}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pending Alert */}
                    {pendingTransactions > 0 && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-3.5">
                            <div className="p-1.5 rounded-full bg-amber-500/10">
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                            </div>
                            <p className="text-sm text-amber-300/90 flex-1">
                                Terdapat{" "}
                                <span className="font-semibold text-amber-400">
                                    {pendingTransactions} transaksi
                                </span>{" "}
                                yang menunggu pembayaran.
                            </p>
                            <Link
                                href={
                                    route("transactions.index") +
                                    "?status=pending"
                                }
                                className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap bg-amber-400/10 px-3 py-1.5 rounded-lg"
                            >
                                Lihat Pending
                            </Link>
                        </div>
                    )}

                    {/* Recent Transactions */}
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-muted/50">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <h2 className="text-base font-semibold text-foreground">
                                    Transaksi Terakhir
                                </h2>
                            </div>
                            <Link
                                href={route("transactions.index")}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/20">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                                            No. Transaksi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                                            Pasien
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground">
                                            Total
                                        </th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentTransactions.map((trx) => (
                                        <tr
                                            key={trx.id}
                                            className="hover:bg-muted/20 transition-colors"
                                        >
                                            <td className="px-6 py-3.5 font-mono text-xs">
                                                {trx.transaction_number}
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground">
                                                {trx.patient_name}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                {getStatusBadge(trx.status)}
                                            </td>
                                            <td className="px-6 py-3.5 text-right font-semibold text-foreground">
                                                Rp{" "}
                                                {parseInt(
                                                    trx.total,
                                                ).toLocaleString("id-ID")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
