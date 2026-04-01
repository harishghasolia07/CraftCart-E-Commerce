import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../store/StoreContext';
import { withRouter } from '../utils/withRouter';

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

const categoryDropdownWrapStyle = {
  position: 'relative'
};

const categoryDropdownButtonStyle = {
  ...selectStyle,
  minWidth: '230px',
  textAlign: 'left',
  cursor: 'pointer'
};

const categoryDropdownMenuStyle = {
  position: 'absolute',
  top: '110%',
  left: 0,
  zIndex: 1200,
  width: '280px',
  maxHeight: '260px',
  overflowY: 'auto',
  background: '#ffffff',
  border: '1px solid rgba(119, 119, 119, 0.25)',
  boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
  padding: '0.5rem'
};

const categoryOptionLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0.35rem 0.25rem',
  fontFamily: '"Manrope", sans-serif',
  fontSize: '0.85rem',
  color: '#1a1c1c',
  cursor: 'pointer'
};

const clearInlineButtonStyle = {
  border: 'none',
  background: 'transparent',
  color: '#777777',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  cursor: 'pointer',
  padding: 0,
  marginLeft: '8px'
};

class Header extends Component {
  static contextType = StoreContext;

  constructor(props) {
    super(props);
    this.state = {
      isCategoryOpen: false
    };
    this.categoryDropdownRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  handleOutsideClick = (event) => {
    if (this.categoryDropdownRef.current && !this.categoryDropdownRef.current.contains(event.target)) {
      this.setState({ isCategoryOpen: false });
    }
  }

  toggleCategoryDropdown = () => {
    this.setState((prev) => ({ isCategoryOpen: !prev.isCategoryOpen }));
  }

  handleCategoryChange = (category) => {
    this.context.productStore.setCategory(category);
  }

  handleSortChange = (e) => {
    this.context.productStore.setSortOrder(e.target.value);
  }

  render() {
    const { productStore, uiStore } = this.context;
    
    // Use router location so header updates correctly on route changes.
    const isHome = this.props.router.location.pathname === '/';
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

    const categoryLabel =
      productStore.selectedCategories.length > 0
        ? `${productStore.selectedCategories.length} selected`
        : 'All Collection';

    return (
      <header style={dynamicHeaderStyle}>
        <h1 style={dynamicTitleStyle}>Obsidian Atelier</h1>
        
        {isHome && (
          <div style={dynamicFilterContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={labelStyle}>Category:</label>
              <div style={categoryDropdownWrapStyle} ref={this.categoryDropdownRef}>
                <button
                  type="button"
                  onClick={this.toggleCategoryDropdown}
                  style={categoryDropdownButtonStyle}
                >
                  {categoryLabel}
                </button>
                {this.state.isCategoryOpen && (
                  <div style={categoryDropdownMenuStyle}>
                    {productStore.categories.map((cat) => (
                      <label key={cat} style={categoryOptionLabelStyle}>
                        <input
                          type="checkbox"
                          checked={productStore.selectedCategories.includes(cat)}
                          onChange={() => this.handleCategoryChange(cat)}
                        />
                        {cat}
                      </label>
                    ))}
                    {productStore.selectedCategories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => productStore.clearCategories()}
                        style={clearInlineButtonStyle}
                      >
                        Clear
                      </button>
                    )}
                  </div>
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

export default withRouter(observer(Header));
