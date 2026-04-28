import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function GuestLayout({ children }) {
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
        <div className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground overflow-hidden">
            {/* Immersive background image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/login-bg.png" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-30 blur-[2px]"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-background via-background/90 to-background/40" />
            </div>

            {/* Dynamic ambient lights */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <Link href="/" className="flex flex-col items-center gap-3 group mb-8">
                    <div className="p-3 rounded-2xl bg-card/50 backdrop-blur-md border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                        <ApplicationLogo className="h-14 w-auto" />
                    </div>
                    <div className="text-center">
                        <h1 className="font-bold text-3xl tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
                            RS Delta Surya
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1 font-medium tracking-wide uppercase opacity-80">
                            Billing & Cashier System
                        </p>
                    </div>
                </Link>

                <div className="w-full sm:max-w-md">
                    <div className="relative overflow-hidden bg-card/40 backdrop-blur-xl border border-white/10 px-8 py-10 shadow-2xl rounded-3xl">
                        {/* Decorative inner glow */}
                        <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl" />
                        {children}
                    </div>
                </div>
                
                <p className="mt-8 text-xs text-muted-foreground opacity-50 font-medium">
                    &copy; {new Date().getFullYear()} RS Delta Surya. All rights reserved.
                </p>
            </div>
            <Toaster position="top-right" />
        </div>
    );
}
