import {
	ActivityIndicator,
	Pressable,
	PressableProps,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import { ProEstoqueTheme } from '@/src/constants/theme';

type ButtonVariant = 'primary' | 'outline';

type ButtonProps = {
	title: string;
	loading?: boolean;
	fullWidth?: boolean;
	variant?: ButtonVariant;
} & Omit<PressableProps, 'style'>;

export function Button({
	title,
	loading = false,
	fullWidth = false,
	variant = 'primary',
	disabled,
	...rest
}: ButtonProps) {
	const isDisabled = disabled || loading;
	const isOutline = variant === 'outline';

	return (
		<Pressable
			accessibilityRole="button"
			style={({ pressed }) => [
				styles.base,
				fullWidth && styles.fullWidth,
				isOutline ? styles.outline : styles.primary,
				isDisabled && styles.disabled,
				pressed && !isDisabled && styles.pressed,
			]}
			disabled={isDisabled}
			{...rest}>
			{loading ? (
				<ActivityIndicator
					color={isOutline ? ProEstoqueTheme.colors.brandPrimary : ProEstoqueTheme.colors.textInverse}
				/>
			) : (
				<View style={styles.content}>
					<Text style={[styles.label, isOutline && styles.outlineLabel]}>{title}</Text>
				</View>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		minHeight: 54,
		paddingHorizontal: ProEstoqueTheme.spacing.lg,
		borderRadius: ProEstoqueTheme.radius.md,
		alignItems: 'center',
		justifyContent: 'center',
	},
	fullWidth: {
		width: '100%',
	},
	primary: {
		backgroundColor: ProEstoqueTheme.colors.brandPrimary,
	},
	outline: {
		borderWidth: 2,
		borderColor: ProEstoqueTheme.colors.brandPrimary,
		backgroundColor: 'transparent',
	},
	disabled: {
		opacity: 0.65,
	},
	pressed: {
		transform: [{ scale: 0.995 }],
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: ProEstoqueTheme.spacing.sm,
	},
	label: {
		fontSize: ProEstoqueTheme.typography.body,
		fontWeight: '700',
		color: ProEstoqueTheme.colors.textInverse,
	},
	outlineLabel: {
		color: ProEstoqueTheme.colors.brandPrimary,
	},
});
