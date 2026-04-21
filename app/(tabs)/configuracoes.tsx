import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProEstoqueTheme } from '@/src/constants/theme';

export default function ConfiguracoesScreen() {
	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
			<View style={styles.container}>
				<Text style={styles.title}>Configurações</Text>
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
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: ProEstoqueTheme.colors.textSecondary,
		fontSize: ProEstoqueTheme.typography.body,
	},
});
