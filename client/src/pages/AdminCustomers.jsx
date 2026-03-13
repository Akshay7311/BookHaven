import AdminCustomerList from '../components/AdminCustomerList';

const AdminCustomers = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Customers</h1>
      </div>
      <AdminCustomerList />
    </div>
  );
};

export default AdminCustomers;
