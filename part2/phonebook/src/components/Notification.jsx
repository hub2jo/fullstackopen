const Notification = ({ error, message }) => {
  const noticeStyle = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  const noticeStyleRed = Object.assign({}, noticeStyle, {color: 'red'});
  const noticeStyleGreen = Object.assign({}, noticeStyle, {color: 'green'});

  if (message === null) {
    return null
  } else if (error) {
    return (
      <div style={noticeStyleRed}>
        {message}
      </div>
    )
  } else {
    return (
      <div style={noticeStyleGreen}>
        {message}
      </div>
    )
  }   
}

export default Notification