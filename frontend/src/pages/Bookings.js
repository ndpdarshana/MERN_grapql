import React, {Component} from 'react';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';

class BookingsPage extends Component{
  state = {
    isLoading:false,
    bookings:[]
  };

  static contextType = AuthContext;

  componentDidMount(){
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({isLoading:true});
    const requestBody = {
      query:`
        query{
          bookings{
            _id
            createdAt
            event{
              _id
              title
              date
            }
          }
        }
      `
    }

    // const token = this.context.token;

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + this.context.token
      }
    }).then(res => {
      if(res.status !== 200 && res.status !==201){
        throw new Error('Failed status:' + res.status)
      }
      return res.json();
    }).then(resData => {
      this.setState(
        {
          bookings:resData.data.bookings,
          isLoading:false
        });
    }).catch(err => {
      console.log(err);
      this.setState({isLoading:false});
    });
  }

  render(){
    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner/> :
        (<ul>
          {this.state.bookings.map(booking => (
            <li key={booking._id}>{booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}</li>
          ))}
        </ul>)}
      </React.Fragment>
    )
  }
}

export default BookingsPage;
