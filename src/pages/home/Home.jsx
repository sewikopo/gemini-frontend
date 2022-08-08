import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutApp from "../../components/Layout";
import { Row, Col } from "antd";
import Product from "../../components/Product";
import { useDispatch } from "react-redux";
import { Table, message } from "antd";
import api from "../../redux/api";

const Home = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("pizzas");
  const categories = [
    {
      name: "pizzas",
      imageUrl: "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/27954/pizza-pepperoni-clipart-xl.png",
    },
    {
      name: "burgers",
      imageUrl: "https://cdn.pixabay.com/photo/2022/01/04/23/00/fast-food-6916101_960_720.png",
    },
    {
      name: "drinks",
      imageUrl: "https://images.vexels.com/media/users/3/246333/isolated/preview/9626dce3278f72220ea2736de64e6233-pink-cocktail-color-stroke.png",
    },
  ];

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await api.get("/api/products/getproducts");
        setProductData(data);
        setFilteredData(data);
        dispatch({
          type: "HIDE_LOADING",
        });

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllProducts();
  }, [dispatch]);

  const searchHandler = (e) => {
    const value = e.target.value.toLowerCase();
    setFilteredData(productData.filter((x) => x.name.toLowerCase().includes(value)));
  };

  const submitHandler = async (record) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...record, quantity: 1 },
    });
    message.success("Added to Cart");
  };

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
      title: "Price",
      dataIndex: `price`,
    },
    {
      title: "Inventory",
      dataIndex: "inventory",
    },
    {
      title: "Action",
      render: (id, record) => (
        <div>
          <button onClick={() => submitHandler(record)} style={{ backgroundColor: "black", color: "white", padding: "0.25rem", borderRadius: "5px", cursor: "pointer" }}>
            {loading ? "Adding ..." : "Add to cart"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <LayoutApp>
      {/* <div className="category">
        {categories.map((category) => (
          <div key={category.name} className={`categoryFlex ${selectedCategory === category.name && "category-active"}`} onClick={() => setSelectedCategory(category.name)}>
            <h3 className="categoryName">{category.name}</h3>
            <img src={category.imageUrl} alt={category.name} height={60} width={60} />
          </div>
        ))}
      </div>
      <Row>
        {productData
          .filter((i) => i.category === selectedCategory)
          .map((product) => (
            <Col xs={24} sm={6} md={12} lg={6}>
              <Product key={product.id} product={product} />
            </Col>
          ))}
      </Row> */}
      <div style={{ marginBottom: 25 }}>
        <input onChange={(e) => searchHandler(e)} style={{ padding: "0.5rem", paddingRight: "1rem" }} placeholder="Search Product Name..."></input>
      </div>
      <Table dataSource={filteredData} columns={columns} bordered />
    </LayoutApp>
  );
};

export default Home;
