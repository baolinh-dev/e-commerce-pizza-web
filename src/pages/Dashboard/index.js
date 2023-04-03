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
    const [savePieData, setSavePieData] = useState([['Task', 'Hours per Day']]); 
    const [saveLineData, setSaveLineData] = useState([['Ngày', 'Tổng tiền']]);
    const apigetcards = '/AppFood/getdashboardcards.php';
    const apigetpiechart = '/AppFood/getdashboard_piechart.php'; 
    const apigetlinechart = '/AppFood/getdashboard_linechart.php'; 
    // useEffect to call api card and chart
    const fetchData = useCallback(() => {
        Promise.all([axios.get(apigetcards), axios.get(apigetpiechart), axios.get(apigetlinechart)])
            .then((response) => {
                const data1 = response[0].data;
                const data2 = response[1].data; 
                const data3 = response[2].data;
                setInfor(data1.result);
                setPieChart(data2.result); 
                setLineChart(data3.result);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [apigetcards, apigetpiechart, apigetlinechart]);
    // data của lineChart
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    // useEffect to xu li lai pie chart
    useEffect(() => {
        if (!pieChart || savePieData.length > 1) return;
        setSavePieData((prev) => {
            return [...prev, ...pieChart.map((obj) => [obj.name, Number(obj.quantity)])];
        });
    }, [pieChart]);  
    // ham sort ngay 
    function formatDataLineChart(dataLineChart) {
        const processedData = dataLineChart.slice(1)
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
    // useEffect to xu li lai line chart  
    useEffect(() => {
        if (!lineChart || saveLineData.length > 1) return;
        setSaveLineData((prev) => {
          return [...prev, ...lineChart.slice(1).map((arr) => [arr[0], Number(arr[1])])];
        });
      }, [lineChart]); 
    // Options của Chart
    const options = {
        title: 'Số lượng sản phẩm theo danh mục',
        titleTextStyle: {
            fontSize: 24,
        },
        pieHole: 0.4,
        colors: ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099'],
    }; 
    console.log(String(formatDataLineChart(saveLineData)));
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
                {savePieData && (
                    <Chart chartType="PieChart" data={savePieData} options={options} width="100%" height="520px" />
                )} 
                {
                    saveLineData && (
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
                    )
                }

            </div>
        </div>
    );
}

export default DashBoard;
