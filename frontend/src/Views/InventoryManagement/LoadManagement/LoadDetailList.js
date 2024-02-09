import React, { useState, useEffect } from 'react';
import { getAllLoadDetails } from '../../../services/InventoryManagementService/LoadDetailsService'; // Import the API function
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const LoadDetailList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getAllLoadDetails();
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
              <th>Seller Name</th>
              <th>permit Number</th>
              <th>Region</th>
              <th>Lorry Number</th>
              <th>Driver</th>
              <th>Other Details</th>
 
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
                <td>{category.sellerName}</td>
                <td>{category.permitNumber}</td>
                <td>{category.region}</td>
                <td>{category.lorryNumber}</td>
                <td>{category.driver}</td>
                <td>{category.otherDetails}</td>
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
          to={"/load/add"}
          variant="body2"
          sx={{ textAlign: "center", textDecoration: "none" }}
        >
          New Load
        </Typography>
      </div>
    );
  };

export default LoadDetailList;
