import { Meteor } from 'meteor/meteor';

import { startSubscription } from 'meteor-redux-middlewares';
import Weather from '../../api/weather.js'
import Runs from '../../api/runs.js'

let mostRecent = {};

export const WEATHER_SUBSCRIPTION_READY = 'WEATHER_SUBSCRIPTION_READY';
export const WEATHER_SUBSCRIPTION_CHANGED = 'WEATHER_SUBSCRIPTION_CHANGED';
export const WEATHER_SUB = 'weather';

export const RUNS_SUBSCRIPTION_READY = 'RUNS_SUBSCRIPTION_READY';
export const RUNS_SUBSCRIPTION_CHANGED = 'RUNS_SUBSCRIPTION_CHANGED';
export const RUNS_SUB = 'runs';
export const ADD_EVENT = 'ADD_EVENT'
export const RENAME_EVENT = 'RENAME_EVENT'
export const DRAG_EVENT = 'DRAG_EVENT'

export const loadWeatherEvents = () =>
// do not put console.log here, it causes a semi-cryptic error
  startSubscription({
    key: WEATHER_SUB,
    get: () => Weather.find().fetch(), // find should recieve a location
    subscribe: () => Meteor.subscribe(WEATHER_SUB),
  });

export const loadRunEvents = () =>
// do not put console.log here, it causes a semi-cryptic error
  startSubscription({
    key: RUNS_SUB,
    get: () => Runs.find().fetch(), // find should recieve a user
    subscribe: () => Meteor.subscribe(RUNS_SUB),
  });

export const addWeatherData = content => {
  return {
    type: 'ADD_WEATHER_DATA',
    content
  };
};

export const addRunData = runData => {
  return {
    type: 'ADD_RUN',
    runData
  };
};

export const changePage = pageName => {
  return {
    type: 'CHANGE_PAGE',
    pageName
  };
};

export const toggleEventEditor = (toggle, calendarEvent) => {
  return {
    type: 'TOGGLE_EDITOR',
    payload: {
      toggle,
      calendarEvent
    }
  };
};

const getDayCountIndex = (run, format) => {
  let offset;
  if (format === 'WEEK') {
    offset = 6;
  }
  const start = moment().subtract(offset,'days');
  const difference = moment(run.start).diff(start, 'days')
  return difference+1;
}

const orgainizeData = (data, format) => {
  let sorted = [];
  let runCount = 0;
  let dayCount = 0;

  let date = null;
  let month = null;

  data.forEach(function (run) {
    if ((date === null && month === null) || !(date === run.start.getDate() && month === run.start.getMonth())) {
      console.log('hi')
      runCount = 0;

      dayCount = getDayCountIndex(run, format)

      date = run.start.getDate();
      month = run.start.getMonth();
    }
    
    if (!sorted[runCount]){
      sorted[runCount] = [];
    }

    sorted[runCount][dayCount] = run;
    runCount++;
  })

  console.log(sorted)
  sorted.forEach(function (runSet) {
    for (let i = 0; i < sorted[0].length; i++) {
      if (!runSet[i])
        runSet[i] = null;
    }
  })
  return sorted;
}

export const getHistoryChartData = (data) => {
  let format = 'WEEK';
  return {
    type: 'GET_HISTORY',
    format: format,
    data: orgainizeData(data, format)
  }
}

export const historyInfo = period => {
  return {
    type: 'HISTORY_INFO',
    period: period
  }
}

export const dragEvent = calendarEvent => {
  return {
    type: DRAG_EVENT,
    calendarEvent
  };
};

export const addEvent = calendarEvent => {
  return {
    type: ADD_EVENT,
    calendarEvent
  };
}

export const renameEvent = (id, newName) => {
  return {
    type: 'RENAME_EVENT',
    id,
    newName
  };
}

export const getNextRun = calendarEvents => {
  return {
    type: 'NEXT_RUN',
    calendarEvents,
    mostRecent
  };
}

// import { withTracker } from 'meteor/react-meteor-data';
//
// const AccountContext = React.createContext('account');
//
// export const withAccount = withTracker((props) => {
//   const user = Meteor.isServer ? null : Meteor.user()
//   const userId = Meteor.isServer ? null : Meteor.userId()
//   return { account: {
//     user,
//     userId,
//     isLoggedIn: !!userId
//   } }
// })
