/**
 * Admin Page for managing products
 * Allows deletion of all products and switching to local data
 */

import React, { useState } from 'react';
import { Trash2, Database, FileText, CheckCircle } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { localProductsAPI } from '../utils/localApi';
import toast from 'react-hot-toast';

const AdminPage: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTestingLocal, setIsTestingLocal] = useState(false);
  const [localDataStatus, setLocalDataStatus] = useState<{
    mens: number;
    womens: number;
    kids: number;
    total: number;
  } | null>(null);

  const handleDeleteAllProducts = async () => {
    if (!window.confirm('Are you sure you want to delete ALL products from the database? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await productsAPI.deleteAll();
      if (response.success) {
        toast.success('All products deleted successfully!');
      } else {
        toast.error(response.message || 'Failed to delete products');
      }
    } catch (error: any) {
      console.error('Error deleting products:', error);
      toast.error(error.message || 'Failed to delete products');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTestLocalData = async () => {
    setIsTestingLocal(true);
    try {
      const [mensResponse, womensResponse, kidsResponse] = await Promise.all([
        localProductsAPI.getMens(),
        localProductsAPI.getWomens(),
        localProductsAPI.getKids()
      ]);

      const mensCount = mensResponse.data?.products.length || 0;
      const womensCount = womensResponse.data?.products.length || 0;
      const kidsCount = kidsResponse.data?.products.length || 0;

      setLocalDataStatus({
        mens: mensCount,
        womens: womensCount,
        kids: kidsCount,
        total: mensCount + womensCount + kidsCount
      });

      toast.success('Local data loaded successfully!');
    } catch (error: any) {
      console.error('Error testing local data:', error);
      toast.error('Failed to load local data');
    } finally {
      setIsTestingLocal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Delete All Products */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Trash2 className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-xl font-semibold text-red-900">Delete All Products</h2>
              </div>
              <p className="text-red-700 mb-6">
                This will permanently delete all products from the database. 
                Use this to clear the database before switching to local JSON data.
              </p>
              <button
                onClick={handleDeleteAllProducts}
                disabled={isDeleting}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Products
                  </>
                )}
              </button>
            </div>

            {/* Test Local Data */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-green-900">Test Local Data</h2>
              </div>
              <p className="text-green-700 mb-6">
                Test loading products from local JSON files (mens_products.json, womens_products.json, kids_products.json).
              </p>
              <button
                onClick={handleTestLocalData}
                disabled={isTestingLocal}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isTestingLocal ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Test Local Data
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Local Data Status */}
          {localDataStatus && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-blue-900">Local Data Status</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{localDataStatus.mens}</div>
                  <div className="text-sm text-blue-700">Men's Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{localDataStatus.womens}</div>
                  <div className="text-sm text-blue-700">Women's Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{localDataStatus.kids}</div>
                  <div className="text-sm text-blue-700">Kids Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{localDataStatus.total}</div>
                  <div className="text-sm text-green-700">Total Products</div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-800">
              <li>First, test the local data to ensure JSON files are accessible</li>
              <li>Delete all products from the database</li>
              <li>The frontend will automatically fall back to local JSON data</li>
              <li>Visit the collection page to see products from local files</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
