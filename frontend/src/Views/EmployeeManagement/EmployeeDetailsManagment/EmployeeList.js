import React, { useState, useEffect } from 'react';
import { getAllemployeeDetails } from '../../../services/EmployeeManagementService/EmployeeDetailService';
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllemployeeDetails();
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

  const formatDateOfBirth = (dateObject) => {
    const date = new Date(dateObject.seconds * 1000);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  return (
    <div style={{ padding: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', borderRadius: '8px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th >ID</th>
            <th >Name</th>
            <th >Address</th>
            <th >NIC</th>
            <th>Date Of Birth</th>
            <th>Current Lend Amount</th>
            <th>Ot Value Per Hour</th>
            <th>Salary Per Day</th>
            <th>Join Date</th>
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
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.name}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.address}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.nic}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDateOfBirth(category.dateOfBirth)}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.currentLendAmount}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.otValuePerHour}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.salaryPerDay}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDateOfBirth(category.joinDate)}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.status}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.createdBy}</td>
              {/* <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDateOfBirth(category.createdDate)}</td> */}
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.modifiedBy}</td>
              {/* <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDateOfBirth(category.modifiedDate)}</td> */}
              <td>
                <Link to={`/employee/update/${category.id}`}>
                  <button style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>preview</button>
                </Link>
              </td>
              <td>
                <Link to={`/employee/payment/${category.id}`}>
                  <button style={{ padding: '8px 16px', backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Payment</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Typography
        component={Link}
        to={"/employee/add"}
        variant="body2"
        sx={{ textAlign: "center", textDecoration: "none", display: "block", marginTop: "20px" }}
      >
        Create New Employee
      </Typography>
    </div>
  );
};

export default EmployeeList;
