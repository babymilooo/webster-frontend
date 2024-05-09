import ReactDOM from 'react-dom/client';
import './app/styles/index.css';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './pages/App';
import Login from './pages/auth/login';
import RootLayout from './RootLayout';
import Home from './pages/Home';
import Registration from './pages/auth/registration';
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/auth/login',
        element: <Login />,
    },
    {
        path: '/auth/registration',
        element: <Registration />,
    },
    {
        path: '/home',
        element: <Home />,
    },
]);

root.render(
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RootLayout>
            <RouterProvider router={router} />
        </RootLayout>
    </ThemeProvider>,
);
