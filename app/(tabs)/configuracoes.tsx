import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/src/contexts/AuthContext';
import { Button } from '@/src/components/Button';
import { ProEstoqueTheme } from '@/src/constants/theme';

export default function ConfiguracoesScreen() {
	const { user, logout } = useAuth();

	const handleLogout = () => {
		Alert.alert(
			'Sair da conta',
			'Tem certeza que deseja sair?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Sair',
					style: 'destructive',
					onPress: async () => {
						await logout();
					},
				},
			]
		);
	};

	const menuItems = [
		{
			id: 'notificacoes',
			label: 'Notificações',
			icon: 'notifications-outline' as const,
			onPress: () => Alert.alert('Em breve', 'Recurso de notificações em desenvolvimento'),
		},
		{
			id: 'ajuda',
			label: 'Ajuda e suporte',
			icon: 'help-circle-outline' as const,
			onPress: () => Alert.alert('Ajuda', 'Entre em contato conosco em suporte@proestoque.com'),
		},
	];

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Configurações</Text>

				<View style={styles.perfilCard}>
					<View style={styles.avatar}>
						<Text style={styles.avatarLetra}>
							{user?.nome?.charAt(0).toUpperCase() ?? '?'}
						</Text>
					</View>
					<View style={styles.perfilInfo}>
						<Text style={styles.nome}>{user?.nome}</Text>
						<Text style={styles.email}>{user?.email}</Text>
					</View>
				</View>

				<Text style={styles.sectionTitle}>Preferências</Text>
				<View style={styles.menuContainer}>
					{menuItems.map((item) => (
						<Pressable
							key={item.id}
							style={({ pressed }) => [
								styles.menuItem,
								pressed && styles.menuItemPressed,
							]}
							onPress={item.onPress}
						>
							<Ionicons
								name={item.icon}
								size={20}
								color={ProEstoqueTheme.colors.brandPrimary}
								style={styles.menuIcon}
							/>
							<Text style={styles.menuLabel}>{item.label}</Text>
							<Ionicons
								name="chevron-forward-outline"
								size={18}
								color={ProEstoqueTheme.colors.textSecondary}
							/>
						</Pressable>
					))}
				</View>

				<View style={{ flex: 1 }} />

				<Button
					title="Sair da conta"
					onPress={handleLogout}
					fullWidth
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: ProEstoqueTheme.colors.background,
	},
	container: {
		flexGrow: 1,
		padding: ProEstoqueTheme.spacing.lg,
		gap: ProEstoqueTheme.spacing.lg,
	},
	title: {
		fontSize: ProEstoqueTheme.typography.h2,
		fontWeight: '700',
		color: ProEstoqueTheme.colors.textPrimary,
	},
	perfilCard: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: ProEstoqueTheme.spacing.md,
		padding: ProEstoqueTheme.spacing.lg,
		backgroundColor: ProEstoqueTheme.colors.surface,
		borderRadius: ProEstoqueTheme.radius.lg,
		borderWidth: 1,
		borderColor: ProEstoqueTheme.colors.borderDefault,
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: ProEstoqueTheme.colors.brandPrimary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarLetra: {
		color: ProEstoqueTheme.colors.textInverse,
		fontSize: 24,
		fontWeight: '700',
	},
	perfilInfo: {
		flex: 1,
	},
	nome: {
		fontSize: ProEstoqueTheme.typography.body,
		fontWeight: '700',
		color: ProEstoqueTheme.colors.textPrimary,
	},
	email: {
		fontSize: ProEstoqueTheme.typography.bodySm,
		color: ProEstoqueTheme.colors.textSecondary,
		marginTop: ProEstoqueTheme.spacing.xs,
	},
	sectionTitle: {
		fontSize: ProEstoqueTheme.typography.body,
		fontWeight: '700',
		color: ProEstoqueTheme.colors.textPrimary,
		marginTop: ProEstoqueTheme.spacing.md,
	},
	menuContainer: {
		gap: ProEstoqueTheme.spacing.sm,
		backgroundColor: ProEstoqueTheme.colors.surface,
		borderRadius: ProEstoqueTheme.radius.md,
		borderWidth: 1,
		borderColor: ProEstoqueTheme.colors.borderDefault,
		overflow: 'hidden',
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: ProEstoqueTheme.spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: ProEstoqueTheme.colors.borderDefault,
	},
	menuItemPressed: {
		backgroundColor: ProEstoqueTheme.colors.brandPrimarySoft,
	},
	menuIcon: {
		marginRight: ProEstoqueTheme.spacing.md,
	},
	menuLabel: {
		flex: 1,
		fontSize: ProEstoqueTheme.typography.body,
		fontWeight: '500',
		color: ProEstoqueTheme.colors.textPrimary,
	},
});
