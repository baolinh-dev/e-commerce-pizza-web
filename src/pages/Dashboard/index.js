import CardInfor from './CardInfor';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { Chart } from 'react-google-charts';
import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
var cx = classNames.bind(styles);
function DashBoard() {
    // useState
    const [infor, setInfor] = useState([]);
    const [pieChart, setPieChart] = useState([]);
    const [lineChart, setLineChart] = useState([]);
    const [columnChart, setColumnChart] = useState([]);
    const [savePieData, setSavePieData] = useState([['Task', 'Hours per Day']]);
    const [saveLineData, setSaveLineData] = useState([['Ngày', 'Tổng tiền']]);
    const [saveColumnData, setSaveColumnData] = useState([['Tháng', 'Tổng tiền']]);
    const API_GET_CARDS = '/AppFood/getdashboardcards.php';
    const API_GET_PIE_CHART = '/AppFood/getdashboard_piechart.php';
    const API_GET_LINE_CHART = '/AppFood/getdashboard_linechart.php';
    const API_GET_COLUMN_CHART = '/AppFood/getdashboard_columnchart.php';
    // ham sort ngay
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

        return [['Ngày', 'Tổng tiền'], ...processedData];
    }
    // useEffect to call api card and chart
    const fetchData = useCallback(() => {
        Promise.all([
            axios.get(API_GET_CARDS),
            axios.get(API_GET_PIE_CHART),
            axios.get(API_GET_LINE_CHART),
            axios.get(API_GET_COLUMN_CHART),
        ])
            .then((response) => {
                const data1 = response[0].data;
                const data2 = response[1].data;
                const data3 = response[2].data;
                const data4 = response[3].data;
                setInfor(data1.result);
                setPieChart(data2.result);
                setLineChart(data3.result);
                setColumnChart(data4.result);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [API_GET_CARDS, API_GET_PIE_CHART, API_GET_LINE_CHART, API_GET_COLUMN_CHART]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    useEffect(() => {
        if (!pieChart || savePieData.length > 1) return;
        const newPieData = pieChart.map((obj) => [obj.name, Number(obj.quantity)]);
        setSavePieData((prev) => [...prev, ...newPieData]);
    }, [pieChart, savePieData]);

    useEffect(() => {
        if (!lineChart || saveLineData.length > 1) return;
        const newLineData = lineChart.map((arr) => [arr[0], Number(arr[1])]);
        setSaveLineData((prev) => [...prev, ...newLineData]);
    }, [lineChart, saveLineData]);

    useEffect(() => {
        if (!columnChart || saveColumnData.length > 1) return;
        const newColumnData = columnChart.map((arr) => [arr[0], Number(arr[1])]);
        setSaveColumnData((prev) => [...prev, ...newColumnData]);
    }, [columnChart, saveColumnData]);
    // Render UI
    return (
        <div className={cx('dashboard')}>
            <div className={cx('card-infor')}>
                {infor.map((item, index) => (
                    <div key={index} className={cx('card-wrapper')}>
                        <CardInfor quantity={item.quantity} name={item.name} icon={item.icon} />
                    </div>
                ))}
            </div>
            <div className="charts">
                <div className={cx('row')}>
                    {savePieData && (
                        <Chart
                            chartType="PieChart"
                            data={savePieData}
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
                    )}
                    {saveColumnData && (
                        <Chart
                            chartType="ColumnChart"
                            data={saveColumnData}
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
                    )}
                </div>

                {saveLineData && (
                    <Chart
                        data={formatDataLineChart(saveLineData)}
                        chartType="LineChart"
                        // data={dataLineChart}
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
                )}
            </div>
        </div>
    );
}

export default DashBoard;
