"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { useState, useEffect } from "react";
import { apiRequest } from "@/app/lib/api";

interface Report {
  id: string;
  studentName: string;
  incidentDate: string;
  incidentDescription: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  aiReport?: string;
}

export default function HistoryPage() {
    const { user, isLoading } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    useEffect(() => {
        if (!isLoading) {
            fetchReports();
        }
    }, [isLoading]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await apiRequest("/api/reports");
            if (response) {
                setReports(response);
            }
        } catch (error: any) {
            setError(error.message || "Erro ao carregar relatórios");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                        </svg>
                        Processando
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                        </svg>
                        Concluído
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                        </svg>
                        Erro
                    </span>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const downloadReport = async (reportId: string) => {
        try {
            const response = await apiRequest(`/api/reports/${reportId}/download`, {
                method: 'GET',
            });
            
            if (response && response.downloadUrl) {
                window.open(response.downloadUrl, '_blank');
            }
        } catch (error: any) {
            console.error('Erro ao baixar relatório:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Histórico de Relatórios</h1>
                    <p className="mt-2 text-gray-600">
                        Visualize todos os relatórios que você gerou e acompanhe o status de processamento.
                    </p>
                </div>

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

                {/* Reports List */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Carregando relatórios...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum relatório encontrado</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Você ainda não gerou nenhum relatório. Comece criando seu primeiro relatório.
                            </p>
                            <div className="mt-6">
                                <a
                                    href="/home"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Criar Relatório
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aluno
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data do Ocorrido
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Criado em
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {report.studentName}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {report.incidentDescription.substring(0, 100)}...
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(report.incidentDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(report.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(report.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setSelectedReport(report)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Visualizar
                                                    </button>
                                                    {report.status === 'completed' && (
                                                        <button
                                                            onClick={() => downloadReport(report.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Baixar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para visualizar relatório */}
            {selectedReport && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Relatório - {selectedReport.studentName}
                                </h3>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-900">Informações do Aluno</h4>
                                    <p className="text-gray-600">Nome: {selectedReport.studentName}</p>
                                    <p className="text-gray-600">Data do Ocorrido: {formatDate(selectedReport.incidentDate)}</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-900">Descrição do Ocorrido</h4>
                                    <p className="text-gray-600">{selectedReport.incidentDescription}</p>
                                </div>
                                
                                {selectedReport.aiReport && (
                                    <div>
                                        <h4 className="font-medium text-gray-900">Relatório Gerado pela IA</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <pre className="whitespace-pre-wrap text-sm text-gray-700">
                                                {selectedReport.aiReport}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex justify-end space-x-3 pt-4">
                                    {selectedReport.status === 'completed' && (
                                        <button
                                            onClick={() => downloadReport(selectedReport.id)}
                                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            Baixar PDF
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedReport(null)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 