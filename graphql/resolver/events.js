const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const { transformEvent } = require('./merge');

module.exports = {
    events: () => {
      return Event.find()
      .then(events => {
        return events.map(event => {
          return transformEvent(event);
        });
      }).catch(err => {
        throw err;
      })
    },
    createEvent: (args, req) => {
      if(!req.isAuth){
        throw new Error('Unauthenticated!');
      }
      let createdEvent = "";
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: req.userId
      });
      return event
        .save()
        .then(result => {
          createdEvent = transformEvent(result);
          return User.findById(req.userId)
        })
        .then(user => {
          if(!user){
            throw new Error("User doesn't exixts.")
          }
          user.createdEvents.push(event);
          return user.save();
        })
        .then(result => {
          return createdEvent;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    }
  };
