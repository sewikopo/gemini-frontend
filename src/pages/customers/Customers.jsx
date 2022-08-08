import { Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout'
import api from "../../redux/api";

const Customers = () => {

  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await api.get('/api/bills/getbills');
      setBillsData(data);
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(data);

    } catch(error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(error);
    }
  };

  useEffect(() => {
      getAllBills();
  }, []);

  const columns = [
    {
        title: "ID",
        dataIndex: "_id"
    },
    {
        title: "Customer Name",
        dataIndex: "customerName",
    }, 
    {
        title: "License Plates",
        dataIndex: "licensePlates",
    }
    , 
    {
        title: "Type of Service",
        dataIndex: "typeofService",
    }
  ]

  return (
    <Layout>
      <h2>All Customers </h2>
      <Table dataSource={billsData} columns={columns} bordered />
    </Layout>
  )
}

export default Customers
