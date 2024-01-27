import React from 'react'

function user_options() {
  return (
    <div>user_options
    <form action="api/user/recs">
      <button type="submit">See Genres</button>
    </form>
    </div>
  )
}

export default user_options