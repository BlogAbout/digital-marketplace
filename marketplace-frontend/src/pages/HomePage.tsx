import {Box, Button, Card, Container, Grid, Typography} from '@mui/material';
import {motion} from 'framer-motion';
import {Link} from 'react-router-dom';
import GradientButton from '../components/GradientButton';

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 12,
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />
        <Container maxWidth="xl">
          <Typography variant="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            Добро пожаловать в Marketplace
          </Typography>

          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
              >
                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                  }}
                >
                  Цифровые товары
                  <br/>
                  <Typography
                    component="span"
                    variant="h2"
                    sx={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 800,
                    }}
                  >
                    для вашего бизнеса
                  </Typography>
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{mb: 4, maxWidth: 500}}>
                  Покупайте и продавайте цифровые товары: скрипты, шаблоны, плагины и многое другое.
                </Typography>
                <Box sx={{display: 'flex', gap: 2}}>
                  <GradientButton component={Link} to="/products" size="large">
                    Начать покупки
                  </GradientButton>
                  <Button component={Link} to="/register" variant="outlined" size="large">
                    Стать продавцом
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5, delay: 0.2}}
              >
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    borderRadius: 6,
                    p: 6,
                    textAlign: 'center',
                    color: 'white',
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    1000+
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Товаров
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" gutterBottom sx={{mt: 4}}>
                    500+
                  </Typography>
                  <Typography variant="h6">
                    Продавцов
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="xl" sx={{py: 8}}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Почему выбирают нас
        </Typography>
        <Grid container spacing={4} sx={{mt: 4}}>
          {[
            {icon: '🔒', title: 'Безопасность', description: 'Защищенные транзакции и проверенные продавцы'},
            {icon: '⚡', title: 'Мгновенная доставка', description: 'Получайте товары сразу после покупки'},
            {icon: '💬', title: 'Поддержка', description: 'Круглосуточная поддержка и решение споров'},
            {icon: '📊', title: 'Аналитика', description: 'Подробная статистика для продавцов'},
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3, delay: index * 0.1}}
              >
                <Card sx={{height: '100%', p: 3, textAlign: 'center'}}>
                  <Typography variant="h2" sx={{mb: 2}}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
