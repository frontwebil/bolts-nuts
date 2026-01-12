import { AuthFormLayout } from "@/components/authForms/AuthFormLayout";
import { CartPopUpLayout } from "@/components/cartPopUp/CartPopUpLayout";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { SetProductsToRedux } from "@/hooks/setProductsToRedux";
import { QueryProviders } from "@/providers/QueryProvider";
import { ReduxProviderWrapper } from "@/providers/ReduxMainProvider";
import { SessionProviderWrapper } from "@/providers/SessionProviderWrapper";
import { ToastContainer } from "react-toastify";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProviders>
      <SessionProviderWrapper>
        <ReduxProviderWrapper>
          <SetProductsToRedux />
          <AuthFormLayout />
          <CartPopUpLayout />
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
      </SessionProviderWrapper>
    </QueryProviders>
  );
}
