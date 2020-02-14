import React from "react";
import { MDBDatePicker } from "mdbreact";

import moment from "moment";
import "moment/locale/ru";

class DatePickerPage extends React.Component {
  getPickerValue = value => {
    console.log(value);
  };

  render() {
    return (
      <div>
        <MDBDatePicker
          cancelLabel="Отменить"
          locale={moment.locale("ru")}
          getValue={this.getPickerValue}
        />
      </div>
    );
  }
}

export default DatePickerPage;
