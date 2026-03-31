import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { StoreContext } from './store/StoreContext';
import { RootStore } from './store/RootStore';

import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import Header from './components/Header';
import Footer from './components/Footer';

// Inline styling maintaining Obsidian Atelier rules
const appStyle = {
  fontFamily: '"Manrope", sans-serif',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f9f9f9', // surface
  color: '#1a1c1c' // on_background
};

const mainStyle = {
  flex: 1,
  padding: '4rem 4rem', // Increase horizontal padding slightly for breathing room on full width
  paddingBottom: '8rem', // padding for fixed footer
  width: '100%',
  boxSizing: 'border-box'
};

class App extends Component {
  constructor(props) {
    super(props);
    // Initialize RootStore once
    this.rootStore = new RootStore();
    this.state = {
      opacity: 0
    };
  }

  componentDidMount() {
    // Trigger a gentle fade-in animation
    setTimeout(() => {
      this.setState({ opacity: 1 });
    }, 50);
  }

  render() {
    const isMobile = this.rootStore.uiStore.isMobile;
    
    const dynamicMainStyle = {
      ...mainStyle,
      padding: isMobile ? '2rem 1rem' : '4rem 4rem',
      paddingBottom: '8rem',
      opacity: this.state.opacity,
      transition: 'opacity 0.6s ease-in-out'
    };

    return (
      <StoreContext.Provider value={this.rootStore}>
        <div style={appStyle}>
          <Header />
          
          <main style={dynamicMainStyle}>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id/details" element={<ProductDetailPage />} />
              </Routes>
            </Router>
          </main>

          <Footer />
        </div>
      </StoreContext.Provider>
    );
  }
}

export default observer(App);
