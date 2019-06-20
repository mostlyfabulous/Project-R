import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { getHistoryChartData, historyInfo } from './actions/index';
import { connect } from 'react-redux';

class HistoryChart extends React.Component {
    componentDidMount() {
        this.props.getHistoryChartData();
    }
    handleClick(elems) {
        if (elems.length !== 0){
            console.log(elems[0]._index);
            this.props.historyInfo(elems[0]._index);
        }
    }
    render() {
        return (
            <div>
                <Bar
                    data={this.props.data}
                    onElementsClick={elems => this.handleClick(elems)}
                    options={{
                        
                        maintainAspectRatio: true,
                        scales: {
                            xAxes: [{
                                label: 'Day',
                                griLines: {
                                    display: false
                                }
                            }],
                            yAxes: [{
                                label: 'km',
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }}
                />
          </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.runHistory
    }
}

export default connect(mapStateToProps, {getHistoryChartData, historyInfo}) (HistoryChart);