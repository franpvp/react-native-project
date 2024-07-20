import React from 'react';
import { Modal, Center, Button, Text, View, FlatList } from 'native-base';
import { StyleSheet } from 'react-native';

interface TableModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        fee: {
            name: string;
            percent: number;
            base: [string, string];
        };
    };
}

const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, data }) => {
    const costosData = [
        { key: 'name', value: data.fee.name },
        { key: 'percent', value: data.fee.percent.toString() },
        { key: 'base', value: data.fee.base.join(' ') },
    ];

    const renderItem = ({ item }: { item: { key: string; value: string } }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.key}</Text>
            <Text style={styles.cell}>{item.value}</Text>
        </View>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Detalles</Modal.Header>
                <Modal.Body>
                    <FlatList
                        data={costosData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.key}
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
        justifyContent: 'center'
    }
});

export default TableModal;