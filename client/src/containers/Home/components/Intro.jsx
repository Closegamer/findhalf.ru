import React from 'react';
import {
  MDBView,
  MDBMask,
  MDBContainer,
  MDBRow,
  MDBBtn,
  MDBCol,
  MDBAnimation
} from 'mdbreact';
import classNames from 'classnames';
import injectSheet from 'react-jss';

import PionImg from '../../../img/intro.png';
import PionBg from '../../../img/intro_bg.jpg';

const Intro = ({ classes }) => {
  return (
    <div>
      <MDBView className={classes.view}>
        <MDBMask className='d-flex justify-content-center align-items-center purple-gradient2'>
          <MDBContainer>
            <MDBRow>
              <div className='white-text text-center text-md-left col-md-6 mt-xl-5'>
                <MDBAnimation type='fadeInLeft'>
                  <h1 className='h1-responsive mt-5 pt-5 mt-md-2 pt-md-0'>
                    Школа шокофлористики{' '}
                  </h1>
                  <hr className='hr-light' />
                  <h6 className={classNames('mb-4', classes.h6)}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Rem repellendus quasi fuga nesciunt dolorum nulla magnam
                    veniam sapiente, fugiat! Commodi sequi non animi ea dolor
                    molestiae iste.
                  </h6>
                  <MDBBtn color='white'>Download</MDBBtn>
                  <MDBBtn outline color='white'>
                    Learn More
                  </MDBBtn>
                </MDBAnimation>
              </div>
              <MDBCol
                md='6'
                xl='5'
                className='mt-xl-5 col-8 offset-2 offset-md-0'
              >
                <MDBAnimation type='fadeInRight'>
                  <img src={PionImg} alt='' className='img-fluid' />
                </MDBAnimation>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBMask>
      </MDBView>
    </div>
  );
};

const styles = {
  view: {
    backgroundImage: `url('${PionBg}')`,
    //backgroundColor: 'red',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    height: 'calc(100vh - 60px)'
  },
  h6: {
    lineHeight: 1.6
  }
};

export default injectSheet(styles)(Intro);
