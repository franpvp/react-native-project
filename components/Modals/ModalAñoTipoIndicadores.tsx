import React from 'react';
import { Modal, Button, Text, View, FlatList } from 'native-base';
import { StyleSheet } from 'react-native';

interface SerieItem {
    fecha: string;
    valor: number;
}

interface IndicatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        version: string;
        autor: string;
        codigo: string;
        nombre: string;
        unidad_medida: string;
        serie: SerieItem[];
    };
}

const IndicatorModal: React.FC<IndicatorModalProps> = ({ isOpen, onClose, data }) => {
    const renderItem = ({ item }: { item: SerieItem }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.fecha}</Text>
            <Text style={styles.cell}>{item.valor.toFixed(2)}</Text>
        </View>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>{data.nombre}</Modal.Header>
                <Modal.Body>
                    <FlatList
                        data={data.serie}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.fecha}
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

export default IndicatorModal;