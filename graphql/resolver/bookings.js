const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (args, req) => {
      if(!req.isAuth){
        throw new Error('Unauthenticated');
      }
      try{
        const bookings = await Booking.find();
        return bookings.map(booking => {
          return transformBooking(booking);
        })
      }catch(err){
        throw err;
      }
    },
    bookEvent: async (args, req) => {
      if(!req.isAuth){
        throw new Error('Unauthenticated');
      }
      const fetchedEvent = await Event.findOne({_id: args.eventId})
      const booking = new Booking({
        user: '5e6f3de3f329701600697b02',
        event: fetchedEvent
      });
      const result = await booking.save();
      return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
      if(!req.isAuth){
        throw new Error('Unauthenticated');
      }
      try{
        const booking = await Booking.findById(args.bookingId).populate('event');
        const event = transformEvent(booking.event);
        await Booking.deleteOne({_id:args.bookingId});
        return event;
      }catch(err){
        throw err;
      }
    }
  };
