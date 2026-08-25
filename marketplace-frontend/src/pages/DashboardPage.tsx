import {Container, Grid, Paper, Typography} from '@mui/material';

export default function DashboardPage() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Дашборд
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{p: 3, textAlign: 'center'}}>
            <Typography variant="h4">0</Typography>
            <Typography color="text.secondary">Продажи</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{p: 3, textAlign: 'center'}}>
            <Typography variant="h4">0</Typography>
            <Typography color="text.secondary">Доход</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{p: 3, textAlign: 'center'}}>
            <Typography variant="h4">0</Typography>
            <Typography color="text.secondary">Просмотры</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{p: 3, textAlign: 'center'}}>
            <Typography variant="h4">0</Typography>
            <Typography color="text.secondary">Подписчики</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
