import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./pages/components/Header";
import PrivateRoute from "./pages/Routes/PrivateRoute";
import AdminRoute from "./pages/Routes/AdminRoute";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UpdatePackage = lazy(() => import("./pages/admin/UpdatePackage"));
const Package = lazy(() => import("./pages/Package"));
const RatingsPage = lazy(() => import("./pages/RatingsPage"));
const Booking = lazy(() => import("./pages/user/Booking"));
const Search = lazy(() => import("./pages/Search"));

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/signup"
                        element={<Signup />}
                    />
                    <Route
                        path="/search"
                        element={<Search />}
                    />
                    {/* user */}
                    <Route
                        path="/profile"
                        element={<PrivateRoute />}>
                        <Route
                            path="user"
                            element={<Profile />}
                        />
                    </Route>
                    {/* admin */}
                    <Route
                        path="/profile"
                        element={<AdminRoute />}>
                        <Route
                            path="admin"
                            element={<AdminDashboard />}
                        />
                        <Route
                            path="admin/update-package/:id"
                            element={<UpdatePackage />}
                        />
                    </Route>
                    <Route
                        path="/about"
                        element={<About />}
                    />
                    <Route
                        path="/package/:id"
                        element={<Package />}
                    />
                    <Route
                        path="/package/ratings/:id"
                        element={<RatingsPage />}
                    />
                    {/* checking user auth before booking */}
                    <Route
                        path="/booking"
                        element={<PrivateRoute />}>
                        <Route
                            path=":packageId"
                            element={<Booking />}
                        />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;
