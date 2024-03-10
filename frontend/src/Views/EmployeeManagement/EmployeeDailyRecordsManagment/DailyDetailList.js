import React, { useState, useEffect } from 'react';
import { getAllemployeeDailyDetails } from '../../../services/EmployeeManagementService/EmployeeDailyDetailService';
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const DailyDetailList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllemployeeDailyDetails();
        console.log('Fetched data:', data);
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

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return ""; // Handle case where timestamp is undefined or has no seconds property
    const date = new Date(timestamp.seconds * 1000);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleString("en-US", options);
  };
  
  

  return (
    <div style={{ padding: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', borderRadius: '8px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th >ID</th>
            <th >Date</th>
            <th>IsPresent</th>
            <th>In Time</th>
            <th>Out Time</th>
            <th>Ot Hours</th>
            <th>Advance Per Day</th>
            <th>EID</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Created Date</th>
            <th>Modified by</th>
            <th>Modified Date</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.id}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDate(category.dateTime)}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.isPresent.toString()}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.inTime}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.outTime}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.otHours}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.advancePerDay}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.eid_fk}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.status}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.createdBy}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDate(category.createdDate)}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.modifiedBy}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDate(category.modifiedDate)}</td>
              <td>
                <Link to={`/employee/daily/${category.id}`}>
                  <button style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Typography
        component={Link}
        to={"/employee/daily/add"}
        variant="body2"
        sx={{ textAlign: "center", textDecoration: "none", display: "block", marginTop: "20px" }}
      >
        Create New Employee
      </Typography>
    </div>
  );
};

export default DailyDetailList;
