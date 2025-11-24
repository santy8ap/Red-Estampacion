// components/Navbar.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const name = session?.user?.name ?? "Usuario";
    const email = session?.user?.email ?? "";

    return (
        <nav className="bg-slate-800 text-white flex justify-between items-center px-8 py-4 shadow-md">
            {/* Logo */}
            <Link href="/">
                <h1 className="text-2xl font-bold cursor-pointer hover:text-sky-400">
                    Red Estampación
                </h1>
            </Link>

            {/* Sesión */}
            {session?.user ? (
                <div className="flex items-center gap-4">
                    {/* Dashboard */}
                    <Link
                        href="/dashboard"
                        className="px-3 py-1 rounded hover:bg-slate-700 transition hidden sm:inline-block"
                    >
                        Dashboard
                    </Link>

                    {/* Nombre y email */}
                    <div className="hidden md:flex flex-col text-sm text-right">
                        <span className="font-medium">{name}</span>
                        <span className="text-gray-300 text-xs">{email}</span>
                    </div>

                    {/* Avatar + Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="focus:outline-none"
                            aria-expanded={open}
                            aria-label="Abrir menú de perfil"
                        >
                            {session.user.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={name}
                                    width={40}
                                    height={40}
                                    className="rounded-full cursor-pointer border-2 border-sky-400"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded shadow-lg z-40 overflow-hidden">
                                <div className="px-4 py-3">
                                    <div className="text-sm font-medium">{name}</div>
                                    <div className="text-xs text-gray-300 truncate">{email}</div>
                                </div>
                                <div className="border-t border-slate-800">
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-sm hover:bg-slate-800"
                                        onClick={() => setOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            await signOut({ callbackUrl: "/" });
                                            router.push("/");
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-800"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => signIn()}
                    className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-2xl transition"
                >
                    Sign In
                </button>
            )}
        </nav>
    );
}
