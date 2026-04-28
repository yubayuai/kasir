import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Selamat Datang</h2>
                    <p className="text-muted-foreground text-sm mt-1">Silakan masukkan email dan password Anda.</p>
                </div>

                {status && (
                    <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-500">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <motion.div variants={itemVariants}>
                        <InputLabel htmlFor="email" value="Email" className="mb-1.5 ml-1" />
                        <div className="relative">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full bg-background/50 border-white/5 focus:bg-background transition-all"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email Anda"
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2 ml-1" />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="flex justify-between items-center mb-1.5 ml-1">
                            <InputLabel htmlFor="password" value="Password" />
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="block w-full pr-11 bg-background/50 border-white/5 focus:bg-background transition-all"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-2 ml-1" />
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                        <label className="flex items-center group cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded-md border-white/10 bg-background/50 text-primary focus:ring-primary/20"
                            />
                            <span className="ms-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                Ingat Saya
                            </span>
                        </label>
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-2">
                        <PrimaryButton 
                            className="w-full h-12 justify-center gap-2 group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]" 
                            disabled={processing}
                        >
                            <span className="relative z-10 flex items-center gap-2 font-bold text-sm tracking-wide">
                                {processing ? 'Masuk...' : 'Masuk'}
                            </span>
                        </PrimaryButton>
                    </motion.div>
                </form>
            </motion.div>
        </GuestLayout>
    );
}
