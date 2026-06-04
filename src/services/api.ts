import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
	TOKEN: '@proestoque:token',
} as const;

const DEFAULT_BASE_URL = Platform.select({
	android: 'http://10.0.2.2:3333/api',
	ios: 'http://192.168.88.173:3333/api',
	default: 'http://localhost:3333/api',
});

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_BASE_URL;

export const api = axios.create({
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
	(error) => {
		if (error.response?.status === 401) {
			// A sessão pode ter expirado; o contexto decide como reagir.
		}

		return Promise.reject(error);
	},
);