import React, { useState, useEffect } from 'react';
import { getAllbillDetails } from '../../services/BillAndOrderService/BilllManagemntService'; // Import the API function
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const BillDetailList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getAllbillDetails();
          console.log('Fetched data:', data); // Log fetched data to inspect its format
          if (Array.isArray(data)) {
            setCategories(data);
            setLoading(false);
          } else {
            throw new Error('Invalid data format received from API');
          }
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Customer Address</th>
              <th>Customer NIC</th>
              <th>Phone No</th>
              <th>Total amount</th>
              <th>Advance</th>
              <th>Remainning Amount</th>
              {/* <th>Promized Date</th> */}
              <th>description</th>
              <th>BillStatus</th>
 
              <th>status</th>
              <th>Created By</th>
              {/* <th>Created Date</th> */}
              <th>Modified by</th>
              {/* <th>Modified Date</th> */}
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.id}</td>
                <td>{category.cusName}</td>
                <td>{category.cusAddress}</td>
                <td>{category.cusNIC}</td>
                <td>{category.cusPhoneNumber}</td>
                <td>{category.totalAmount}</td>
                <td>{category.advance}</td>
                <td>{category.remainningAmount}</td>
                {/* <td>{category.PromizeDate}</td> */}
                <td>{category.description}</td>
                <td>{category.billStatus }</td>
                <td>{category.status}</td>
                <td>{category.createdBy}</td>
                {/* <td>{category.createdDate}</td> */}
                <td>{category.modifiedBy}</td>
                {/* <td>{category.modifiedDate}</td> */}
                <td>
                  <Link to={`/load/timber/view/${category.id}`}>
                    <button>View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Typography
          component={Link}
          to={"/bill/wants/wood"}
          variant="body2"
          sx={{ textAlign: "center", textDecoration: "none" }}
        >
          New Bill
        </Typography>
        <Typography
          component={Link}
          to={"/stock/history"}
          variant="body2"
          sx={{ textAlign: "center", textDecoration: "none" }}
        >
          Bill History
        </Typography>
      </div>
    );
  };

export default BillDetailList;
