const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader(eventIds => events(eventIds));

const userLoader = new DataLoader(userIds => {
  console.log(userIds);
  return User.find({_id:{$in:userIds}});
});

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event._doc._id.toString(),
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id:booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  }
}

const user = async userId => {
  try{
  const user = await userLoader.load(userId.toString());
  return {
      ...user._doc,
      _id:user.id,
      createdEvents: eventLoader.load.bind(this, user._doc.createdEvents)
    };
  }catch(err){
    throw err;
  }
}

const events = async eventIds => {
  try{
    const events = await Event.find({_id: {$in: eventIds}});
    return events.map(event => {
        return transformEvent(event);
      });
  }catch(err){
    throw err;
  }
}

const singleEvent = async eventId => {
  try{
    console.log(eventLoader);
    const singleEvent = await eventLoader.load(eventId.toString());
    // const singleEvent = await Event.findById(eventId);
    return singleEvent;
  }catch(err){
    throw err;
  }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
