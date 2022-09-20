import { Button, Modal, Table } from 'antd';
// import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
// import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout'
import api from "../../redux/api";
import LayoutApp from '../../components/Layout';

const Bills = () => {
    const componentRef = useRef();
    const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await api.get('https://gemini-mern.herokuapp.com/api/bills/getbills');
      setBillsData(data);
      setFilteredData(data);
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

  const searchHandler = (e) => {
    const value = e.target.value.toLowerCase();
    setFilteredData(billsData.filter((x) => x.licensePlates.toLowerCase().includes(value)));
  };

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
    },
    // {
    //     title: "Sub Total",
    //     dataIndex: "subTotal",
    // },
    // {
    //     title: "Tax",
    //     dataIndex: "tax",
    // },
    {
        title: "Total Amount",
        dataIndex: "totalAmount",
    },
    {
        title: "Action",
        dataIndex: "_id",
        render:(id, record) => 
        <div>
          <EyeOutlined className='cart-edit eye' onClick={() => {setSelectedBill(record); setPopModal(true);}} />
        </div>
        
    }
  ]

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <LayoutApp>
        <h2>All Invoice </h2>
        <div style={{ marginBottom: 25 }}>
        <input onChange={(e) => searchHandler(e)} style={{ padding: "0.5rem", paddingRight: "1rem" }} placeholder="Search License Plates..."></input>
        </div>
      <Table dataSource={filteredData} columns={columns} bordered />
      
      {
        popModal && 
        <Modal title="Struk Belanja" width={400} pagination={false} visible={popModal} onCancel={() => setPopModal(false)} footer={false}>
          <div className="card" ref={componentRef}>
            <div className="cardHeader">
                <h2 className="logo">GEMINI MOTOR</h2>
                <span>Tlp: <b>+0333/0000000</b></span>
                <span>Alamat: <b>Jalan Hassanudin 72, Genteng</b></span>
            </div>
            <div className="cardBody">
                <div className="group">
                    <span>Kendaraan:</span>
                    <span><b>{selectedBill.customerName}</b></span>
                </div>
                <div className="group">
                    <span>Plat Nomor :</span>
                    <span><b>{selectedBill.licensePlates}</b></span>
                </div>
                <div className="group">
                    <span>Servis :</span>
                    <span><b>{selectedBill.typeofService}</b></span>
                </div>
                <div className="group">
                    <span>Tanggal Pembelian :</span>
                    <span><b>{selectedBill.createdAt.toString().substring(0, 10)}</b></span>
                </div>
                <div className="group">
                    <span>Total :</span>
                    <span><b>Rp{selectedBill.totalAmount}</b></span>
                </div>
            </div>
            <div className="cardFooter">
                <h4></h4>
                {selectedBill.cartItems.map((product) => (
                    <>
                        <div className="footerCard">
                            <div className="group">
                                <span>Produk:</span>
                                <span><b>{product.name}</b></span>
                            </div>
                            <div className="group">
                                <span>Qty:</span>
                                <span><b>{product.quantity}</b></span>
                            </div>
                            <div className="group">
                                <span>Harga:</span>
                                <span><b>Rp{product.price}</b></span>
                            </div>
                        </div>
                    </>
                ))}
                <div className="footerCardTotal">
                    <div className="group">
                        <h3>Total:</h3>
                        <h3><b>Rp{selectedBill.totalAmount}</b></h3>
                    </div>
                </div>
                <div className="footerThanks">
                    <span>Terima Kasih Telah Berbelanja</span>
                </div>
            </div>
          </div>
          <div className="bills-btn-add">
            <Button onClick={handlePrint} htmlType='submit' className='add-new'>Generate Invoice</Button>
        </div>  
        </Modal>
      }
    </LayoutApp>
  )
}

export default Bills
