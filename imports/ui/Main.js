import React from 'react';
import Info from './Info.js';
import Calendar from './Calendar.js';

class Main extends React.Component {
    render() {
        return (
            <div className='body'>
                <div id='sideMenu'>
                    <Info/>
                </div>
                <div id='mainContent'>
                    <Calendar/>
                </div>
            </div>
        )
    }
}

export default Main;