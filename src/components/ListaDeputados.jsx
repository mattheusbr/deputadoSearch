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
  CircularProgress, // Importado para o indicador de carregamento
} from '@mui/material';

// Componente principal que exibirá a lista de deputados
function ListaDeputados() {
  // --- ESTADOS DO COMPONENTE ---
  const [deputados, setDeputados] = useState([]); // Inicia como array vazio para receber os dados da API
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Estados para controlar os valores dos filtros
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroUf, setFiltroUf] = useState('');
  const [filtroPartido, setFiltroPartido] = useState('');

  // Listas para preencher os menus de filtro (geradas a partir dos dados)
  const [ufs, setUfs] = useState([]);
  const [partidos, setPartidos] = useState([]);

  // --- EFEITOS (LÓGICA) ---

  // Efeito para buscar os dados da API quando o componente é montado
  useEffect(() => {
    const fetchDeputados = async () => {
      try {
        // 1. Buscando 50 deputados, conforme solicitado.
        const response = await fetch('https://dadosabertos.camara.leg.br/api/v2/deputados?itens=50&ordem=ASC&ordenarPor=nome');
        const data = await response.json();
        
        // 2. Garantindo que a lista não tenha nenhum item duplicado antes de salvar.
        // Isso resolve o erro de "duplicate key".
        const deputadosUnicos = data.dados.filter((deputado, index, self) =>
          index === self.findIndex((d) => d.id === deputado.id)
        );

        setDeputados(deputadosUnicos); // Armazena a lista completa e única
      } catch (error) {
        console.error("Erro ao buscar dados dos deputados:", error);
        // Em um app real, poderíamos mostrar uma mensagem de erro na tela
      } finally {
        setLoading(false); // Finaliza o carregamento, com sucesso ou erro
      }
    };

    fetchDeputados();
  }, []); // O array vazio [] garante que esta função execute apenas uma vez

  // Efeito para extrair UFs e Partidos únicos para os filtros, APÓS os dados serem carregados
  useEffect(() => {
    if (deputados.length > 0) {
      const ufsUnicas = [...new Set(deputados.map(d => d.siglaUf))].sort();
      const partidosUnicos = [...new Set(deputados.map(d => d.siglaPartido))].sort();
      setUfs(ufsUnicas);
      setPartidos(partidosUnicos);
    }
  }, [deputados]); // Este efeito depende da lista 'deputados'

  // --- LÓGICA DE FILTRAGEM ---
  // A lista de deputados a ser exibida é calculada diretamente a partir da lista principal e dos filtros.
  const deputadosFiltrados = deputados.filter(deputado => {
    const nomeMatch = deputado.nome.toLowerCase().includes(filtroNome.toLowerCase());
    const ufMatch = filtroUf ? deputado.siglaUf === filtroUf : true;
    const partidoMatch = filtroPartido ? deputado.siglaPartido === filtroPartido : true;
    return nomeMatch && ufMatch && partidoMatch;
  });
  

  // --- RENDERIZAÇÃO DA PÁGINA ---
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      color: 'white',
      pb: 4, // Adiciona um padding no final da página
    }}>
      {/* Cabeçalho Flat */}
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Deputado na Palma da Mão
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
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
          backgroundColor: 'rgba(32, 58, 67, 0.75)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          position: 'sticky',
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
              flex: '1 1 300px',
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

        {/* Exibição condicional: mostra loading ou os cards */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress color="inherit" size={50} />
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {deputadosFiltrados.length > 0 ? deputadosFiltrados.map((deputado) => (
              <Grid item key={deputado.id} xs={12} sm={6} md={4} lg={2.4}>
                <Card sx={{
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
                    sx={{
                      height: 350, // Altura fixa para a imagem, garantindo uniformidade
                      objectFit: 'cover'
                    }}
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
        )}
      </Container>
    </Box>
  );
}

export default ListaDeputados;

