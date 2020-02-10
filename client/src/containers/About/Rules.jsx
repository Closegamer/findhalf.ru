import React from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact';

const Rules = () => {
  return (
    <MDBContainer className={'about-cont'} fluid>
      <MDBRow>
        <MDBCol xs='12' sm='3' md='3' lg='3' xl='3'>
          <h3>Всякие правила</h3>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Rules;
