import React from 'react';
import { Modal, Button, Text, View, FlatList } from 'native-base';
import { StyleSheet } from 'react-native';

interface TableModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        volume: {
            ask_volume_24h: [string, string];
            ask_volume_7d: [string, string];
            bid_volume_24h: [string, string];
            bid_volume_7d: [string, string];
            market_id: string;
        };
    };
}

const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, data }) => {
    const volumeData = Object.entries(data.volume);

    const renderItem = ({ item }: { item: [string, string | string[]] }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item[0]}</Text>
            <Text style={styles.cell}>{Array.isArray(item[1]) ? item[1].join(' ') : item[1]}</Text>
        </View>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Resultado Volumen de Mercado</Modal.Header>
                <Modal.Body>
                    <FlatList
                        data={volumeData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item[0]}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={onClose} style={styles.button}>Cerrar</Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
    },
    cell: {
        flex: 1,
        paddingHorizontal: 8,
    },
    button: {
        justifyContent: 'center',
    }
});

export default TableModal;