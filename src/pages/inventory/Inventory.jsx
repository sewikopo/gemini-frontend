import React, { useEffect } from "react";
import LayoutApp from "../../components/Layout";
import { useState } from "react";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import FormItem from "antd/lib/form/FormItem";
import api from "../../redux/api";

function Inventory() {
  const [data, setData] = useState([]);
  const [stock, setStock] = useState(null);
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/api/products/getproducts");
        console.log(response);
        setData(response.data);
      } catch (error) {
        alert(error);
      }
    };
    getData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Product Name",
      dataIndex: "name",
    },
    {
      title: "Stock",
      dataIndex: "inventory",
    },
    {
      title: "Action",
      render: (id, record) => (
        <div>
          <button
            onClick={() => {
              setEditModal(true);
              setStock(record);
            }}
            style={{ backgroundColor: "black", color: "white", padding: "0.25rem", borderRadius: "5px", cursor: "pointer" }}
          >
            Edit Stock
          </button>
        </div>
      ),
    },
  ];

  const handlerSubmit = async (value) => {
    try {
      await api.put("/api/products/updateproducts", { ...value, productId: stock._id });
      message.success("Data Successfully Edited");
      setEditModal(false);
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <LayoutApp>
      <h2>Inventory Management</h2>
      <Table dataSource={data} columns={columns} bordered />
      {editModal && (
        <Modal
          title="Edit Stock"
          visible={editModal}
          onCancel={() => {
            setStock(null);
            setEditModal(false);
          }}
          footer={false}
        >
          <Form layout="vertical" initialValues={stock} onFinish={handlerSubmit}>
            <FormItem name="name" label="Name">
              <Input />
            </FormItem>
            <FormItem name="inventory" label="Stock">
              <Input />
            </FormItem>
            <div className="form-btn-add">
              <Button htmlType="submit" className="add-new">
                Edit Stock
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </LayoutApp>
  );
}

export default Inventory;
