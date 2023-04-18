import PropTypes from "prop-types"

const Notification = ({ message, errorType }) => {
  if (message === null) {
    return null
  }

  const errorStyle = {
    color: errorType,
    background: "lightgray",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div id="error-message" style={errorStyle}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  errorType: PropTypes.string.isRequired
}

export default Notification