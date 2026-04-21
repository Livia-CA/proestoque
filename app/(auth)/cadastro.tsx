import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { LogoProEstoque } from '@/src/components/LogoProEstoque';
import { ProEstoqueTheme } from '@/src/constants/theme';

export default function CadastroScreen() {
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [confirmarSenha, setConfirmarSenha] = useState('');
	const [loading, setLoading] = useState(false);

	const senhaError = useMemo(() => {
		if (!confirmarSenha) {
			return undefined;
		}

		if (senha !== confirmarSenha) {
			return 'As senhas não coincidem';
		}

		return undefined;
	}, [confirmarSenha, senha]);

	const handleCriarConta = () => {
		if (senha !== confirmarSenha) {
			return;
		}

		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			router.replace('/(auth)/login');
		}, 2000);
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.select({ ios: 'padding', android: 'height' })}>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}>
					<View style={styles.card}>
						<View style={styles.header}>
							<LogoProEstoque size="md" />
							<Text style={styles.title}>Criar conta</Text>
						</View>

						<View style={styles.form}>
							<Input
								label="Nome completo"
								value={nome}
								onChangeText={setNome}
								placeholder="João Silva"
								textContentType="name"
								leftIcon="person-outline"
							/>

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
								textContentType="newPassword"
								leftIcon="lock-closed-outline"
							/>

							<Input
								label="Confirmar senha"
								value={confirmarSenha}
								onChangeText={setConfirmarSenha}
								placeholder="********"
								secureTextEntry
								autoCapitalize="none"
								textContentType="newPassword"
								leftIcon="lock-closed-outline"
								error={senhaError}
							/>

							<Button
								title="Criar Conta"
								fullWidth
								loading={loading}
								disabled={!!senhaError}
								onPress={handleCriarConta}
							/>
						</View>

						<View style={styles.footer}>
							<Text style={styles.footerText}>Já tenho conta </Text>
							<Link href="/(auth)/login" asChild>
								<Pressable>
									<Text style={styles.footerLink}>Entrar</Text>
								</Pressable>
							</Link>
						</View>
					</View>
				</ScrollView>
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
	},
	scrollContent: {
		flexGrow: 1,
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
	form: {
		gap: ProEstoqueTheme.spacing.md,
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
