import { AuthFormLayout } from "@/components/authForms/AuthFormLayout";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { ReduxProviderWrapper } from "@/providers/ReduxMainProvider";
import { ToastContainer } from "react-toastify";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProviderWrapper>
      <AuthFormLayout />
      <ToastContainer
        position="top-right"
        theme="light"
        // hideProgressBar={true}
        autoClose={3000}
      />
      <Header />
      {children}
      <Footer />
    </ReduxProviderWrapper>
  );
}
