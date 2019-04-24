import React, { Component } from 'react';
import axios from '../../axios.orders';
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions';
import {INGREDIENT_PRICES, BASE_BURGER_PRICE} from '../../configurations/Burger/BurgerConfig';
import Auxiliar from '../../hoc/Auxiliar/Auxilar';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';



class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        console.log(this.props)
        // axios.get(`https://react-my-burger-21def.firebaseio.com/ingredients.json`)
        // .then(response => {
        //     this.setState({ingredients: response.data})
        // })
        // .catch(error =>{
        //     this.setState({error: true})
        // })
    }

    updatePurchaseState (ingredients) {
        // const ingredients = {
        //     ...this.state.ingredients
        // };
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        return sum > 0;
        //this.setState({purchasable: sum > 0});
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    render() {
        const diabledInfo = {
            ...this.props.storedIngredients
        };
        for (let key in diabledInfo) {
            diabledInfo[key] = diabledInfo[key] <= 0;
        }
        let orderSummary = null;               
        let burger = this.state.error ? <p>Ingredients con't be loaded</p> : < Spinner />;
        
        if (this.props.storedIngredients) {
            burger = (
                <Auxiliar>
                    <Burger ingredients={this.props.storedIngredients} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={diabledInfo}
                        purchasable={this.updatePurchaseState(this.props.storedIngredients)}
                        ordered={this.purchaseHandler}
                        price={this.props.storedTotalPrice}
                    />
                </Auxiliar>
            );
            orderSummary = <OrderSummary ingredients={this.props.storedIngredients}
            price={this.props.storedTotalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>;
        }

        if(this.state.loading) {
            orderSummary = <Spinner />;
        }
        
        return (
            <Auxiliar>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliar>
        );
    }
}

const mapStateToProps = state => {
    return {
        storedIngredients: state.burger.ingredients,
        storedTotalPrice: state.burger.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));