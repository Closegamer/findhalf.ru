import React, { Component } from "react";
import { MDBRow, MDBContainer, MDBCol } from "mdbreact";
import ProfileForm from "./profileForm";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as usersActions from "../../ducks/users";
import FreeKassa from "./freeKassa";
export class Profile extends Component {
  handleSubmit = values => {
    const user = values.user;
    const phone = values.phone;
    const address = values.address;
    // console.log("handle: ", user, phone, address);
    this.props.usersActions.updateUser(user, phone, address);
    this.props.history.push("/");
  };

  render() {
    const { isLoggedIn, user, userLoadingInProgress } = this.props;

    if (userLoadingInProgress) return <div>спинер</div>;

    let initialValues = null;

    if (isLoggedIn) {
      initialValues = {
        user: user.nick,
        email: user.email,
        phone: user.phone,
        address: user.address
      };
    } else {
      initialValues = {};
    }

    return (
      <MDBContainer className="admin-cont" fluid>
        <MDBRow>
          <MDBCol xl="12" xs="12" className="contentArea-container">
            <h3>Профиль пользователя</h3>
            <br />
            <br />
            <MDBRow>
              <MDBCol xl="6" sm="6" md="6" xs="12">
                <h5>Данные пользователя</h5>
                <ProfileForm
                  onSubmit={this.handleSubmit}
                  user={user}
                  isLoggedIn={isLoggedIn}
                  initialValues={initialValues}
                />
              </MDBCol>
              <MDBCol xl="6" sm="6" md="6" xs="12">
                <h5>Пополнить баланс</h5>
                {/* <FreeKassa /> */}
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isLoggedIn: auth.isLoggedIn,
  user: auth.user,
  userLoadingInProgress: auth.userLoadingInProgress
});

const mapDispatchToProps = dispatch => ({
  usersActions: bindActionCreators({ ...usersActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
