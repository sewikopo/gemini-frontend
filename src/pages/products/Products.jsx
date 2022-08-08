
import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import LayoutApp from '../../components/Layout'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Table, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import api from "../../redux/api";

const Products = () => {

  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [editProduct, setEditProduct] = useState(false);

  const getAllProducts = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await api.get('https://gemini-mern.herokuapp.com/api/products/getproducts');
      setProductData(data);
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
      getAllProducts();
  }, []);

  const handlerDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await api.post('https://gemini-mern.herokuapp.com/api/products/deleteproducts', {productId:record._id});
      message.success("Product Deleted Successfully!")
      getAllProducts();
      setPopModal(false);
      dispatch({
        type: "HIDE_LOADING",
      });
      

    } catch(error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      message.error("Error!")
      console.log(error);
    }
  }

  const columns = [
    {
        title: "Name",
        dataIndex: "name"
    },
    {
        title: "category",
        dataIndex: "category",
    }, 
    {
        title: "Price",
        dataIndex: "price",
    },
    {
        title: "Action",
        dataIndex: "_id",
        render:(id, record) => 
        <div>
          <DeleteOutlined className='cart-action' onClick={() => handlerDelete(record)}/>
          <EditOutlined className='cart-edit' onClick={() => {setEditProduct(record); setPopModal(true)}} />
        </div>
        
    }
  ]

  const handlerSubmit = async (value) => {
    //console.log(value);
    if(editProduct === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const res = await api.post('https://gemini-mern.herokuapp.com/api/products/addproducts', value);
        message.success("Product Added Successfully!")
        getAllProducts();
        setPopModal(false);
        dispatch({
          type: "HIDE_LOADING",
        });
        
  
      } catch(error) {
        dispatch({
          type: "HIDE_LOADING",
        });
        message.error("Error!")
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
       await api.put('https://gemini-mern.herokuapp.com/api/products/updateproducts', {...value, productId:editProduct._id});
        message.success("Product Updated Successfully!")
        getAllProducts();
        setPopModal(false);
        dispatch({
          type: "HIDE_LOADING",
        });
        
  
      } catch(error) {
        dispatch({
          type: "HIDE_LOADING",
        });
        message.error("Error!")
        console.log(error);
      }
    }
  }

  return (
    <LayoutApp>
      <h2>All Products </h2>
      <Button className='add-new' onClick={() => setPopModal(true)}>Add New</Button>
      <Table dataSource={productData} columns={columns} bordered />
      
      {
        popModal && 
        <Modal title={`${editProduct !== null ? "Edit Product" : "Add New Product"}`} visible={popModal} onCancel={() => {setEditProduct(null); setPopModal(false);}} footer={false}>
          <Form layout='vertical' initialValues={editProduct} onFinish={handlerSubmit}>
            <FormItem name="name" label="Name">
              <Input/>
            </FormItem>
            <Form.Item name="category" label="Category">
              <Select>
                <Select.Option value="pizzas">Pizzas</Select.Option>
                <Select.Option value="burgers">Burgers</Select.Option>
                <Select.Option value="drinks">Drinks</Select.Option>
              </Select>
            </Form.Item>
            <FormItem name="price" label="Price">
              <Input/>
            </FormItem>
            <FormItem name="inventory" label="Stock">
              <Input />
            </FormItem>
            <div className="form-btn-add">
              <Button htmlType='submit' className='add-new'>Add</Button>
            </div>
          </Form>
        </Modal>
      }

    </LayoutApp>
  )
}

export default Products
