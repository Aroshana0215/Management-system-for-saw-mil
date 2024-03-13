import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../../services/PriceCardService'; // Import the API function
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const PriceCardList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCategories();
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
            <th>Timber Type</th>
            <th>Area Length</th>
            <th>Area Width</th>
            <th>Min Length</th>
            <th>Max Length</th>
            <th>Thickness</th>
            <th>Description</th>
            <th>Unit Price</th>
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
              <td>{category.timberType}</td>
              <td>{category.areaLength}</td>
              <td>{category.areaWidth}</td>
              <td>{category.minlength}</td>
              <td>{category.maxlength}</td>
              <td>{category.thickness}</td>
              <td>{category.description}</td>
              <td>{category.unitPrice}</td>
              <td>{category.status}</td>
              <td>{category.createdBy}</td>
              {/* <td>{category.createdDate}</td> */}
              <td>{category.modifiedBy}</td>
              {/* <td>{category.modifiedDate}</td> */}
              <td>
                <Link to={`/price/update/${category.id}`}>
                  <button>Update</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Typography
        component={Link}
        to={"/price/add"}
        variant="body2"
        sx={{ textAlign: "center", textDecoration: "none" }}
      >
        Create price
      </Typography>
    </div>
  );
};

export default PriceCardList;
