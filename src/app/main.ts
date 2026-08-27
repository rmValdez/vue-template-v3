import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import router from '@/router';
import App from './App.vue';
import './styles/main.css';

const app = createApp(App);
const pinia = createPinia();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3 // 3 minutes
    }
  }
});

app.use(pinia);
app.use(VueQueryPlugin, { queryClient });
app.use(router);

app.mount('#app');
