import React, {Component} from 'react';

import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
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

  deleteBookingHandler = bookingId => {
    this.setState({isLoading:true});
    const requestBody = {
      query:`
        mutation{
          cancelBooking(bookingId:"${bookingId}"){
            _id
            title
            creator{
              _id
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
      this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(booking =>{
          return booking._id !== bookingId;
        })
        return {bookings:updatedBookings, isLoading:false};
      })
    }).catch(err => {
      console.log(err);
      this.setState({isLoading:false});
    });
  }

  render(){
    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner/> :
          <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}/>
        }
      </React.Fragment>
    )
  }
}

export default BookingsPage;
