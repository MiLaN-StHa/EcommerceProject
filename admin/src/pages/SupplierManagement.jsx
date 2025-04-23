import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import AddSupplier from "./AddSupplier";

const SupplierManagement = ({ token }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

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

  const handleRemoveSupplier = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/supplier/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSuppliers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove supplier");
    }
  };

  const calculateTotalAmount = (rawMaterials) => {
    return rawMaterials.reduce((total, material) => total + material.totalAmount, 0);
  };

  const calculateRemainingAmount = (rawMaterials) => {
    return rawMaterials.reduce((total, material) => total + material.remainingAmount, 0);
  };

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
              <p className="text-gray-600 mt-1">Manage your suppliers and raw materials</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {showAddForm ? "Hide Add Form" : "Add New Supplier"}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="p-4 md:p-6 border-b border-gray-200">
            <AddSupplier
              token={token}
              onSuccess={() => {
                fetchSuppliers();
                setShowAddForm(false);
              }}
            />
          </div>
        )}

        <div className="p-4 md:p-6">
          <div className="grid gap-6">
            {suppliers.map((supplier) => {
              const grandTotals = calculateGrandTotals(supplier);
              return (
                <div key={supplier._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{supplier.supplierName}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Added on: {new Date(supplier.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveSupplier(supplier._id)}
                        className="w-full sm:w-auto px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      >
                        Remove Supplier
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                        <p className="text-2xl font-semibold text-gray-900">Rs. {calculateTotalAmount(supplier.rawMaterials)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500">Remaining Amount</h3>
                        <p className="text-2xl font-semibold text-gray-900">Rs. {calculateRemainingAmount(supplier.rawMaterials)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500">Total Materials</h3>
                        <p className="text-2xl font-semibold text-gray-900">{supplier.rawMaterials.length}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
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
                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{material.materialName}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{material.quantity}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">Rs. {material.pricePerUnit}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">Rs. {material.totalAmount}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">Rs. {material.amountPaid}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">Rs. {material.remainingAmount}</td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-semibold">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Grand Total</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">-</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">-</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">Rs. {grandTotals.totalAmount}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">Rs. {grandTotals.amountPaid}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">Rs. {grandTotals.remainingAmount}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}

            {suppliers.length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding a new supplier.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierManagement;
