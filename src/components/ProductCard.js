import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { StoreContext } from '../store/StoreContext';

const cardStyle = {
  backgroundColor: '#f9f9f9',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  height: '100%',
  textDecoration: 'none',
  color: 'inherit',
  // No border, No border radius, use background color shift if needed
  // We rely on grid gap for whitespace
};

const imageContainerStyle = {
  backgroundColor: '#f3f3f3', // surface-container-low
  padding: '1.4rem',
  marginBottom: '1.4rem' // internal padding/spacing
};

const imageStyle = {
  width: '100%',
  height: '350px',
  objectFit: 'contain',
  mixBlendMode: 'multiply' // Helps fake-store images blend with grey background
};

const titleStyle = {
  fontFamily: '"Newsreader", serif',
  fontSize: '1.25rem',
  fontWeight: '500',
  marginBottom: '0.5rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  color: '#000000'
};

const priceStyle = {
  color: '#474747', // on_surface_variant
  fontSize: '1rem',
  fontWeight: '400',
  fontFamily: '"Manrope", sans-serif'
};

class ProductCard extends Component {
  static contextType = StoreContext;

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false
    };
  }

  render() {
    const { product } = this.props;
    const { uiStore } = this.context;
    const isMobile = uiStore ? uiStore.isMobile : false;
    
    const dynamicImageContainerStyle = {
      ...imageContainerStyle,
      padding: isMobile ? '0.5rem' : '1.4rem',
      marginBottom: isMobile ? '0.5rem' : '1.4rem',
      transform: this.state.isHovered ? 'scale(1.02)' : 'scale(1)',
      transition: 'transform 0.3s ease'
    };

    const dynamicImageStyle = {
      ...imageStyle,
      height: isMobile ? '200px' : '350px'
    };

    const dynamicTitleStyle = {
      ...titleStyle,
      fontSize: isMobile ? '1rem' : '1.25rem'
    };

    return (
      <Link to={`/product/${product.id}/details`} style={{ textDecoration: 'none', display: 'block' }}>
        <div 
          style={cardStyle} 
          onMouseEnter={() => this.setState({ isHovered: true })}
          onMouseLeave={() => this.setState({ isHovered: false })}
        >
          <div style={dynamicImageContainerStyle}>
            <img src={product.image} alt="thumbnail" style={dynamicImageStyle} />
          </div>
          <div style={{ padding: '0 0.5rem' }}>
            <div style={dynamicTitleStyle} title={product.title}>{product.title}</div>
            <div style={priceStyle}>
              ${product.price.toFixed(2)}
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default observer(ProductCard);
