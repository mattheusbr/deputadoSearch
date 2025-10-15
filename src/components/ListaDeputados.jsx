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
  CircularProgress,
  IconButton,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Componente principal que exibirá a lista de deputados
function ListaDeputados() {
  // --- ESTADOS DO COMPONENTE ---
  const [deputados, setDeputados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Estados para controlar os valores dos INPUTS (controlados)
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroUf, setFiltroUf] = useState('');
  const [filtroPartido, setFiltroPartido] = useState('');
  
  // Estado para controlar os valores da QUERY da API. A busca só é disparada quando este estado muda.
  const [query, setQuery] = useState({ nome: '', uf: '', partido: '' });

  // Listas para preencher os menus de filtro
  const [ufs, setUfs] = useState([]);
  const [partidos, setPartidos] = useState([]);

  // --- LÓGICA DE DADOS ---

  // O useEffect agora dispara a busca baseado na página ou na query
  useEffect(() => {
    const fetchDeputados = async () => {
      setLoading(true);
      try {
        // Constrói a URL da API dinamicamente com os filtros e a página
        const params = new URLSearchParams({
          itens: 50,
          dataInicio: '2023-01-01',
          ordem: 'ASC',
          ordenarPor: 'nome',
          pagina: pagina,
        });
        if (query.nome) params.append('nome', query.nome);
        if (query.uf) params.append('siglaUf', query.uf);
        if (query.partido) params.append('siglaPartido', query.partido);

        const response = await fetch(`https://dadosabertos.camara.leg.br/api/v2/deputados?${params.toString()}`);
        const data = await response.json();
        
        const deputadosUnicos = data.dados.filter((deputado, index, self) =>
          index === self.findIndex((d) => d.id === deputado.id)
        );
        setDeputados(deputadosUnicos);

        // Extrai o número da última página do link 'last' retornado pela API
        const linkLast = data.links.find(link => link.rel === 'last');
        if (linkLast) {
          const urlLast = new URL(linkLast.href);
          setTotalPaginas(parseInt(urlLast.searchParams.get('pagina'), 10));
        } else {
          setTotalPaginas(deputadosUnicos.length > 0 ? pagina : 1); 
        }

      } catch (error)
      {
        console.error("Erro ao buscar dados dos deputados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeputados();
  }, [pagina, query]); // A busca é disparada quando a PÁGINA ou a QUERY mudam

  // Efeito para buscar as listas de partidos e UFs para os filtros (apenas uma vez)
  useEffect(() => {
    // Busca partidos
    const fetchPartidos = async () => {
        const response = await fetch('https://dadosabertos.camara.leg.br/api/v2/partidos?itens=100&ordem=ASC&ordenarPor=sigla');
        const data = await response.json();
        setPartidos(data.dados.map(p => p.sigla));
    };
    
    // Lista estática de UFs
    const ufsList = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
    setUfs(ufsList);
    fetchPartidos();
  }, []);

  // --- FUNÇÕES DE EVENTO ---

  const handleSearch = () => {
    // Ao clicar, atualiza o estado da query e reseta a página.
    // Isso dispara o useEffect para buscar os dados.
    setQuery({
      nome: filtroNome,
      uf: filtroUf,
      partido: filtroPartido,
    });
    setPagina(1);
  };

  const handlePageChange = (event, value) => {
    setPagina(value);
    window.scrollTo(0, 0); // Rola para o topo ao mudar de página
  };
  
  // --- RENDERIZAÇÃO DA PÁGINA ---
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', color: 'white', pb: 4 }}>
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

        <Box sx={{ p: 2, mb: 5, borderRadius: 2, backgroundColor: 'rgba(32, 58, 67, 0.75)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', position: 'sticky', top: 20, zIndex: 10 }}>
          <TextField
            label="Buscar por nome" variant="outlined" fullWidth value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)}
            sx={{ flex: '1 1 300px', input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'white' }, }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' } }}
          />
          <FormControl sx={{ flex: '1 1 150px' }}>
            <InputLabel sx={{color: 'rgba(255, 255, 255, 0.7)'}}>Estado</InputLabel>
            <Select value={filtroUf} label="Estado" onChange={(e) => setFiltroUf(e.target.value)} sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)'}, '& .MuiSvgIcon-root': { color: 'white' } }}>
              <MenuItem value=""><em>Todos</em></MenuItem>
              {ufs.map(uf => <MenuItem key={uf} value={uf}>{uf}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: '1 1 150px' }}>
            <InputLabel sx={{color: 'rgba(255, 255, 255, 0.7)'}}>Partido</InputLabel>
            <Select value={filtroPartido} label="Partido" onChange={(e) => setFiltroPartido(e.target.value)} sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)'}, '& .MuiSvgIcon-root': { color: 'white' } }}>
              <MenuItem value=""><em>Todos</em></MenuItem>
              {partidos.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
          <IconButton onClick={handleSearch} sx={{ backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>
            <SearchIcon sx={{ color: 'white', fontSize: 30 }} />
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress color="inherit" size={50} />
          </Box>
        ) : (
          <>
            <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
              {deputados.length > 0 ? deputados.map((deputado) => (
                <Grid item key={deputado.id} xs={12} sm={6} md={4} lg={2.4}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' } }}>
                    <CardMedia
                      component="img" image={deputado.urlFoto} alt={`Foto do deputado ${deputado.nome}`}
                      sx={{ height: 350, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, color: 'white', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>{deputado.nome}</Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{deputado.siglaPartido} - {deputado.siglaUf}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )) : (
                <Grid item xs={12}>
                    <Typography align="center" sx={{mt: 5}}>Nenhum deputado encontrado com os filtros selecionados.</Typography>
                </Grid>
              )}
            </Grid>
            {deputados.length > 0 && totalPaginas > 1 && (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 6,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(32, 58, 67, 0.75)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    position: 'sticky',
                    bottom: 20,
                    zIndex: 10,
                }}>
                    <Pagination
                        count={totalPaginas}
                        page={pagina}
                        onChange={handlePageChange}
                        siblingCount={1}
                        boundaryCount={1}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }
                            },
                            '& .Mui-selected': {
                                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                fontWeight: 'bold',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                            },
                        }}
                    />
                </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default ListaDeputados;

