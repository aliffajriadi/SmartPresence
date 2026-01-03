import AdminLayout from './component/layout/Layout';
import SummaryCards from './component/dashboard/SummaryCards';
import AttendanceChart from './component/dashboard/AttendanceChart';
import RecentActivity from './component/dashboard/RecentActivity';
import QuickActions from './component/dashboard/QuickActions';
import { Suspense } from 'react';
import Loading from '@/components/Loading';
const DashboardAdminPage = () => {
  return (
    <Suspense fallback={<Loading />}>
    <AdminLayout>
      <SummaryCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      <QuickActions />
    </AdminLayout>
    </Suspense>
  )
}

export default DashboardAdminPage