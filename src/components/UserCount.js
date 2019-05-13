import React, { Component} from 'react'
// import '../styles/TravellerCount.css'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const ALL_USERS_COUNT = gql`
    query allUsersCount {
        _allUsersMeta {
            count
        }
    }
`;

class UserCount extends Component {

  render() {

    if (this.props.allUsersCountQuery.loading) {
      return <div>Loading Users...</div>
    }

    return (
      <div className='UserCount'>
        <div className='UserCountNumber'>{this.props.allUsersCountQuery._allUsersMeta.count} users were here</div>
      </div>
    )
  }

}

export default graphql(ALL_USERS_COUNT, {name: "allUsersCountQuery"}) (UserCount)
