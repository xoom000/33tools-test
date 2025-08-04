import { motion } from 'framer-motion';
import { Button } from '../../ui';

const AdminTab = ({ onShowSyncModal, onShowDatabaseUpdate, onShowRouteOptimization }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">System Administration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-800 mb-2">Driver Management</h4>
            <p className="text-sm text-slate-600 mb-3">Manage all 6 route drivers and their access</p>
            <Button variant="primary" size="small">Manage Drivers</Button>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-800 mb-2">System Reports</h4>
            <p className="text-sm text-slate-600 mb-3">View cross-route analytics and usage</p>
            <Button variant="secondary" size="small">View Reports</Button>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-800 mb-2">Data Management</h4>
            <p className="text-sm text-slate-600 mb-3">Database updates and sync operations</p>
            <div className="space-y-2">
              <Button 
                variant="primary" 
                size="small"
                onClick={onShowDatabaseUpdate}
                className="w-full"
              >
                🗄️ Database Update System
              </Button>
              <Button 
                variant="outline" 
                size="small"
                onClick={onShowSyncModal}
                className="w-full"
              >
                📊 CSV Database Sync
              </Button>
              <Button 
                variant="accent" 
                size="small"
                onClick={onShowRouteOptimization}
                className="w-full"
              >
                🚛 RouteOptimization Compare
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminTab;