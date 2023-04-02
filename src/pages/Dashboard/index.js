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
    const [chart, setChart] = useState([]);
    const [saveData, setSaveData] = useState([['Task', 'Hours per Day']]);
    const apigetcards = '/AppFood/getdashboardcards.php';
    const apigetchart = '/AppFood/getdashboardchart.php';
    // useEffect to call api card and chart
    const fetchData = useCallback(() => {
        Promise.all([axios.get(apigetcards), axios.get(apigetchart)])
            .then((response) => {
                const data1 = response[0].data;
                const data2 = response[1].data;
                setInfor(data1.result);
                setChart(data2.result);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [apigetcards, apigetchart]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    // useEffect to xu li lai chart
    useEffect(() => {
        if (!chart || saveData.length > 1) return;
        setSaveData((prev) => {
            return [...prev, ...chart.map((obj) => [obj.name, Number(obj.quantity)])];
        });
    }, [chart]);
    // Options của Chart
    const options = {
        title: 'Number of products by category',
        titleTextStyle: {
            fontSize: 24,
        },
        pieHole: 0.4,
        colors: ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099'],
    };
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
                {saveData && (
                    <Chart chartType="PieChart" data={saveData} options={options} width="100%" height="520px" />
                )}
            </div>
        </div>
    );
}

export default DashBoard;
