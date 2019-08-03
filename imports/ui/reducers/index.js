import React from 'react';
import { combineReducers } from 'redux';
import { weatherReducerMiddleware, calendarEventsReducer } from './calendarEventsReducer';
import { preferencesEventsReducer } from './preferencesEventsReducer';

  const weatherReducer = (weather, action) => {
    weather = weather || {};
  	if (action.type === 'ADD_WEATHER_DATA') {
      let newState = action.content;
      weather = newState;
  	}
  	return weather
  };

  const formDataReducer = (currentResponses, action) => {
    currentResponses = currentResponses || [];
  	if (action.type === 'ADD_RESPONSE') {
      let newResponse = action.formData;
      console.log('cur responses')
      console.log(currentResponses);
      return [...currentResponses, newResponse
              ]
  	}
    return currentResponses;
  };

const nextRunReducer = (nextRun, action) => {
  nextRun = nextRun || {};
  if (action.type === 'NEXT_RUN') {
    // console.log("get next run");
    let now = moment();
    // console.log(action.calendarEvents);
    if (action.calendarEvents) {
      let events = action.calendarEvents.filter(calendarEvent => {
        // console.log(calendarEvent);
        return (calendarEvent.category === 'run') && (calendarEvent.start > now)
      })
    // action.mostRecent = {};
    if (events.length > 0) {
        nextRun = events[0];
        // console.log(events);
        for (let entry of events) {
          if (entry.start < action.mostRecent.start)
            nextRun = entry;
        }
      }
    }
  }
  // console.log(nextRun);
  return nextRun;
}
/*
const runDataReducer = (currentRuns, action) => {
  currentRuns = currentRuns || {};
	if (action.type === 'ADD_RUN') {
    let newRun = {
      user_id: action.runData.user_id,
      calendar_id: action.runData.calendar_id,
      calendar_date: action.runData.calendar_date,
      calendar_start: action.runData.calendar_start,
      calendar_end: action.runData.calendar_end,
      calendar_title: action.runData.calendar_title,
      expectedDuration: action.runData.expectedDuration,
      actualDuration: 0,
      distance: action.runData.distance};
	}
  return [...currentRuns, newRun
          ]
};
*/

const pagesReducer = (currentPage = 'home', action) => {
	if (action.type === 'CHANGE_PAGE') {
    currentPage = action.pageName;
	}
	return currentPage
};

const eventEditorReducer = (editEventView, action) => {
  editEventView = editEventView || {editorView: false, calendarEvent: ""};
  if (action.type === 'TOGGLE_EDITOR') {
    const newState = {
      editorView: action.payload.toggle,
      calendarEvent: action.payload.calendarEvent
    }
    // console.log(newState);
    return newState;
  }
  // console.log(editEventView);
  return editEventView;
};

const currentDate = new Date();
const dateDayToWeekDay = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
let currentChartFormat = '';
let historyData = [];

const getHistoryInfoReducer = (info = [], action) => {
  if (action.type === 'HISTORY_INFO') {
    let runList = historyData;
    let newInfo = [];
    runList.forEach(function (list) {
      run = list[action.period]
      if (run !== null) {
        newInfo.push(run);
      }
    })
    return newInfo;
  } else if (action.type === 'GET_HISTORY')
    info = [];
  return info;
}

// add get pref reducer for 'GET_PREFERENCES'
const getPreferencesReducer = (info = [], action) => {
  if (action.type === 'GET_HISTORY')
    info = [];
  return info;
}

const runHistoryDataReducer = (data = {}, action) => {
  if (action.type === 'GET_HISTORY') {
    // let barColors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'indigo']
    currentChartFormat = action.format;

    let labels = [];
    let numDays;
    let i;
    if (action.format === 'WEEK') {
      numDays = 6

      let day = new Date();
      day.setDate(currentDate.getDate()-numDays);

      for (i = 0; i <= numDays; i++){
        labels[i] = dateDayToWeekDay[day.getDay()]+' '+(day.getMonth()+1)+'/'+day.getDate();
        day.setDate(day.getDate()+1);
      }
    }
    // else if (action.format === 'DAY'){}
    // else if (action.format === 'MONTH') {}

    //let datasets = [];
    historyData = action.data;
    let runList = historyData;

    console.log(historyData);

    // for (i = 0; i < runList.length; i++){
    //   let distances = [];
    //   let list = runList[i]
    //   for (let j = 0; j < list.length; j++) {
    //     let run = list[j];
    //     if (run === null) {
    //       distances[j] = 0
    //     } else
    //       distances[j] = run.distance;
    //   }
    //   datasets[i] = {
    //     label: 'Run #'+(i+1),
    //     backgroundColor: 'rgba(75, 75, 192, 0.4)',//barColors[i%barColors.length],
    //     data: distances
    //   }
    // }

    let distances = [];
    runList.forEach(function (list) {
      for (i = 0; i < list.length; i++) {
        let run = list[i];
        if (!distances[i])
          distances[i] = 0;
        distances[i] += (run) ? run.distance : 0;
      }
    })
    console.log(distances);
    let datasets = [
      {
        label: 'Distance (km)',
        backgroundColor: 'rgba(25, 25, 62, 0.8)',
        data: distances
      }
    ]

    data = {
      labels: labels,
      datasets: datasets
    }
  }
  return data;
}



export default combineReducers({
	//user_input: userInputReducer,
  weather: weatherReducer,
  weatherMiddleware: weatherReducerMiddleware,
  formData: formDataReducer,
  preferences: preferencesEventsReducer,
  calendar: calendarEventsReducer,
  nextRun: nextRunReducer,
  pages: pagesReducer,
  runHistory: runHistoryDataReducer,
  historyInfo: getHistoryInfoReducer,
  editEventView: eventEditorReducer
});
