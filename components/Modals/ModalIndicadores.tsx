import React from 'react';
import { Modal, Button, Text, View, FlatList } from 'native-base';
import { StyleSheet } from 'react-native';

interface Indicator {
    codigo: string;
    nombre: string;
    unidad_medida: string;
    fecha: string;
    valor: number;
}

interface TableModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        version: string;
        autor: string;
        fecha: string;
        [key: string]: Indicator | string; // Permite propiedades dinámicas
    };
}

const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, data }) => {
    // Filtramos solo los indicadores para mostrar en el modal
    const indicatorsData = Object.entries(data).filter(([key]) => key !== 'version' && key !== 'autor' && key !== 'fecha') as [string, Indicator][];

    const renderItem = ({ item }: { item: [string, Indicator] }) => (
        <View style={styles.row}>
            <Text style={styles.cell}><Text style={styles.label}>Nombre:</Text> {item[1].nombre}</Text>
            <Text style={styles.cell}><Text style={styles.label}>Código:</Text> {item[1].codigo}</Text>
            <Text style={styles.cell}><Text style={styles.label}>Unidad de Medida:</Text> {item[1].unidad_medida}</Text>
            <Text style={styles.cell}><Text style={styles.label}>Fecha:</Text> {item[1].fecha}</Text>
            <Text style={styles.cell}><Text style={styles.label}>Valor:</Text> {item[1].valor.toFixed(2)}</Text>
        </View>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Detalles de Indicadores</Modal.Header>
                <Modal.Body>
                    <FlatList
                        data={indicatorsData}
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
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
    },
    cell: {
        paddingHorizontal: 8,
        marginVertical: 4,
    },
    label: {
        fontWeight: 'bold',
    },
    button: {
        justifyContent: 'center',
    }
});

export default TableModal;