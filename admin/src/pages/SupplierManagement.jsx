import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import AddSupplier from "./AddSupplier";

const SupplierManagement = ({ token }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/supplier/list", {
        headers: { token },
      });
      if (response.data.success) {
        setSuppliers(response.data.transactions);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  // Remove supplier
  const handleRemoveSupplier = async (id) => {
    try {
      const response = await axios.post(backendUrl + "/api/supplier/remove",{ id },{headers: { token },});
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSuppliers(); // Refresh the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove supplier");
    }
  };

  // Calculate total amount for a supplier
  const calculateTotalAmount = (rawMaterials) => {
    return rawMaterials.reduce((total, material) => total + material.totalAmount, 0);
  };

  // Calculate total remaining amount for a supplier
  const calculateRemainingAmount = (rawMaterials) => {
    return rawMaterials.reduce((total, material) => total + material.remainingAmount, 0);
  };

  // Calculate grand totals for all raw materials
  const calculateGrandTotals = (supplier) => {
    const grandTotals = supplier.rawMaterials.reduce(
      (totals, material) => {
        totals.totalAmount += material.totalAmount;
        totals.amountPaid += material.amountPaid;
        totals.remainingAmount += material.remainingAmount;
        return totals;
      },
      { totalAmount: 0, amountPaid: 0, remainingAmount: 0 }
    );
    return grandTotals;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Supplier Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {showAddForm ? "Hide Add Form" : "Add New Supplier"}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddSupplier
            token={token}
            onSuccess={() => {
              fetchSuppliers();
              setShowAddForm(false);
            }}
          />
        </div>
      )}

      <div className="grid gap-4">
        {suppliers.map((supplier) => {
          const grandTotals = calculateGrandTotals(supplier);
          return (
            <div key={supplier._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{supplier.supplierName}</h2>
                  <p className="text-gray-600 text-sm">
                    Added on: {new Date(supplier.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveSupplier(supplier._id)}
                  className="w-full sm:w-auto px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
                >
                  Remove
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p>Total Amount: Rs. {calculateTotalAmount(supplier.rawMaterials)}</p>
                    <p>Remaining Amount: Rs. {calculateRemainingAmount(supplier.rawMaterials)}</p>
                  </div>
                  <div>
                    <p>Total Materials: {supplier.rawMaterials.length}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Raw Materials</h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Unit</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {supplier.rawMaterials.map((material, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{material.materialName}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{material.quantity}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">Rs. {material.pricePerUnit}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">Rs. {material.totalAmount}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">Rs. {material.amountPaid}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">Rs. {material.remainingAmount}</td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-semibold">
                            <td className="px-4 py-3 whitespace-nowrap text-sm">Grand Total</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">-</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">-</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">Rs. {grandTotals.totalAmount}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">Rs. {grandTotals.amountPaid}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">Rs. {grandTotals.remainingAmount}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {suppliers.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
            No suppliers found. Add your first supplier using the button above.
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierManagement;
