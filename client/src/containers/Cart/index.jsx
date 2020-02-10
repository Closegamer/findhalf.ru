import React, { Component } from "react";
import { MDBRow, MDBContainer, MDBCol } from "mdbreact";
import CartComponent from "./CartComponent";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as usersActions from "../../ducks/users";

export class Cart extends Component {
  render() {
    return (
      <MDBContainer className="admin-cont" fluid>
        <MDBRow>
          <MDBCol xl="12" xs="12" className="contentArea-container">
            <h3>Корзина</h3>
            <br />
            <br />
            <MDBRow>
              <MDBCol xl="6" sm="6" md="6" xs="12">
                <h5>Выбранные товары</h5>
                <CartComponent />
              </MDBCol>
              <MDBCol xl="6" sm="6" md="6" xs="12">
                <h5>Пополнить баланс</h5>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Cart;
