import { publicRoutes } from './routes';
import DefaultLayout from './components/Layout/DefaultLayout';
import { Routes, Route} from 'react-router-dom';
function App() { 
    // return UI
    return (
        <div className="app">
            <div className="content">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        var Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <DefaultLayout>
                                        <Page />
                                    </DefaultLayout>
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
