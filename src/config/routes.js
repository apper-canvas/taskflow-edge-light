import HomePage from '@/components/pages/HomePage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'TaskFlow',
    path: '/',
icon: 'CheckSquare',
    component: HomePage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '/404',
    icon: 'AlertTriangle',
    component: NotFoundPage,
  },
};

export const routeArray = Object.values(routes);