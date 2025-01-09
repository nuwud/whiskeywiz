import React, { useState, useEffect } from 'react';
import { adminService, AdminAction } from '../../services/AdminService';
import { useAuth } from '../../services/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [auditLog, setAuditLog] = useState<AdminAction[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminCheck = await adminService.checkAdminPermissions('super_admin');
        setIsAdmin(adminCheck);

        if (adminCheck) {
          const logs = await adminService.getAdminAuditLog();
          setAuditLog(logs);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  const renderAuditLog = () => {
    return auditLog.map((action, index) => (
      <tr key={index}>
        <td>{action.type}</td>
        <td>{action.entity}</td>
        <td>{action.adminId}</td>
        <td>{action.timestamp.toLocaleString()}</td>
      </tr>
    ));
  };

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <section className="audit-log">
        <h2>Admin Action Logs</h2>
        <table>
          <thead>
            <tr>
              <th>Action Type</th>
              <th>Entity</th>
              <th>Admin ID</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {renderAuditLog()}
          </tbody>
        </table>
      </section>

      {/* Additional admin sections would be added here */}
    </div>
  );
};