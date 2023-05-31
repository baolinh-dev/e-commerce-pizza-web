import { publicRoutes } from './routes';
import DefaultLayout from './components/Layout/DefaultLayout';
import LoginLayout from './components/Layout/LoginLayout';
import Login from '~/pages/Login';
import { Routes, Route } from 'react-router-dom';
function App() {
    function getLayout(component) {
        // Kiểm tra xem component có phải là Login không
        if (component === Login) {
            return LoginLayout;
        }
        // Nếu không phải, sử dụng DefaultLayout
        return DefaultLayout;
    }
    // return UI
    return (
        <div className="app">
            <div className="content">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        const Layout = getLayout(Page);
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </div>
    );
}

export default App;
