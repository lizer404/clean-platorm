import type { Metadata } from "next";
import CleanerDashboard from "../../components/CleanerDashboard";

export const metadata: Metadata = {
  title: "Кабинет специалиста — CleanPlatform",
  description:
    "Рабочий кабинет клинера: рейтинг, баланс, квесты, расписание и радар заказов.",
};

export default function CleanerDashboardPage() {
  return <CleanerDashboard />;
}
