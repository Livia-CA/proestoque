import { Link } from 'expo-router';
import { useState } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { LogoProEstoque } from '@/src/components/LogoProEstoque';
import { ProEstoqueTheme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';

export default function LoginScreen() {
	const { login, isLoggingIn } = useAuth();
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');

	const handleLogin = async () => {
		if (!email.trim() || !senha.trim()) {
			Alert.alert('Atenção', 'Preencha e-mail e senha.');
			return;
		}

		try {
			await login(email, senha);
		} catch {
			Alert.alert('Erro', 'Falha ao fazer login. Tente novamente.');
		}
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.select({ ios: 'padding', android: 'height' })}>
				<View style={styles.card}>
					<View style={styles.header}>
						<LogoProEstoque size="md" />
						<Text style={styles.title}>ProEstoque</Text>
						<Text style={styles.subtitle}>Bem-vindo de volta</Text>
					</View>

					<View style={styles.form}>
						<Input
							label="E-mail"
							value={email}
							onChangeText={setEmail}
							placeholder="joao@email.com"
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							textContentType="emailAddress"
							leftIcon="mail-outline"
						/>

						<Input
							label="Senha"
							value={senha}
							onChangeText={setSenha}
							placeholder="********"
							secureTextEntry
							autoCapitalize="none"
							textContentType="password"
							leftIcon="lock-closed-outline"
						/>

						<Link href="/(auth)/recuperar-senha" asChild>
							<Pressable>
								<Text style={styles.linkText}>Esqueci minha senha</Text>
							</Pressable>
						</Link>

						<Button title="Entrar" fullWidth onPress={handleLogin} loading={isLoggingIn} />
					</View>

					<View style={styles.footer}>
						<Text style={styles.footerText}>Não tem conta? </Text>
						<Link href="/(auth)/cadastro" asChild>
							<Pressable>
								<Text style={styles.footerLink}>Criar conta</Text>
							</Pressable>
						</Link>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: ProEstoqueTheme.colors.background,
	},
	keyboardView: {
		flex: 1,
		justifyContent: 'center',
		padding: ProEstoqueTheme.spacing.lg,
	},
	card: {
		backgroundColor: ProEstoqueTheme.colors.surface,
		borderRadius: ProEstoqueTheme.radius.lg,
		padding: ProEstoqueTheme.spacing.xl,
		gap: ProEstoqueTheme.spacing.lg,
		boxShadow: '0px 12px 20px rgba(31, 41, 55, 0.08)',
		elevation: 6,
	},
	header: {
		alignItems: 'center',
		gap: ProEstoqueTheme.spacing.sm,
	},
	title: {
		fontSize: ProEstoqueTheme.typography.h2,
		fontWeight: '800',
		color: ProEstoqueTheme.colors.textPrimary,
	},
	subtitle: {
		fontSize: ProEstoqueTheme.typography.bodySm,
		color: ProEstoqueTheme.colors.textSecondary,
	},
	form: {
		gap: ProEstoqueTheme.spacing.md,
	},
	linkText: {
		alignSelf: 'flex-end',
		color: ProEstoqueTheme.colors.brandPrimary,
		fontSize: ProEstoqueTheme.typography.bodySm,
		fontWeight: '700',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	footerText: {
		color: ProEstoqueTheme.colors.textSecondary,
		fontSize: ProEstoqueTheme.typography.bodySm,
	},
	footerLink: {
		color: ProEstoqueTheme.colors.brandPrimary,
		fontSize: ProEstoqueTheme.typography.bodySm,
		fontWeight: '700',
	},
});
