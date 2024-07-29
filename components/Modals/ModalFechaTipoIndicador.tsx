import React from 'react';
import { Modal, Button, Text, View } from 'native-base';
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
    const serieItem = data.serie[0]; // Hay solo un item en la serie

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>{data.nombre}</Modal.Header>
                <Modal.Body>
                    <View style={styles.container}>
                        <Text style={styles.text}><Text style={styles.label}>Fecha:</Text> {serieItem.fecha}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Valor:</Text> {serieItem.valor.toFixed(2)}</Text>
                    </View>
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={onClose} style={styles.button}>Cerrar</Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    text: {
        marginBottom: 8,
    },
    label: {
        fontWeight: 'bold',
    },
    button: {
        justifyContent: 'center',
    }
});

export default IndicatorModal;