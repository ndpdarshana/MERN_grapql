const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');


const user = async userId => {
  try{
  const user = await User.findById(userId);
  return {
      ...user._doc,
      _id:user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  }catch(err){
    throw err;
  }
}

const events = async eventIds => {
  try{
    const events = await Event.find({_id: {$in: eventIds}});
    events.map(event => {
        return {
          ...event._doc,
          _id:event.id,
          date: new Date(event._doc.date).toISOString(),
          creator:user.bind(this, event.creator)
        };
      });
      return events;
  }catch(err){
    throw err;
  }
}

module.exports = {
    events: () => {
      return Event.find()
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            _id: event._doc._id.toString(),
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator)
          };
        })
      }).catch(err => {
        throw err;
      })
    },
    createEvent: (args) => {
      let createdEvent = "";
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5e6f3de3f329701600697b02'
      });
      return event
        .save()
        .then(result => {
          createdEvent = {
            ...result._doc,
            _id:result._doc._id.toString(),
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, result._doc.creator)
          };
          return User.findById('5e6f3de3f329701600697b02')
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
    },
    createUser: args => {
      return User.findOne({email:args.userInput.email})
        .then(user => {
          if(user) {
            throw new Error('User exists already.');
          }
          return bcrypt.hash(args.userInput.password, 12);
        }).then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });
          return user.save().then(result => {
            return {...result._doc, password: null, _id:result.id}
          }).catch(err => {
            throw err;
          });
        }).catch(err => {
          throw err;
        });
    }
  };
