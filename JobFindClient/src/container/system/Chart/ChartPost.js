import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import getSumByDateRange, { getSumByYearPost } from '../../../service/userService';
import Chart from 'chart.js/auto';
import { Col, Row, Select } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const { RangePicker } = DatePicker;

function ChartPost() {
    dayjs.extend(weekday);
    dayjs.extend(localeData);
    dayjs.extend(customParseFormat);


    const options = {
        legend: { display: false },
        title: {
          display: true,
          text: "Chart Post"
        }
    }
    const yearOptions = [
        {
            value: 2025,
            label: '2025'
        },
        {
            value: 2021,
            label: '2021'
        },
        {
            value: 2020,
            label: '2020'
        },
    ]
    const defaultMonthModel = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0
      };
      const labelsMonth = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];

    const [data,setData] = useState({
        labels: labelsMonth,
        datasets: []
    })

    

     const [valueYear,setValueYear] = useState(new Date().getFullYear())

    const [dateRange, setDateRange] = useState([
        dayjs().startOf('year'),
        dayjs().endOf('year')
    ]);


    const getData = async () => {
        const fromDate = dateRange[0].format('YYYY-MM-DD');
        const toDate = dateRange[1].format('YYYY-MM-DD');


        const valueYear = {
            fromDate,
            toDate
        }
        
        console.log("valueYear" , valueYear);
        const res = await getSumByYearPost(valueYear);

        console.log("res", res);
        if (res.errCode === 0) {
            let monthModel = { ...defaultMonthModel };

            res.data.forEach(item => {
            monthModel[item.month] = item.total;
            });

            setData({
            labels: labelsMonth,
            datasets: [{
                label: 'USD',
                data: Object.values(monthModel)
            }]
            });
        }
    };

    // let getData = async ()=> {
    //     let res = await getSumByYearPost(valueYear)
    //     if (res.errCode === 0) {
    //         let monthModel = { ...defaultMonthModel };
    //         res.data.forEach((item) => {
    //           monthModel[item.month] = item.total;
    //         });
    //         let newData = []
    //         for (let key in monthModel) {
    //             newData.push(monthModel[key])
    //         }
    //         setData({
    //             labels: labelsMonth,
    //             datasets: [{
    //                 label: 'USD',
    //                 data: newData
    //             }]
    //         })
    //     }

    // }
    let handleOnChange = (value)=> {
        setValueYear(value)
    }
    useEffect(()=> {
        getData()
    },[valueYear, dateRange])
    return (
        <div className="col-12 grid-margin">
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Đồ thị doanh thu các gói bài đăng</h4>
                {/* <Row>
                            <Col xs={12} xxl={12}>
                                <Select onChange={(value) => handleOnChange(value)} style={{ width: '50%' }} size='default' defaultValue={valueYear} options={yearOptions}>

                                </Select>
                            </Col>

                </Row> */}

                <Row style={{ marginTop: 20 }}>
                    <Col xs={12}>
                        <RangePicker
                            value={dateRange}
                            format="DD/MM/YYYY"
                            onChange={(dates) => setDateRange(dates)}
                        />

                    </Col>
                </Row>

                <Bar
                data={data?? null}
                options={options}/>
            </div>
        </div>
    </div>
    );
}

export default ChartPost;