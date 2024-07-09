import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Menu, Divider, Provider } from 'react-native-paper';

export default function MenuDesplegable() {
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <Provider>
            <View style={styles.container}>
                <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Button onPress={openMenu}>Show menu</Button>}
                >
                <Menu.Item onPress={() => {}} title="Item 1" />
                <Menu.Item onPress={() => {}} title="Item 2" />
                <Divider />
                <Menu.Item onPress={() => {}} title="Item 3" />
                </Menu>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: 'white',
    },
});