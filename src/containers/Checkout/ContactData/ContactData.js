import React, { Component } from "react";

import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.css";
import Input from "../../../components/UI/Input/Input";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          require: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          require: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Zip Code'
        },
        value: '',
        validation: {
          require: true,
          minLenght: 5,
          maxLength: 5
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          require: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your email'
        },
        value: '',
        validation: {
          require: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [ 
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
          ]
        },
        validation: {},
        value: '',
        valid: true
      }
    },
    formIsValid: false,
    loading: false
  };

  orderHandler = (event) => {
    event.preventDefault();
    console.log(this.props.ingredients); 
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    };
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
    };
    axios
      .post("/orders.json", order)
      .then((response) => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid; 
    }

    if (rules.minLenght) {
      isValid = value.length >= rules.minLenght && isValid;
    }

    if (rules.maxLenght) {
      isValid = value.length >= rules.maxLenght && isValid;
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
      const updatedOrderForm = {
        ...this.state.orderForm
      };
      const updateFormElement = {
        ...updatedOrderForm[inputIdentifier]
      };
      updateFormElement.value = event.target.value;
      updateFormElement.valid = this.checkValidity(updateFormElement.value, updateFormElement.validation);
      updateFormElement.touched = true;
      updatedOrderForm[inputIdentifier] = updateFormElement;
     
      let formIsValid = true;
      for (let inputIdentifier in updatedOrderForm){
        formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
      }

      this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})
  } 

  render() {
    const formElementArray = [];
    for ( let key in this.state.orderForm) {
      formElementArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
      {
        formElementArray.map(formElemet => (
          <Input 
            key={formElemet.id}
            elementType={formElemet.config.elementType}
            elementConfig={formElemet.config.elementConfig}
            value={formElemet.config.value}
            invalid={!formElemet.config.valid}
            shouldValidate={formElemet.config.validation}
            touched={formElemet.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElemet.id)}  />
        ))
      }
        
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>)
    if (this.state.loading) {
        form = <Spinner></Spinner>
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
