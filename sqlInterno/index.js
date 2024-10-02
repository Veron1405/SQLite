import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, TextInput, Alert, FlatList, TouchableOpacity, Text } from 'react-native';
import { usarBD } from './hooks/usarBD';
import { Produto } from './components/produto';

export function Index() {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nomeFocused, setNomeFocused] = useState(false);
  const [quantidadeFocused, setQuantidadeFocused] = useState(false);
  
  const produtosBD = usarBD();

  useEffect(() => {
    listar();
  }, [pesquisa]);

  async function listar() {
    try {
      const captura = await produtosBD.read(pesquisa);
      setProdutos(captura);
    } catch (error) {
      console.log(error);
    }
  }

  async function create() {
    if (isNaN(quantidade)) {
      return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
    }
    try {
      const item = await produtosBD.create({
        nome,
        quantidade: Number(quantidade),
      });
      Alert.alert('Produto cadastrado com o ID: ' + item.idProduto);
      setId(item.idProduto);
      listar();
    } catch (error) {
      console.log(error);
    }
  }

  async function update() {
    if (selectedItem) {
      try {
        await produtosBD.update({
          id: selectedItem.id,
          nome,
          quantidade: Number(quantidade),
        });
        Alert.alert('Produto atualizado com sucesso!');
        listar();
        setSelectedItem(null);
        setNome('');
        setQuantidade('');
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setNome(item.nome);
    setQuantidade(item.quantidade.toString());
  };

  const handleClearSelection = () => {
    setSelectedItem(null);
    setNome('');
    setQuantidade('');
  };

  const remove = async (id) => {
    try {
      await produtosBD.remove(id);
      await listar();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.texto,
          nomeFocused && { borderColor: '#007BFF', borderWidth: 2 }
        ]}
        placeholder="Nome"
        onChangeText={setNome}
        value={nome}
        onFocus={() => setNomeFocused(true)}
        onBlur={() => setNomeFocused(false)}
      />
      <TextInput
        style={[
          styles.texto,
          quantidadeFocused && { borderColor: '#007BFF', borderWidth: 2 }
        ]}
        placeholder="Quantidade"
        onChangeText={setQuantidade}
        value={quantidade}
        keyboardType="numeric"
        onFocus={() => setQuantidadeFocused(true)}
        onBlur={() => setQuantidadeFocused(false)}
      />
      <View style={styles.buttonContainer}>
        <Button title={selectedItem ? "Atualizar" : "Salvar"} onPress={selectedItem ? update : create} />
        {selectedItem && <Button title="Cancelar" onPress={handleClearSelection} />}
      </View>
      <TextInput
        style={styles.texto}
        placeholder="Pesquisar"
        onChangeText={setPesquisa}
      />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Produto data={item} onDelete={() => remove(item.id)} onSelect={() => handleSelectItem(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
    gap: 16,
    backgroundColor: '#f4f4f4',
  },
  texto: {
    height: 54,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listContent: {
    gap: 16,
  },
});
