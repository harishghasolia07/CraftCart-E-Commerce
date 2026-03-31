import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../store/StoreContext';
import { withRouter } from '../utils/withRouter';
import { Link } from 'react-router-dom';

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4rem',
  alignItems: 'flex-start',
  paddingTop: '2rem'
};

const leftColumnStyle = {
  flex: '1 1 500px',
  backgroundColor: '#f3f3f3', // surface-container-low
  padding: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '600px'
};

const imageStyle = {
  width: '100%',
  maxHeight: '600px',
  objectFit: 'contain',
  mixBlendMode: 'multiply'
};

const rightColumnStyle = {
  flex: '1 1 400px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};

const titleStyle = {
  fontFamily: '"Newsreader", serif',
  fontSize: '3rem',
  fontWeight: '400',
  lineHeight: 1.2,
  marginBottom: '1rem',
  color: '#000000',
  letterSpacing: '-0.02em'
};

const priceStyle = {
  fontSize: '1.5rem',
  color: '#474747',
  fontWeight: '400',
  marginBottom: '2rem',
  fontFamily: '"Manrope", sans-serif'
};

const descriptionStyle = {
  lineHeight: '1.8',
  color: '#474747',
  marginBottom: '3rem',
  fontFamily: '"Manrope", sans-serif',
  fontSize: '1rem'
};

const buttonStyle = {
  background: '#000000',
  color: '#ffffff',
  padding: '1.2rem 2.5rem',
  border: 'none',
  borderRadius: '0px', // Sharp edges as requested
  fontSize: '1rem',
  fontWeight: '700',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  display: 'inline-block',
  fontFamily: '"Manrope", sans-serif'
};

const backLinkStyle = {
  display: 'inline-block',
  marginBottom: '2rem',
  textDecoration: 'none',
  color: '#777777', // outline
  fontWeight: '600',
  fontFamily: '"Manrope", sans-serif',
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

class ProductDetailPage extends Component {
  static contextType = StoreContext;

  constructor(props) {
    super(props);
    this.state = {
      buttonScale: 1
    };
  }

  handleAddToCart = (product) => {
    // Trigger tiny click animation
    this.setState({ buttonScale: 0.95 });
    setTimeout(() => {
      this.setState({ buttonScale: 1 });
    }, 150);
    
    this.context.cartStore.addToCart(product);
  }

  render() {
    const { productStore, uiStore } = this.context;
    const { id } = this.props.router.params;
    const isMobile = uiStore ? uiStore.isMobile : false;
    
    const product = productStore.products.find(p => p.id.toString() === id);

    if (!product) {
      return (
        <div style={{ paddingTop: '4rem' }}>
          <Link to="/" style={backLinkStyle}>&larr; Return to Collection</Link>
          <h2 style={titleStyle}>Item Unavailable</h2>
          <p style={descriptionStyle}>The requested object could not be found.</p>
        </div>
      );
    }

    const dynamicContainerStyle = {
      ...containerStyle,
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '2rem' : '4rem'
    };

    const dynamicLeftColumnStyle = {
      ...leftColumnStyle,
      minHeight: isMobile ? '300px' : '600px',
      padding: isMobile ? '1rem' : '2rem'
    };

    const dynamicImageStyle = {
      ...imageStyle,
      maxHeight: isMobile ? '300px' : '600px'
    };

    const dynamicTitleStyle = {
      ...titleStyle,
      fontSize: isMobile ? '2rem' : '3rem'
    };

    return (
      <div>
        <Link to="/" style={backLinkStyle}>&larr; Return to Collection</Link>
        <div style={dynamicContainerStyle}>
          <div style={dynamicLeftColumnStyle}>
            <img src={product.image} alt={product.title} style={dynamicImageStyle} />
          </div>
          
          <div style={rightColumnStyle}>
            <h1 style={dynamicTitleStyle}>{product.title}</h1>
            <div style={priceStyle}>
              ${product.price.toFixed(2)}
            </div>
            <p style={descriptionStyle}>
              {product.description}
            </p>
            
            <div>
              <button 
                style={{
                  ...buttonStyle,
                  transform: `scale(${this.state.buttonScale})`,
                  transition: 'transform 0.15s ease'
                }} 
                onClick={() => this.handleAddToCart(product)}
              >
                Add to MyCart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// wrap with HOCs
export default withRouter(observer(ProductDetailPage));
