import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../store/StoreContext';

const headerStyle = {
  position: 'sticky',
  top: 0,
  padding: '1.5rem 4rem', // Matching horizontal padding
  background: 'rgba(255, 255, 255, 0.6)', // Glassmorphism
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
  borderBottom: '1px solid rgba(119, 119, 119, 0.1)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const titleStyle = {
  fontFamily: '"Newsreader", serif',
  fontSize: '2rem',
  fontWeight: '700',
  margin: 0,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  color: '#000000'
};

const filterContainerStyle = {
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
  flexWrap: 'wrap'
};

const selectStyle = {
  padding: '0.75rem',
  border: 'none',
  borderBottom: '1px solid rgba(119, 119, 119, 0.3)',
  minWidth: '150px',
  background: 'transparent',
  fontFamily: '"Manrope", sans-serif',
  fontSize: '0.875rem',
  outline: 'none',
  color: '#1a1c1c' // on_background
};

const labelStyle = {
  marginRight: '10px',
  fontFamily: '"Manrope", sans-serif',
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#474747' // on_surface_variant
};

const checkboxGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexWrap: 'wrap'
};

class Header extends Component {
  static contextType = StoreContext;

  handleCategoryChange = (category) => {
    this.context.productStore.setCategory(category);
  }

  handleSortChange = (e) => {
    this.context.productStore.setSortOrder(e.target.value);
  }

  render() {
    const { productStore, uiStore } = this.context;
    
    // Check if we are on the Home page to decide whether to show filters
    // A simple window.location.pathname check suffices since we're using BrowserRouter
    const isHome = window.location.pathname === '/';
    const isMobile = uiStore.isMobile;
    
    const dynamicHeaderStyle = {
      ...headerStyle,
      padding: isMobile ? '1rem 1rem' : '1.5rem 4rem',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: isMobile ? 'center' : 'space-between',
      gap: isMobile ? '1rem' : '0'
    };

    const dynamicFilterContainerStyle = {
      ...filterContainerStyle,
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '10px' : '20px'
    };

    const dynamicTitleStyle = {
      ...titleStyle,
      fontSize: isMobile ? '1.5rem' : '2rem'
    };

    return (
      <header style={dynamicHeaderStyle}>
        <h1 style={dynamicTitleStyle}>Obsidian Atelier</h1>
        
        {isHome && (
          <div style={dynamicFilterContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={labelStyle}>Category:</label>
              <div style={checkboxGroupStyle}>
                {productStore.categories.map(cat => (
                  <label key={cat} style={{ ...labelStyle, marginRight: 0, textTransform: 'none', letterSpacing: 'normal' }}>
                    <input
                      type="checkbox"
                      checked={productStore.selectedCategories.includes(cat)}
                      onChange={() => this.handleCategoryChange(cat)}
                      style={{ marginRight: '6px' }}
                    />
                    {cat}
                  </label>
                ))}
                {productStore.selectedCategories.length > 0 && (
                  <button
                    onClick={() => productStore.clearCategories()}
                    style={{
                      ...selectStyle,
                      minWidth: 'unset',
                      padding: '0.4rem 0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={labelStyle}>Sort By:</label>
              <select 
                value={productStore.sortOrder} 
                onChange={this.handleSortChange}
                style={selectStyle}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        )}
      </header>
    );
  }
}

export default observer(Header);
