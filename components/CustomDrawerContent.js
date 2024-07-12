import React, { useState } from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';

const CustomDrawerContent = (props) => {
    const [isBudaApi, setBudaApi] = useState(false);
    const [isIndicadoresApi, setIsIndicadoresApi] = useState(false);

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
                label="Buda API"
                style={styles.parentItem}
                labelStyle={styles.parentLabel}
                onPress={() => setBudaApi(!isBudaApi)}
            />
            {isBudaApi && (
                <>
                    <DrawerItem
                        label="Estado Mercado"
                        style={styles.childItem}
                        labelStyle={styles.childLabel}
                        onPress={() => props.navigation.navigate('Estado Mercado')}
                    />
                    <DrawerItem
                        label="Abonos y Retiros"
                        style={styles.childItem}
                        labelStyle={styles.childLabel}
                        onPress={() => props.navigation.navigate('Abonos y Retiros')}
                    />
                    <DrawerItem
                        label="Volumen Mercado"
                        style={styles.childItem}
                        labelStyle={styles.childLabel}
                        onPress={() => props.navigation.navigate('Volumen Mercado')}
                    />
                </>
            )}
            <DrawerItem
                label="Indicadores Ec. API"
                style={styles.parentItem}
                labelStyle={styles.parentLabel}
                onPress={() => setIsIndicadoresApi(!isIndicadoresApi)}
            />
            {isIndicadoresApi && (
                <>
                    <DrawerItem
                        label="Indicadores Diarios"
                        style={styles.childItem}
                        labelStyle={styles.childLabel}
                        onPress={() => props.navigation.navigate('')}
                    />
                    <DrawerItem
                        label="Indicadores Último Mes"
                        style={styles.childItem}
                        labelStyle={styles.childLabel}
                        onPress={() => props.navigation.navigate('')}
                    />
                    <DrawerItem
                        label="Indicadores por fecha"
                        style={styles.childItem}
                        labelStyle={styles.childLabel}
                        onPress={() => props.navigation.navigate('')}
                    />
                    <DrawerItem
                        label="Indicadores por año"
                        style={styles.childItem}
                        labelStyle={styles.childLabel}
                        onPress={() => props.navigation.navigate('')}
                    />
                </>
            )}
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    parentItem: {
        backgroundColor: '#e0e0e0',
    },
    parentLabel: {
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center'
    },
    childContainer: {
        paddingLeft: 20,
    },
    childItem: {
        backgroundColor: '#f0f0f0',
        marginVertical: 2,
        paddingVertical: 5,
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 1
    },
    childLabel: {
        fontWeight: 'normal',
        color: '#555',
        margin: 'auto'
    },
});

export default CustomDrawerContent;