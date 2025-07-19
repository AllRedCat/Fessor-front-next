"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Verificar se está em uma página de autenticação
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    // Se estiver em página de auth, não renderizar a sidebar
    if (isAuthPage) {
        return null;
    }

    const navigation = [
        { name: 'Gerar Relatório', href: '/home', icon: '📝' },
        { name: 'Histórico', href: '/history', icon: '📋' },
        { name: 'Perfil', href: '/profile', icon: '👤' },
    ];

    const isActive = (href: string) => {
        return pathname === href;
    };

    return (
        <>
            {/* Sidebar para desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
                    {/* Logo */}
                    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-50">
                        <Link href="/home" className="flex items-center">
                            <span className="text-2xl mr-2">📚</span>
                            <span className="text-xl font-bold text-gray-900">Fessor</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-500'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* User section */}
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <div className="flex items-center w-full">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {user?.email}
                                </p>
                            </div>
                            <button
                                onClick={logout}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-md"
                                title="Sair"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden fixed top-4 left-4 z-40">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                    <span className="sr-only">Abrir menu</span>
                    <svg
                        className={`${isSidebarOpen ? 'hidden' : 'block'} h-6 w-6`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg
                        className={`${isSidebarOpen ? 'block' : 'hidden'} h-6 w-6`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-40">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)}></div>
                </div>
            )}

            {/* Mobile sidebar */}
            <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Logo */}
                    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-50">
                        <Link href="/home" className="flex items-center" onClick={() => setIsSidebarOpen(false)}>
                            <span className="text-2xl mr-2">📚</span>
                            <span className="text-xl font-bold text-gray-900">Fessor</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-500'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* User section */}
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <div className="flex items-center w-full">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {user?.email}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsSidebarOpen(false);
                                }}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-md"
                                title="Sair"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 