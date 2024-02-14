import React, { useState, useEffect } from 'react';
import { getAllSummaryDetails } from '../../services/InventoryManagementService/StockSummaryManagementService'; // Import the API function
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const StockHistory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getAllSummaryDetails();
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
              <th>Total Pieces</th>
              <th>Changed Amount</th>
              <th>Previous Amount</th>
              <th>bill Id</th>
              <th>stock Id</th>
              <th>category</th>
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
                <td>{category.totalPieces}</td>
                <td>{category.changedAmount}</td>
                <td>{category.previousAmount}</td>
                <td>{category.billId_fk}</td>
                <td>{category.stk_id_fk}</td>
                <td>{category.categoryId_fk}</td>
                {/* <td>{category.PromizeDate}</td> */}
                <td>{category.description}</td>
                <td>{category.billStatus }</td>
                <td>{category.status}</td>
                <td>{category.createdBy}</td>
                {/* <td>{category.createdDate}</td> */}
                <td>{category.modifiedBy}</td>
                {/* <td>{category.modifiedDate}</td> */}
                <td>
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
      </div>
    );
  };

export default StockHistory;
