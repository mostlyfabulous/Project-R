import React from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import ApiCalendar from '../../../utils/ApiCalendar.js';
import { addGoogleEvent, clearGoogleEvents } from '../../actions/index';

import { Button } from 'reactstrap';

class GoogleCalendarHandler extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          sign: ApiCalendar.sign,
          events: []
        };
        this.signUpdate       = this.signUpdate.bind(this);
        this.handleItemClick  = this.handleItemClick.bind(this);
        this.loadGoogleEvents  = this.loadGoogleEvents.bind(this);
      }

      signUpdate(sign) {
        this.setState({
            sign // seems to set state correctly
          });
        }

      loadGoogleEvents(events) {
        let gEvents = events.map( (event) => {
          let e = {
            id: event.id,
            title: event.summary,
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
            color: 'cadetblue',
            category: 'GoogleCalendar',
            editable: false,
          }
          return e;
        });
        this.props.addGoogleEvent(gEvents);
      }

      handleItemClick(e, name) {
        let rootThis = this;
        if (name === 'sign-in') {
          ApiCalendar.handleAuthClick();
          ApiCalendar.listenSign(this.signUpdate);
        } else if (name === 'sign-out') {
          ApiCalendar.handleSignoutClick();
          ApiCalendar.listenSign(this.signUpdate);
          rootThis.props.clearGoogleEvents();
        } else if (name === 'fetch Google Calendar Events') {
          // manual fetch button as state change not detected
          ApiCalendar.listUpcomingEvents(30)
          .then( ({result}) => {
            rootThis.loadGoogleEvents(result.items);
          });
        }
      }

      render() {
        return (
            <div>
            <i className="google icon"></i> Calendar:&nbsp;
                <Button
                    onClick={(e) => this.handleItemClick(e, 'sign-in')}
                >
                  sign-in
                </Button>
                <Button
                    onClick={(e) => this.handleItemClick(e, 'sign-out')}
                >
                  sign-out
                </Button>
                <Button
                    color="warning"
                    onClick={(e) => this.handleItemClick(e, 'fetch Google Calendar Events')}
                >
                  fetch Google Calendar events
                </Button>
            </div>
          );
        }
  }

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addGoogleEvent,
      clearGoogleEvents,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(GoogleCalendarHandler);
