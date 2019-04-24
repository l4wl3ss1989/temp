import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

// Change to statless later!***

class Checkout extends Component {

    checkoutCancelledHandled = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandled = () => {
        this.props.history.replace('/checkout/contact-data');
    }
    
    render() {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.props.storedIngredients}
                    onCheckoutCancelled={this.checkoutCancelledHandled}
                    onCheckoutContinued={this.checkoutContinuedHandled}              
                />
                <Route 
                    path={`${this.props.match.path}/contact-data`} 
                    //render={(props) => <ContactData ingredients={this.state.ingredients} price={this.props.storedTotalPrice} {...props} /> }
                    component = {ContactData}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        storedIngredients: state.burger.ingredients
    }
}

export default connect(mapStateToProps)(Checkout);