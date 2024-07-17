import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const CustomInput = ({ value, onChangeText, placeholder, style }) => {
    const { colors } = useTheme();

    return (
    <View style={[styles.container, style]}>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            style={[styles.input, { borderColor: colors.primary }]}
            placeholderTextColor={colors.placeholder}
        />
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#000',
    },
});

export default CustomInput;