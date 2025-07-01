const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.15.10:5005";

// Função helper para fazer requisições com fetch
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include', // Para enviar cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Verificar se a resposta tem conteúdo
    const text = await response.text();
    
    // Se a resposta estiver vazia, retornar null
    if (!text.trim()) {
      return null;
    }
    
    // Tentar fazer parse do JSON
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', text);
      throw new Error(`Resposta inválida do servidor: ${text}`);
    }
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Erro de rede. Verifique se:');
      console.error(`1. O servidor está rodando em ${API_BASE_URL}`);
      console.error('2. O certificado SSL foi aceito no navegador (se usando HTTPS)');
      console.error('3. Não há firewall bloqueando a conexão');
    }
    throw error;
  }
};

// Funções específicas da API
export const authAPI = {
  login: (data: any) => apiRequest("/auth/login", {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  logout: () => apiRequest("/auth/logout", {
    method: 'POST',
  }),
  
  me: () => apiRequest("/api/me"),
  
  register: (data: any) => apiRequest("/api/Users", {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}; 