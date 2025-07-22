"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { useState } from "react";
import { apiRequest } from "@/app/lib/api";

interface ReportFormData {
  studentName: string;
  studentAge: string;
  studentGrade: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;
  witnesses: string;
  actionsTaken: string;
  additionalNotes: string;
}

export default function HomePage() {
    const { user, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ReportFormData>({
        studentName: "",
        studentAge: "",
        studentGrade: "",
        incidentDate: "",
        incidentTime: "",
        incidentLocation: "",
        incidentDescription: "",
        witnesses: "",
        actionsTaken: "",
        additionalNotes: ""
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSubmitSuccess(false);

        try {
            const response = await apiRequest("/api/reports", {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            if (response) {
                setSubmitSuccess(true);
                setFormData({
                    studentName: "",
                    studentAge: "",
                    studentGrade: "",
                    incidentDate: "",
                    incidentTime: "",
                    incidentLocation: "",
                    incidentDescription: "",
                    witnesses: "",
                    actionsTaken: "",
                    additionalNotes: ""
                });
            }
        } catch (error: any) {
            setError(error.message || "Erro ao enviar relatório");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto pb-[4rem]">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gerar Relatório</h1>
                    <p className="mt-2 text-gray-600">
                        Preencha as informações do aluno e do ocorrido para gerar um relatório formatado pela IA.
                    </p>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    Relatório enviado com sucesso! A IA está processando suas informações.
                                </p>
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informações do Aluno */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                                Informações do Aluno
                            </h3>
                        </div>

                        <div>
                            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome do Aluno *
                            </label>
                            <input
                                type="text"
                                id="studentName"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="studentAge" className="block text-sm font-medium text-gray-700 mb-2">
                                Idade
                            </label>
                            <input
                                type="number"
                                id="studentAge"
                                name="studentAge"
                                value={formData.studentAge}
                                onChange={handleInputChange}
                                min="1"
                                max="25"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="studentGrade" className="block text-sm font-medium text-gray-700 mb-2">
                                Série/Turma
                            </label>
                            <select
                                id="studentGrade"
                                name="studentGrade"
                                value={formData.studentGrade}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Selecione uma opção</option>
                                <option value="Educação Infantil">Educação Infantil</option>
                                <option value="1º Ano">1º Ano</option>
                                <option value="2º Ano">2º Ano</option>
                                <option value="3º Ano">3º Ano</option>
                                <option value="4º Ano">4º Ano</option>
                                <option value="5º Ano">5º Ano</option>
                                <option value="6º Ano">6º Ano</option>
                                <option value="7º Ano">7º Ano</option>
                                <option value="8º Ano">8º Ano</option>
                                <option value="9º Ano">9º Ano</option>
                                <option value="1º Ano EM">1º Ano EM</option>
                                <option value="2º Ano EM">2º Ano EM</option>
                                <option value="3º Ano EM">3º Ano EM</option>
                            </select>
                        </div>

                        {/* Informações do Ocorrido */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 mt-6">
                                Informações do Ocorrido
                            </h3>
                        </div>

                        <div>
                            <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 mb-2">
                                Data do Ocorrido *
                            </label>
                            <input
                                type="date"
                                id="incidentDate"
                                name="incidentDate"
                                value={formData.incidentDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="incidentTime" className="block text-sm font-medium text-gray-700 mb-2">
                                Horário do Ocorrido
                            </label>
                            <input
                                type="time"
                                id="incidentTime"
                                name="incidentTime"
                                value={formData.incidentTime}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="incidentLocation" className="block text-sm font-medium text-gray-700 mb-2">
                                Local do Ocorrido
                            </label>
                            <input
                                type="text"
                                id="incidentLocation"
                                name="incidentLocation"
                                value={formData.incidentLocation}
                                onChange={handleInputChange}
                                placeholder="Ex: Sala de aula, Pátio, Corredor..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="incidentDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição do Ocorrido *
                            </label>
                            <textarea
                                id="incidentDescription"
                                name="incidentDescription"
                                value={formData.incidentDescription}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                placeholder="Descreva detalhadamente o que aconteceu..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="witnesses" className="block text-sm font-medium text-gray-700 mb-2">
                                Testemunhas (se houver)
                            </label>
                            <input
                                type="text"
                                id="witnesses"
                                name="witnesses"
                                value={formData.witnesses}
                                onChange={handleInputChange}
                                placeholder="Nomes das testemunhas..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="actionsTaken" className="block text-sm font-medium text-gray-700 mb-2">
                                Ações Tomadas
                            </label>
                            <textarea
                                id="actionsTaken"
                                name="actionsTaken"
                                value={formData.actionsTaken}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Descreva as ações que foram tomadas após o ocorrido..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                                Observações Adicionais
                            </label>
                            <textarea
                                id="additionalNotes"
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Informações adicionais relevantes..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processando...
                                </>
                            ) : (
                                "Gerar Relatório"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}