import ClientDashboard from "../components/ClientDashboard";
import SiteHeader from "../components/SiteHeader";

export default function ProfilePage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ClientDashboard />
      </main>
    </div>
  );
}
