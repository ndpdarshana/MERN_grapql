import React from 'react';

import './EventItem.css';

const eventItem = props =>(
  <li key={props.event._id} className="events_list-item">
    <div>
      <h1>{props.event.title}</h1>
      <h2>
        ${props.event.price} - {new Date(props.event.date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      {props.userId !== props.event.creator._id ?
         (<button className="btn" onClick={props.onDetails.bind(this,props.event)}>View Details</button>) :
         (<p>You are the owner of this event</p>)
       }
    </div>
  </li>
)

export default eventItem;
