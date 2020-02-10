import React, { Component } from "react";
import { MDBRow, MDBContainer, MDBCol } from "mdbreact";

export class BannerFreeKassa extends Component {
  render() {
    return (
      <MDBContainer>
        <MDBRow>
          <MDBCol xl="12" xs="12" className="text-center">
            <a href="#">
              <img
                src="//www.free-kassa.ru/img/fk_btn/15.png"
                title="Бесплатный видеохостинг"
              />
            </a>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default BannerFreeKassa;
