import React, { Component } from "react";
import { MDBRow, MDBContainer, MDBCol, MDBNavLink } from "mdbreact";
import "./styles.css";

export class Thanks extends Component {
  render() {
    return (
      <MDBContainer className="admin-cont" fluid>
        <MDBRow>
          <MDBCol xl="12" xs="12" className="contentArea-container text-center">
            <h3>Спасибо! Оплата прошла успешно!</h3>
            <br />
            <MDBNavLink to="/">
              <div className="d-none d-md-inline">Скидки</div>
            </MDBNavLink>
            <br />
            <MDBNavLink to="/shop">
              <div className="d-none d-md-inline">Магазин</div>
            </MDBNavLink>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Thanks;
