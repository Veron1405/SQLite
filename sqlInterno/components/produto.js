import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function Produto({ data, onDelete, onSelect }) {
    const [selected, setSelected] = useState(false);

    return (
        <Pressable
            style={[styles.container, selected && styles.selectedContainer]}
            onPress={() => {
                setSelected(!selected);
                onSelect(data); // Passa os dados do produto selecionado para o Index.js
            }}
        >
            <Text style={styles.text}>
                {data.quantidade} - {data.nome}
            </Text>
            <TouchableOpacity onPress={onDelete} >
                <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f1f1f1",
        padding: 24,
        borderRadius: 15,
        gap: 12,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#CECECE",
    },
    selectedContainer: {
        borderColor: "blue",
    },
    text: {
        flex: 1,
    },
});
