export const getError = ({ dirty, error, active, submitFailed }) => {
  return (dirty || submitFailed) && !active && error;
};
