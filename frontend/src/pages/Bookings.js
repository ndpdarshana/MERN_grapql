import React, {Component} from 'react';

import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingControls from '../components/Bookings/BookingControls/BookingControls';
import AuthContext from '../context/auth-context';

class BookingsPage extends Component{
  state = {
    isLoading:false,
    bookings:[],
    outputType:'list'
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
              price
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
        mutation CancelBooking($bookingId: ID!){
          cancelBooking(bookingId:$bookingId){
            _id
            title
            creator{
              _id
            }
          }
        }
      `,
      variables: {
        bookingId:bookingId
      }
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

  changeOutputTypeHandler = outputType => {
    if(outputType === 'list'){
      this.setState({outputType:'list'});
    }else{
      this.setState({outputType:'chart'})
    }
  }

  render(){
    let content = <Spinner/>
    if(!this.state.isLoading){
      content = (
        <React.Fragment>
          <BookingControls
            activeOutputType={this.state.outputType}
            onChange={this.changeOutputTypeHandler}/>

          <div>
            {this.state.outputType === 'list' ? (
                <BookingList
                  bookings={this.state.bookings}
                  onDelete={this.deleteBookingHandler}/>
              ):(
                <BookingsChart bookings={this.state.bookings}/>
              )}
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    )
  }
}

export default BookingsPage;
