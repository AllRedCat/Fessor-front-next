"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { useState, useEffect } from "react";
import { apiRequest } from "@/app/lib/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium';
  planExpiresAt?: string;
  reportsUsed: number;
  reportsLimit: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  reportsLimit: number;
  features: string[];
  popular?: boolean;
}

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPlans, setShowPlans] = useState(false);

    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const plans: Plan[] = [
        {
            id: "free",
            name: "Plano Gratuito",
            price: 0,
            reportsLimit: 5,
            features: [
                "5 relatórios por mês",
                "Relatórios básicos",
                "Suporte por email"
            ]
        },
        {
            id: "premium",
            name: "Plano Premium",
            price: 29.90,
            reportsLimit: 100,
            features: [
                "100 relatórios por mês",
                "Relatórios avançados",
                "Prioridade no processamento",
                "Suporte prioritário",
                "Exportação em PDF",
                "Histórico completo"
            ],
            popular: true
        }
    ];

    useEffect(() => {
        if (!isLoading) {
            fetchProfile();
        }
    }, [isLoading]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await apiRequest("/api/me");
            if (response) {
                setProfile(response);
                setEditForm({
                    name: response.name,
                    email: response.email,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            }
        } catch (error: any) {
            setError(error.message || "Erro ao carregar perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const updateData: any = {
                name: editForm.name,
                email: editForm.email
            };

            if (editForm.newPassword) {
                if (editForm.newPassword !== editForm.confirmPassword) {
                    throw new Error("As senhas não coincidem");
                }
                if (!editForm.currentPassword) {
                    throw new Error("Senha atual é obrigatória para alterar a senha");
                }
                updateData.currentPassword = editForm.currentPassword;
                updateData.newPassword = editForm.newPassword;
            }

            const response = await apiRequest(`/api/users/${profile?.id}`, {
                method: 'PUT',
                body: JSON.stringify(updateData),
            });

            if (response) {
                setSuccess("Perfil atualizado com sucesso!");
                setEditForm(prev => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }));
                await fetchProfile(); // Recarrega os dados do perfil
            }
        } catch (error: any) {
            setError(error.message || "Erro ao atualizar perfil");
        } finally {
            setSaving(false);
        }
    };

    const handlePlanUpgrade = async (planId: string) => {
        try {
            const response = await apiRequest("/api/subscription/upgrade", {
                method: 'POST',
                body: JSON.stringify({ planId }),
            });

            if (response && response.checkoutUrl) {
                window.location.href = response.checkoutUrl;
            }
        } catch (error: any) {
            setError(error.message || "Erro ao processar upgrade do plano");
        }
    };

    const handleLogout = async () => {
        try {
            await apiRequest("/auth/logout", { method: 'POST' });
            window.location.href = "/login";
        } catch (error) {
            console.error("Erro no logout:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const currentPlan = plans.find(p => p.id === profile?.plan);

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Perfil do Usuário</h1>
                    <p className="mt-2 text-gray-600">
                        Gerencie suas informações pessoais e plano de assinatura.
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Informações do Plano */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Seu Plano</h3>
                            
                            {loading ? (
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Plano Atual:</span>
                                        <span className="text-sm text-gray-900">{currentPlan?.name}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Relatórios Usados:</span>
                                        <span className="text-sm text-gray-900">
                                            {profile?.reportsUsed} / {profile?.reportsLimit}
                                        </span>
                                    </div>
                                    
                                    {profile?.planExpiresAt && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Expira em:</span>
                                            <span className="text-sm text-gray-900">
                                                {new Date(profile.planExpiresAt).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Barra de Progresso */}
                                    {/* <div className="mt-4">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Uso do mês</span>
                                            <span>{Math.round((profile?.reportsUsed || 0) / (profile?.reportsLimit || 1) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ 
                                                    width: `${Math.min((profile?.reportsUsed || 0) / (profile?.reportsLimit || 1) * 100, 100)}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div> */}
                                    
                                    {profile?.plan === 'free' && (
                                        <button
                                            onClick={() => setShowPlans(true)}
                                            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Fazer Upgrade
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Formulário de Edição */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
                            
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 text-neutral-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 text-neutral-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Alterar Senha</h4>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                                Senha Atual
                                            </label>
                                            <input
                                                type="password"
                                                id="currentPassword"
                                                name="currentPassword"
                                                value={editForm.currentPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-3 text-neutral-800 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                                Nova Senha
                                            </label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                name="newPassword"
                                                value={editForm.newPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 text-neutral-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmar Nova Senha
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={editForm.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 text-neutral-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Sair da Conta
                                    </button>
                                    
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? "Salvando..." : "Salvar Alterações"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Planos */}
            {showPlans && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Escolha seu Plano</h3>
                                <button
                                    onClick={() => setShowPlans(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`relative p-6 border rounded-lg ${
                                            plan.popular 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-200 bg-white'
                                        }`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                    Mais Popular
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="text-center">
                                            <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                                            <div className="mt-2">
                                                <span className="text-3xl font-bold text-gray-900">
                                                    R$ {plan.price.toFixed(2).replace('.', ',')}
                                                </span>
                                                <span className="text-gray-600">/mês</span>
                                            </div>
                                            
                                            <ul className="mt-6 space-y-3 text-left">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-sm text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            
                                            <button
                                                onClick={() => handlePlanUpgrade(plan.id)}
                                                disabled={plan.id === profile?.plan}
                                                className={`w-full mt-6 px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                    plan.id === profile?.plan
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : plan.popular
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                                                        : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
                                                }`}
                                            >
                                                {plan.id === profile?.plan ? 'Plano Atual' : 'Escolher Plano'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 