import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { ProEstoqueTheme } from '@/src/constants/theme';

export default function RecuperarSenhaScreen() {
	const [email, setEmail] = useState('');
	const [enviado, setEnviado] = useState(false);

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
			<View style={styles.container}>
				<Pressable style={styles.backButton} onPress={() => router.back()}>
					<Ionicons name="arrow-back" size={18} color={ProEstoqueTheme.colors.brandPrimary} />
					<Text style={styles.backText}>Voltar</Text>
				</Pressable>

				<View style={styles.card}>
					<View style={styles.header}>
						<View style={styles.logoBox}>
							<Ionicons name="cube-outline" size={24} color={ProEstoqueTheme.colors.textInverse} />
						</View>
						<Text style={styles.title}>Recuperar senha</Text>
						<Text style={styles.subtitle}>Informe seu e-mail e enviaremos um link de recuperação</Text>
					</View>

					{enviado ? (
						<View style={styles.successBox}>
							<Text style={styles.successTitle}>E-mail enviado!</Text>
							<Text style={styles.successText}>Verifique sua caixa de entrada para continuar.</Text>
						</View>
					) : (
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

							<Button title="Enviar" fullWidth onPress={() => setEnviado(true)} />
						</View>
					)}

					<Button
						title="Voltar ao Login"
						variant="outline"
						fullWidth
						onPress={() => router.replace('/(auth)/login')}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: ProEstoqueTheme.colors.background,
	},
	container: {
		flex: 1,
		padding: ProEstoqueTheme.spacing.lg,
		gap: ProEstoqueTheme.spacing.md,
		justifyContent: 'center',
	},
	backText: {
		color: ProEstoqueTheme.colors.brandPrimary,
		fontWeight: '700',
		fontSize: ProEstoqueTheme.typography.body,
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: ProEstoqueTheme.spacing.xs,
		alignSelf: 'flex-start',
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
	logoBox: {
		width: 52,
		height: 52,
		borderRadius: ProEstoqueTheme.radius.md,
		backgroundColor: ProEstoqueTheme.colors.brandPrimary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: ProEstoqueTheme.typography.h2,
		fontWeight: '800',
		color: ProEstoqueTheme.colors.textPrimary,
	},
	subtitle: {
		color: ProEstoqueTheme.colors.textSecondary,
		fontSize: ProEstoqueTheme.typography.bodySm,
		textAlign: 'center',
	},
	form: {
		gap: ProEstoqueTheme.spacing.md,
	},
	successBox: {
		backgroundColor: ProEstoqueTheme.colors.successBg,
		borderWidth: 1.5,
		borderColor: ProEstoqueTheme.colors.successBorder,
		borderRadius: ProEstoqueTheme.radius.md,
		padding: ProEstoqueTheme.spacing.lg,
		alignItems: 'center',
		gap: ProEstoqueTheme.spacing.xs,
	},
	successTitle: {
		color: ProEstoqueTheme.colors.successText,
		fontSize: ProEstoqueTheme.typography.h3,
		fontWeight: '800',
	},
	successText: {
		color: ProEstoqueTheme.colors.successText,
		fontSize: ProEstoqueTheme.typography.bodySm,
		textAlign: 'center',
	},
});
