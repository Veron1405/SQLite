import { useSQLiteContext } from 'expo-sqlite';

export function usarBD() {
  const bd = useSQLiteContext();

  async function create(dados) {
    const regras = await bd.prepareAsync(
      "INSERT INTO produtos (nome, quantidade) VALUES ($nome, $quantidade)"
    );

    try {
      const result = await regras.executeAsync({
        $nome: dados.nome,
        $quantidade: dados.quantidade,
      });

      const idProduto = result.lastInsertRowId.toLocaleString();
      return { idProduto };
    } catch (error) {
      throw error;
    } finally {
      await regras.finalizeAsync();
    }
  }

  async function read(nome) {
    try {
      const consulta = "SELECT * FROM produtos WHERE nome LIKE ?";
      const resposta = await bd.getAllAsync(consulta, `%${nome}%`);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async function update(dados) {
    const regras = await bd.prepareAsync(
      "UPDATE produtos SET nome = $nome, quantidade = $quantidade WHERE id = $id"
    );

    try {
      await regras.executeAsync({
        $id: dados.id,
        $nome: dados.nome,
        $quantidade: dados.quantidade,
      });
    } catch (error) {
      throw error;
    } finally {
      await regras.finalizeAsync();
    }
  }

  async function remove(id) {
    try {
      await bd.execAsync("DELETE FROM produtos WHERE id = " + id);
    } catch (error) {
      throw error;
    }
  }

  return { create, read, update, remove };
}
