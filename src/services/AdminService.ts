import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { AnalyticsService } from './AnalyticsService';

export interface AdminAction {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  details: any;
  timestamp: Date;
  adminId: string;
}

export class AdminService {
  private adminAuditCollection = collection(db, 'admin_audit');
  private quarterCollection = collection(db, 'quarters');
  private whiskeySamplesCollection = collection(db, 'whiskey_samples');

  // Comprehensive Admin Audit Logging
  async logAdminAction(action: AdminAction): Promise<void> {
    try {
      await addDoc(this.adminAuditCollection, {
        ...action,
        timestamp: action.timestamp
      });

      AnalyticsService.trackUserEngagement('admin_action', {
        type: action.type,
        entity: action.entity
      });
    } catch (error) {
      console.error('Failed to log admin action', error);
    }
  }

  // Quarters Management
  async createQuarter(quarterData: any): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Unauthorized');

    try {
      const docRef = await addDoc(this.quarterCollection, quarterData);
      
      await this.logAdminAction({
        type: 'CREATE',
        entity: 'quarter',
        details: quarterData,
        timestamp: new Date(),
        adminId: currentUser.uid
      });

      return docRef.id;
    } catch (error) {
      console.error('Failed to create quarter', error);
      throw error;
    }
  }

  // More methods: updateQuarter, deleteQuarter, etc. would follow the same pattern
}

// Singleton Export
export const adminService = new AdminService();