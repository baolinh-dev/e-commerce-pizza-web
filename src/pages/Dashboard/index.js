import CardInfor from './CardInfor';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { Chart } from 'react-google-charts';
import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';

var cx = classNames.bind(styles);

function DashBoard() {
    // useState
    const [data, setData] = useState({
        infor: [],
        pieChart: [['Task', 'Hours per Day']],
        lineChart: [['Ngày', 'Tổng tiền']],
        columnChart: [['Tháng', 'Tổng tiền']],
    });

    // API URLs
    const API_GET_CARDS = '/AppFood/getdashboardcards.php';
    const API_GET_PIE_CHART = '/AppFood/getdashboard_piechart.php';
    const API_GET_LINE_CHART = '/AppFood/getdashboard_linechart.php';
    const API_GET_COLUMN_CHART = '/AppFood/getdashboard_columnchart.php';

    // functions
    const fetchData = useCallback(() => {
        Promise.all([
            axios.get(API_GET_CARDS),
            axios.get(API_GET_PIE_CHART),
            axios.get(API_GET_LINE_CHART),
            axios.get(API_GET_COLUMN_CHART),
        ])
            .then((responses) => {
                setData((prevData) => ({
                    ...prevData,
                    infor: responses[0].data.result,
                    pieChart: [
                        ['Task', 'Hours per Day'],
                        ...responses[1].data.result.map((obj) => [obj.name, Number(obj.quantity)]),
                    ],
                    lineChart: [['Ngày', 'Tổng tiền'], ...formatDataLineChart(responses[2].data.result)],
                    columnChart: [
                        ['Tháng', 'Tổng tiền'],
                        ...responses[3].data.result.map((arr) => [arr[0], Number(arr[1])]),
                    ],
                }));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [API_GET_CARDS, API_GET_PIE_CHART, API_GET_LINE_CHART, API_GET_COLUMN_CHART]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // functions to prepare data for charts
    function formatDataLineChart(dataLineChart) {
        const processedData = dataLineChart
            .slice(1)
            .reduce((result, current) => {
                const date = current[0];
                const amount = current[1];
                const existingItem = result.find((item) => item[0] === date);
                if (!existingItem) {
                    result.push([date, amount]);
                } else {
                    existingItem[1] += amount;
                }
                return result;
            }, [])
            .sort((a, b) => new Date(a[0]) - new Date(b[0]));

        return processedData;
    }

    // Render UI
    return (
        <div className={cx('dashboard')}>
            <div className={cx('card-infor')}>
                {data.infor.map((item, index) => (
                    <div key={index} className={cx('card-wrapper')}>
                        <CardInfor quantity={item.quantity} name={item.name} icon={item.icon} />
                    </div>
                ))}
            </div>
            <div className="charts">
                <div className={cx('row')}>
                    <Chart
                        chartType="PieChart"
                        data={data.pieChart}
                        options={{
                            title: 'Số lượng sản phẩm theo danh mục',
                            titleTextStyle: {
                                fontSize: 14,
                            },
                            pieHole: 0.4,
                            colors: ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099'],
                        }}
                        width="100%"
                        height="400px"
                    />
                    <Chart
                        chartType="ColumnChart"
                        data={data.columnChart}
                        options={{
                            title: 'Tổng tiền theo từng tháng',
                            chartArea: { width: '50%' },
                            hAxis: {
                                title: 'Tháng',
                                minValue: 0,
                            },
                            vAxis: {
                                title: 'Tổng tiền',
                            },
                        }}
                        width="100%"
                        height="400px"
                    />
                </div>
                <Chart
                    data={data.lineChart}
                    chartType="LineChart"
                    options={{
                        title: 'Tổng tiền theo ngày',
                        hAxis: {
                            title: 'Ngày',
                        },
                        vAxis: {
                            title: 'Tổng tiền',
                        },
                        series: {
                            0: { curveType: 'function' },
                        },
                    }}
                    width="100%"
                    height="400px"
                />
            </div>
        </div>
    );
}

export default DashBoard;
