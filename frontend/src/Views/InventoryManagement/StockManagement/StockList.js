import React, { useState, useEffect } from 'react';
import { getAllInventoryDetails } from '../../../services/InventoryManagementService/StockManagementService'; // Import the API function
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const StockList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getAllInventoryDetails();
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
              <th>categoryId_fk</th>
              <th>Section Number</th>
              <th>TimberId_fk</th>
              <th>Amount Of Pieces</th>
              <th>MachineNo</th>
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
                <td>{category.categoryId_fk}</td>
                <td>{category.sectionNumber}</td>
                <td>{category.timberId_fk}</td>
                <td>{category.amountOfPieces}</td>
                <td>{category.MachineNo}</td>
                <td>{category.status}</td>
                <td>{category.createdBy}</td>
                {/* <td>{category.createdDate}</td> */}
                <td>{category.modifiedBy}</td>
                {/* <td>{category.modifiedDate}</td> */}
                <td>
                  <Link to={`/stock/view/${category.id}`}>
                    <button>View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Typography
          component={Link}
          to={"/stock/add"}
          variant="body2"
          sx={{ textAlign: "center", textDecoration: "none" }}
        >
          New Load
        </Typography>
      </div>
    );
  };

export default StockList;
