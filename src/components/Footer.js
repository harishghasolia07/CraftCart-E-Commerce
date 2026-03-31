import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../store/StoreContext';

const footerStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'rgba(255, 255, 255, 0.9)', // Glassmorphism
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  color: '#000000',
  padding: '1.5rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 1000,
  borderTop: '1px solid rgba(119, 119, 119, 0.2)',
  fontFamily: '"Manrope", sans-serif',
  fontSize: '0.875rem'
};

const boldStyle = {
  fontFamily: '"Newsreader", serif',
  fontWeight: '600',
  fontSize: '1rem',
  marginRight: '0.5rem'
};

class Footer extends Component {
  static contextType = StoreContext;

  render() {
    const { cartStore, uiStore } = this.context;
    const isMobile = uiStore ? uiStore.isMobile : false;
    
    const dynamicFooterStyle = {
      ...footerStyle,
      flexDirection: isMobile ? 'column' : 'row',
      padding: isMobile ? '1rem 2rem' : '1.5rem 2rem',
      gap: isMobile ? '0.5rem' : '0'
    };

    return (
      <div style={dynamicFooterStyle}>
        <div>
          <span style={boldStyle}>Cart Items:</span> {cartStore.totalItems}
        </div>
        <div>
          <span style={boldStyle}>Total Value:</span> ${cartStore.totalValue}
        </div>
      </div>
    );
  }
}

export default observer(Footer);
