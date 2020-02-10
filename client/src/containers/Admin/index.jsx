import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gamesActions from '../../ducks/games';
import * as usersActions from '../../ducks/users';
import { Route, Switch } from 'react-router-dom';
import Games from './Games';
import Users from './Users';

import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBNavLink } from 'mdbreact';
import './styles.css';

const Lost = () => <div>404</div>;

export class Admin extends Component {
  render() {
    const { match } = this.props;

    return (
      <div className='mdb-skin'>
        <MDBContainer className={'admin-cont'} fluid>
          <MDBRow>
            <MDBCol>
              <h3>Админка - панель управления</h3>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol
              xs='12'
              sm='2'
              md='2'
              lg='2'
              xl='2'
              className='rightBordered'
            >
              <MDBNavLink to={`${match.path}/games`}>
                <MDBBtn color='unique' className='admin-buttons'>
                  Игры
                </MDBBtn>
              </MDBNavLink>
              <MDBNavLink to={`${match.path}/users`}>
                <MDBBtn color='unique' className='admin-buttons'>
                  Пользователи
                </MDBBtn>
              </MDBNavLink>
            </MDBCol>
            <MDBCol xs='12' sm='10' md='10' lg='10' xl='10'>
              <Switch>
                <Route path={`${match.path}/`} exact component={Games} />
                <Route path={`${match.path}/games`} component={Games} />
                {/* <Route path={`${match.path}/games/create`} component={Form} /> */}
                {/* <Route
                  path={`${match.path}/games/create/:id`}
                  component={Form}
                /> */}
                <Route path={`${match.path}/users`} component={Users} />
                <Route component={Lost} />
              </Switch>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

Admin.propTypes = {};

const mapStateToProps = ({ games, users }) => ({
  games: games.list,
  gamesLoadingInProgress: games.gamesLoadingInProgress,
  gamesLoadingError: games.gamesLoadingError,
  gameCreationInProgress: games.gameCreationInProgress,
  gameCreationError: games.gameCreationError,
  users: users.list,
  usersLoadingInProgress: users.usersLoadingInProgress,
  usersLoadingError: users.usersLoadingError
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...gamesActions, ...usersActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
