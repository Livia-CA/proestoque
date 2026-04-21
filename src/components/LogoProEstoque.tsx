import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ProEstoqueTheme } from '@/src/constants/theme';

type LogoSize = 'sm' | 'md' | 'lg';

type LogoProEstoqueProps = {
    size?: LogoSize;
};

const sizeConfig: Record<LogoSize, { container: number; icon: number }> = {
    sm: { container: 40, icon: 18 },
    md: { container: 52, icon: 24 },
    lg: { container: 64, icon: 32 },
};

export function LogoProEstoque({ size = 'md' }: LogoProEstoqueProps) {
    const config = sizeConfig[size];

    return (
        <View
            style={[
                styles.container,
                {
                    width: config.container,
                    height: config.container,
                    borderRadius: ProEstoqueTheme.radius.md,
                },
            ]}>
            <Ionicons
                name="cube-outline"
                size={config.icon}
                color={ProEstoqueTheme.colors.textInverse}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: ProEstoqueTheme.colors.brandPrimary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
