import { ReduxProviderWrapper } from "@/providers/ReduxAdminProvider";
import { HeaderAdmin } from "./components/HeaderAdmin/component";
import { ToastContainer } from "react-toastify";
import { SessionProviderWrapper } from "@/providers/SessionProviderWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProviderWrapper>
      <ReduxProviderWrapper>
        <ToastContainer
          position="top-right"
          theme="light"
          // hideProgressBar={true}
          autoClose={3000}
        />
        <div className="container">
          <HeaderAdmin />
          {children}
        </div>
      </ReduxProviderWrapper>
    </SessionProviderWrapper>
  );
}
