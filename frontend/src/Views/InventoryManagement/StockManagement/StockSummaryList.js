import React, { useState, useEffect } from 'react';
import { getAllSummaryDetails } from "../../../services/InventoryManagementService/StockSummaryManagementService"; 

const StockSummaryList = () => {
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
              <th>status</th>
              <th>billId_fk</th>
              <th>stk_id_fk</th>
              <th>categoryId_fk</th>
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
                <td>{category.status}</td>
                <td>{category.billId_fk}</td>
                <td>{category.stk_id_fk}</td>
                <td>{category.categoryId_fk}</td>
                <td>{category.createdBy}</td>
                {/* <td>{category.createdDate}</td> */}
                <td>{category.modifiedBy}</td>
                {/* <td>{category.modifiedDate}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default StockSummaryList;
