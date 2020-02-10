import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MDBNavLink, MDBBtn, MDBSpinner } from 'mdbreact';
import { bindActionCreators } from 'redux';
import * as usersActions from '../../../../ducks/users';
import '../../styles.css';

export class List extends Component {
  static propTypes = {};

  componentDidMount() {
    const { usersLoadedAt, actions } = this.props;
    if (!usersLoadedAt) {
      actions.loadUsers();
    }
  }

  render() {
    const { users, usersLoadingInProgress, usersLoadingError } = this.props;

    // console.log(this.props);

    if (!!usersLoadingError) return <div>{usersLoadingError}</div>;

    if (usersLoadingInProgress) return <MDBSpinner />;

    return (
      <React.Fragment>
        <div className='rightBordered'>
          <h3>Управление пользователями</h3>
          <br />
          <div
            className='btn-group btn-group-lg'
            role='group'
            aria-label='Games admin buttons'
          >
            <MDBNavLink to={`/admin/users/list`}>
              <MDBBtn color='unique' className='admin-buttons'>
                Все пользователи
              </MDBBtn>
            </MDBNavLink>
            <MDBNavLink to={`/admin/users/create`}>
              <MDBBtn color='unique' className='admin-buttons'>
                Создать
              </MDBBtn>
            </MDBNavLink>
            <MDBNavLink to={`/admin/users/edit`}>
              <MDBBtn color='unique' className='admin-buttons'>
                Редактировать
              </MDBBtn>
            </MDBNavLink>
            <MDBNavLink to={`/admin/users/block`}>
              <MDBBtn color='unique' className='admin-buttons'>
                Заблокировать
              </MDBBtn>
            </MDBNavLink>
          </div>
        </div>
        {!users[0] ? (
          <div>Нету</div>
        ) : (
          <div className='monitor-cont'>
            <h4>Все пользователи</h4>
            <table className='table table-striped text-center'>
              <thead>
                <tr>
                  <th scope='col'>Nick</th>
                  <th scope='col'>Email</th>
                  <th scope='col'>Role</th>
                  <th scope='col'>Balance</th>
                  <th scope='col'>Contribution</th>
                  <th scope='col'>Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td>{user.nick}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.balance}</td>
                      <td>{user.contribution}</td>
                      <td>{user.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ users }) => ({
  users: users.list,
  usersLoadingInProgress: users.usersLoadingInProgress,
  usersLoadingError: users.usersLoadingError,
  usersLoadedAt: users.usersLoadedAt
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...usersActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
