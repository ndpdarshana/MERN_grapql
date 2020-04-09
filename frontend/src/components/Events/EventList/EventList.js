import React from 'react';

import './EventList.css';
import EventItem from './EventItem/EventItem';

const eventList = props => {
  const events = props.events.map(event => {
    return (
      <EventItem
        key={event._id}
        event={event}
        userId={props.authUserId}
        onDetails={props.onViewDetails}/>)
  })

  return (<ul className="events_list">
    {events}
  </ul>)
}

export default eventList;
