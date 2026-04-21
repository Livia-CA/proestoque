import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { ProEstoqueTheme } from '@/src/constants/theme';

type InputProps = {
	label?: string;
	error?: string;
	leftIcon?: keyof typeof Ionicons.glyphMap;
	secureTextEntry?: boolean;
} & TextInputProps;

export function Input({
	label,
	error,
	leftIcon,
	secureTextEntry,
	style,
	onFocus,
	onBlur,
	...rest
}: InputProps) {
	const [isFocused, setIsFocused] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const resolvedSecureTextEntry = useMemo(() => {
		if (!secureTextEntry) {
			return false;
		}

		return !showPassword;
	}, [secureTextEntry, showPassword]);

	return (
		<View style={styles.wrapper}>
			{label ? <Text style={styles.label}>{label}</Text> : null}

			<View
				style={[
					styles.container,
					isFocused && styles.focused,
					!!error && styles.errorBorder,
				]}>
				{leftIcon ? (
					<Ionicons name={leftIcon} size={18} color={ProEstoqueTheme.colors.textSecondary} />
				) : null}

				<TextInput
					placeholderTextColor="#9CA3AF"
					style={[styles.input, style]}
					secureTextEntry={resolvedSecureTextEntry}
					onFocus={(event) => {
						setIsFocused(true);
						onFocus?.(event);
					}}
					onBlur={(event) => {
						setIsFocused(false);
						onBlur?.(event);
					}}
					{...rest}
				/>

				{secureTextEntry ? (
					<Pressable
						accessibilityRole="button"
						onPress={() => setShowPassword((value) => !value)}>
						<Ionicons
							name={showPassword ? 'eye-off-outline' : 'eye-outline'}
							size={20}
							color={ProEstoqueTheme.colors.textSecondary}
						/>
					</Pressable>
				) : null}
			</View>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		gap: ProEstoqueTheme.spacing.xs,
	},
	label: {
		color: ProEstoqueTheme.colors.textPrimary,
		fontSize: ProEstoqueTheme.typography.bodySm,
		fontWeight: '700',
	},
	container: {
		minHeight: 50,
		borderWidth: 1.6,
		borderColor: ProEstoqueTheme.colors.borderDefault,
		borderRadius: ProEstoqueTheme.radius.md,
		backgroundColor: ProEstoqueTheme.colors.surface,
		paddingHorizontal: ProEstoqueTheme.spacing.md,
		flexDirection: 'row',
		alignItems: 'center',
		gap: ProEstoqueTheme.spacing.sm,
	},
	focused: {
		borderColor: ProEstoqueTheme.colors.borderFocused,
	},
	errorBorder: {
		borderColor: ProEstoqueTheme.colors.borderError,
	},
	input: {
		flex: 1,
		fontSize: ProEstoqueTheme.typography.body,
		color: ProEstoqueTheme.colors.textPrimary,
	},
	errorText: {
		color: ProEstoqueTheme.colors.danger,
		fontSize: ProEstoqueTheme.typography.caption,
		fontWeight: '600',
	},
});
