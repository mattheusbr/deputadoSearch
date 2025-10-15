import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  AppBar,
  Toolbar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

// --- DADOS MOCKADOS ---
// Para focar no front-end, usamos uma lista de deputados falsa.
// A estrutura dos dados é a mesma da API real.
const mockDeputados = [
  { id: 1, nome: 'Ana Clara', siglaPartido: 'PODEMOS', siglaUf: 'SP', urlFoto: 'https://placehold.co/200x300/EFEFEF/AAAAAA&text=Foto' },
  { id: 2, nome: 'Bruno Costa', siglaPartido: 'PL', siglaUf: 'RJ', urlFoto: 'https://placehold.co/200x300/EFEFEF/AAAAAA&text=Foto' },
  { id: 3, nome: 'Carla Dias', siglaPartido: 'PT', siglaUf: 'MG', urlFoto: 'https://placehold.co/200x300/EFEFEF/AAAAAA&text=Foto' },
  { id: 4, nome: 'Daniel Martins', siglaPartido: 'PSDB', siglaUf: 'SP', urlFoto: 'https://placehold.co/200x300/EFEFEF/AAAAAA&text=Foto' },
  { id: 5, nome: 'Eduarda Lima', siglaPartido: 'MDB', siglaUf: 'BA', urlFoto: 'https://placehold.co/200x300/EFEFEF/AAAAAA&text=Foto' },
  { id: 6, nome: 'Felipe Souza', siglaPartido: 'PSOL', siglaUf: 'RJ', urlFoto: 'https://placehold.co/200x300/EFEFEF/AAAAAA&text=Foto' },
  { id: 7, nome: 'Gabriela Alves', siglaPartido: 'REDE', siglaUf: 'MG', urlFoto: 'https://placehold.co/200x300/EFEFEF/AAAAAA&text=Foto' },
  { id: 8, nome: 'Heitor Oliveira', siglaPartido: 'NOVO', siglaUf: 'SC', urlFoto: 'https://placehold.co/200x300/EFEFEF/AAAAAA&text=Foto' },
];

// Componente principal que exibirá a lista de deputados
function ListaDeputados() {
  // --- ESTADOS DO COMPONENTE ---
  const [deputados] = useState(mockDeputados); // Lista completa de deputados
  const [deputadosFiltrados, setDeputadosFiltrados] = useState(mockDeputados); // Lista a ser exibida
  
  // Estados para controlar os valores dos filtros
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroUf, setFiltroUf] = useState('');
  const [filtroPartido, setFiltroPartido] = useState('');

  // Listas para preencher os menus de filtro (geradas a partir dos dados)
  const [ufs, setUfs] = useState([]);
  const [partidos, setPartidos] = useState([]);

  // --- EFEITOS (LÓGICA) ---

  // Efeito para extrair UFs e Partidos únicos para os filtros
  useEffect(() => {
    // new Set() cria uma coleção de itens únicos
    const ufsUnicas = [...new Set(deputados.map(d => d.siglaUf))].sort();
    const partidosUnicos = [...new Set(deputados.map(d => d.siglaPartido))].sort();
    setUfs(ufsUnicas);
    setPartidos(partidosUnicos);
  }, [deputados]);

  // Efeito para aplicar os filtros sempre que um deles mudar
  useEffect(() => {
    let deputadosResult = deputados;

    if (filtroNome) {
      deputadosResult = deputadosResult.filter(d =>
        d.nome.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }
    if (filtroUf) {
      deputadosResult = deputadosResult.filter(d => d.siglaUf === filtroUf);
    }
    if (filtroPartido) {
      deputadosResult = deputadosResult.filter(d => d.siglaPartido === filtroPartido);
    }

    setDeputadosFiltrados(deputadosResult);
  }, [filtroNome, filtroUf, filtroPartido, deputados]);
  

  // --- RENDERIZAÇÃO DA PÁGINA ---
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      color: 'white',
    }}>
      {/* Cabeçalho Flat */}
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Deputado na palma da Mão
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
          Explore os Deputados Federais
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
          Filtre por nome, estado ou partido para encontrar quem você procura.
        </Typography>

        {/* Barra de Filtros com Estilo Glassmorphism */}
        <Box sx={{
          p: 2,
          mb: 5,
          borderRadius: 2,
          // --- ALTERAÇÕES AQUI ---
          // Cor de fundo mais escura e opaca para garantir a legibilidade
          backgroundColor: 'rgba(32, 58, 67, 0.75)',
          // Blur mais intenso para desfocar melhor o conteúdo que passa atrás
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Adicionada uma sombra sutil para elevação
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          position: 'sticky', // Deixa a barra fixa no topo
          top: 20,
          zIndex: 10,
        }}>
          <TextField
            label="Buscar por nome"
            variant="outlined"
            fullWidth
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            sx={{
              flex: '1 1 300px', // Flexbox para responsividade
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'white' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
            }}
          />
          <FormControl sx={{ flex: '1 1 150px' }}>
            <InputLabel sx={{color: 'rgba(255, 255, 255, 0.7)'}}>Estado</InputLabel>
            <Select value={filtroUf} label="Estado" onChange={(e) => setFiltroUf(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)'}, '& .MuiSvgIcon-root': { color: 'white' } }}
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              {ufs.map(uf => <MenuItem key={uf} value={uf}>{uf}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: '1 1 150px' }}>
            <InputLabel sx={{color: 'rgba(255, 255, 255, 0.7)'}}>Partido</InputLabel>
            <Select value={filtroPartido} label="Partido" onChange={(e) => setFiltroPartido(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)'}, '& .MuiSvgIcon-root': { color: 'white' } }}
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              {partidos.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Grid de Cards com Estilo Glassmorphism */}
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          {deputadosFiltrados.length > 0 ? deputadosFiltrados.map((deputado) => (
            <Grid item key={deputado.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                }
              }}>
                <CardMedia
                  component="img"
                  image={deputado.urlFoto}
                  alt={`Foto do deputado ${deputado.nome}`}
                />
                <CardContent sx={{ flexGrow: 1, color: 'white', textAlign: 'center' }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {deputado.nome}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {deputado.siglaPartido} - {deputado.siglaUf}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )) : (
            <Grid item xs={12}>
                <Typography align="center" sx={{mt: 5}}>Nenhum deputado encontrado com os filtros selecionados.</Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default ListaDeputados;