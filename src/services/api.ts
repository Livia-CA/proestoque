import { create, isAxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const STORAGE_KEYS = {
	TOKEN: '@proestoque:token',
	USER: '@proestoque:user',
} as const;

const DEFAULT_BASE_URL = 'http://localhost:3333/api';

const BASE_URL = (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? DEFAULT_BASE_URL;

export const api = create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(async (config) => {
	const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

	if (token) {
		config.headers = config.headers ?? {};
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (isAxiosError(error)) {
			if (error.response?.status === 401) {
				await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
			}

			const data = error.response?.data as
				| { erro?: string; message?: string; detalhes?: { campo?: string; mensagem?: string }[] }
				| undefined;

			if (error.response?.status === 422 && data?.detalhes?.length) {
				const detalhes = data.detalhes
					.filter((item) => item.campo && item.mensagem)
					.map((item) => `${item.campo}: ${item.mensagem}`)
					.join('\n');

				return Promise.reject(new Error(detalhes ? `Dados inválidos:\n${detalhes}` : data.erro ?? 'Dados inválidos'));
			}

			const mensagem =
				data?.erro ??
				data?.message ??
				(error.code === 'ECONNABORTED' ? 'Tempo de conexão esgotado' : 'Erro de conexão');

			return Promise.reject(new Error(mensagem));
		}

		return Promise.reject(error);
	},
);
