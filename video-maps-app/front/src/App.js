import React from "react";
// * BrowserRouter, bir sayfa yenilendiğinde sayfa URL'sinin değişmesini sağlamak ve tek sayfa uygulamalarında 
// * sayfa değiştirme işlemlerini yönetmek için kullanılır. Yönlendirme için kullanılır.
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage/LoginPage";
import MapPage from "./MapPage/MapPage";

// * Bu uygulama, / ve /map URL'leri için iki Route bileşeni tanımlar. Ana sayfa için LoginPage bileşeni, 
// * harita sayfası için MapPage bileşeni tanımlanır. Bileşenler rotalara atanır ve Router ile 
// * yönlendirme yapılır.
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/map" element={<MapPage />} /> 
            </Routes>
        </Router>
    );
};

export default App;