import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
    LayoutDashboard,
    TicketPercent,
    Receipt,
    User,
    X,
    Menu,
    LogOut,
    AlertCircle,
} from 'lucide-react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [confirmingLogout, setConfirmingLogout] = useState(false);

    const logout = () => {
        setConfirmingLogout(true);
    };

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
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
                    letterSpacing: '0.01em',
                },
                iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                },
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                id: 'flash-error',
                duration: 4000,
                style: {
                    borderRadius: '12px',
                    background: '#181b21',
                    color: '#f8fafc',
                    border: '1px solid #272a33',
                    padding: '16px 20px',
                    fontSize: '14.5px',
                    fontWeight: '500',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px -5px rgba(239, 68, 68, 0.15)',
                    letterSpacing: '0.01em',
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            });
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2">
                                    <ApplicationLogo className="block h-9 w-auto rounded-md" />
                                    <span className="font-bold text-xl text-primary hidden sm:block">
                                        RS Delta Surya
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Dashboard
                                </NavLink>

                                {user.role === 'marketing' && (
                                    <NavLink
                                        href={route('vouchers.index')}
                                        active={route().current('vouchers.*')}
                                    >
                                        <TicketPercent className="w-4 h-4 mr-2" />
                                        Voucher
                                    </NavLink>
                                )}

                                {user.role === 'kasir' && (
                                    <NavLink
                                        href={route('transactions.index')}
                                        active={route().current('transactions.*')}
                                    >
                                        <Receipt className="w-4 h-4 mr-2" />
                                        Transaksi
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-card px-3 py-2 text-sm font-medium leading-4 text-muted-foreground transition duration-150 ease-in-out hover:text-foreground focus:outline-none"
                                            >
                                                {user.name}
                                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary uppercase">
                                                    {user.role}
                                                </span>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')} className="flex items-center">
                                            <User className="w-4 h-4 mr-2" /> Profil
                                        </Dropdown.Link>
                                        <button
                                            onClick={logout}
                                            className="w-full px-4 py-2 text-start text-sm leading-5 text-destructive hover:bg-muted focus:outline-none transition duration-150 ease-in-out flex items-center"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> Keluar
                                        </button>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition duration-150 ease-in-out hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none"
                            >
                                {showingNavigationDropdown ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        {user.role === 'marketing' && (
                            <ResponsiveNavLink href={route('vouchers.index')} active={route().current('vouchers.*')}>
                                Voucher
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'kasir' && (
                            <ResponsiveNavLink href={route('transactions.index')} active={route().current('transactions.*')}>
                                Transaksi
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-border pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-foreground">{user.name}</div>
                            <div className="text-sm font-medium text-muted-foreground">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>Profil</ResponsiveNavLink>
                                <button
                                    onClick={logout}
                                    className="w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-left text-base font-medium text-destructive hover:text-destructive hover:bg-muted hover:border-destructive focus:outline-none transition duration-150 ease-in-out flex items-center"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Keluar
                                </button>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-card shadow border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            {/* Logout Confirmation Modal */}
            <Modal show={confirmingLogout} onClose={() => setConfirmingLogout(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <LogOut className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Konfirmasi Logout</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Apakah Anda yakin ingin keluar dari sistem? Anda harus login kembali untuk mengakses data.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingLogout(false)}>
                            Batal
                        </SecondaryButton>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center rounded-lg border border-transparent bg-red-600 px-4 py-2.5 text-sm font-medium tracking-wide text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Ya, Keluar Sekarang
                        </Link>
                    </div>
                </div>
            </Modal>

            <Toaster position="top-right" />
        </div>
    );
}
