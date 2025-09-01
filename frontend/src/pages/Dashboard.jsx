import ContainerStatus from '../components/ContainerStatus'
import PipelineStatus from '../components/PipelineStatus'
import MetricsLogs from '../components/MetricsLogs'

const Dashboard = () => (
  <div className="p-6 bg-white min-h-screen">
    <h1 className="text-2xl font-bold mb-4">StackBridge Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ContainerStatus />
      <PipelineStatus />
      <MetricsLogs />
    </div>
  </div>
)

export default Dashboard
