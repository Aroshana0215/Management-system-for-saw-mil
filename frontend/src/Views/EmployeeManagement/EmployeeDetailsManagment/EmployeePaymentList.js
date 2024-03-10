import React, { useState, useEffect } from 'react';
import { getPaysheetDetailsByEmployee } from '../../../services/EmployeeManagementService/EmployeePaySheetService';
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const EPaymentList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { eid } = useParams(); // Get categoryId from URL params

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPaysheetDetailsByEmployee(eid);
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
  }, [eid]);

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
            <th >From Date</th>
            <th >To Date</th>
            <th >Total Days</th>
            <th>Total Ot</th>
            <th>Reduce Amount</th>
            <th>Payment Status</th>
            {/* <th>Paid Date</th> */}
            <th>eid_fk</th>
            <th>Total Payement</th>
            <th>Total Advance</th>
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
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDateOfBirth(category.fromDate)}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDateOfBirth(category.toDate)}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.totalDay}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.totalOt}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.reduceAmount}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.paymentStatus}</td>
              {/* <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDateOfBirth(category.currentDate)}</td> */}
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.eid_fk}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.totalPayment}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.totalAdvance}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.status}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.createdBy}</td>
              {/* <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDateOfBirth(category.createdDate)}</td> */}
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{category.modifiedBy}</td>
              {/* <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDateOfBirth(category.modifiedDate)}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <Typography
        component={Link}
        to={`/employee/payment/add/${eid}`}
        variant="body2"
        sx={{ textAlign: "center", textDecoration: "none", display: "block", marginTop: "20px" }}
      >
        Process Payment
      </Typography>
    </div>
  );
};

export default EPaymentList;
