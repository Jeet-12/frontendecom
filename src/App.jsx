import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Service,
  Gallery,
  About,
  Cart,
  Contact,
  HomeLayout,
  Landing,
  Login,
  Register,
  Shop,
  SingleProduct,
  Wishlist,
  Profile,
  Search,
  ThankYou,
  OrderHistory,
} from "./pages";
import { singleProductLoader } from "./pages/SingleProduct";
import { shopLoader } from "./pages/Shop";
import { ToastContainer } from "react-toastify";
import OrderForm from "./pages/Order/OrderForm.jsx";
import QuotationForm from "./pages/Quotation/QuotationForm.jsx";
import ListQuotation from "./pages/Quotation/ListQuotation.jsx";
import ListOrder from "./pages/Order/ListOrder.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Addprofile from "./pages/Admin/Addprofile.jsx";
import ChangePassword from "./pages/Admin/ChangePassword.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Import ProtectedRoute
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated.jsx";
import QuotationDetail from "./pages/Quotation/QuotationDetail.jsx";
import OrderDetails from "./pages/Order/OrderDetails.jsx";
import EditQuotation from "./pages/Quotation/EditQuotation.jsx";
import EditOrder from "./pages/Order/EditOrder.jsx";
import CreatePayment from "./pages/Payment/CreatePayment.jsx";
import AllUsers from "./pages/Admin/AllUsers.jsx";
import UploadImage from "./pages/Images/UploadImage.jsx";
import ManageImage from "./pages/Images/ManageImage.jsx";
import CancelOrder from "./pages/Payment/CancelPayment.jsx";
import SuccessOrder from "./pages/Payment/PaymentSucess.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ChangePasswordPage from "./pages/changePassword.jsx";
import AddGallery from "./pages/Gallery/AddGallery.jsx";
import GalleryList from "./pages/Gallery/GalleryList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <Landing /> },
      // { path: "shop", element: <Shop />, loader: shopLoader },
      { path: "shop/product/:id", element: <SingleProduct />, loader: singleProductLoader },
      { path: "service", element: <Service /> },
      { path: "gallery", element: <Gallery /> },
      { path: "about-us", element: <About /> },
      {
        path: "order",
        element: (
          <ProtectedRoute role="user">
            <ListOrder />
          </ProtectedRoute>
        ),
      },
      {
        path: "order/:id",
        element: (
          <ProtectedRoute role="user">
            <OrderDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "order/form",
        element: (
          <ProtectedRoute role="user">
            <OrderForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "order/edit/:id",
        element: (
          <ProtectedRoute role="user">
            <EditOrder />
          </ProtectedRoute>
        ),
      },
      {
        path: "quotation",
        element: (
          <ProtectedRoute role="user">
            <ListQuotation />
          </ProtectedRoute>
        ),
      },
      {
        path: "quotation/:id",
        element: (
          <ProtectedRoute role="user">
            <QuotationDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "quotation/form",
        element: (
          <ProtectedRoute role="user">
            <QuotationForm module="quotation" />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment/:id",
        element: (
          <ProtectedRoute role="user">
            <CreatePayment />
          </ProtectedRoute>
        ),
      },
      {
        path: "quotation/edit/:id",
        element: (
          <ProtectedRoute role="user">
            <EditQuotation />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment/success",
        element: (
          <ProtectedRoute role="user">
            <SuccessOrder />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment/cancel",
        element: (
          <ProtectedRoute role="user">
            <CancelOrder />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-order",
        element: (
          <ProtectedRoute role="user">
            <OrderDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        ),
      },
      {
        path: "register",
        element: (
          <RedirectIfAuthenticated>
            <Register />
          </RedirectIfAuthenticated>
        ),
      },

      { path: "contact", element: <Contact /> },
      { path: "cart", element: <Cart /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ChangePasswordPage /> },
      {
        path: "password",
        element: (
          <ProtectedRoute role="user">
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "wishlist",
        element: (
          <ProtectedRoute role="user">
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-profile",
        element: (
          <ProtectedRoute role="user">
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "search", element: <Search /> },
      { path: "thank-you", element: <ThankYou /> },
      {
        path: "order-history",
        element: (
          <ProtectedRoute role="user">
            <OrderHistory />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      { path: "order", element: <ListOrder /> },
      { path: "order/:id", element: <OrderDetails /> },
      { path: "order/edit/:id", element: <EditOrder /> },
      { path: "order/form", element: <OrderForm /> },
      { path: "quotation", element: <ListQuotation /> },
      { path: "quotation/:id", element: <QuotationDetail /> },
      { path: "quotation/form", element: <QuotationForm /> },
      { path: "quotation/edit/:id", element: <EditQuotation /> },
      { path: "users", element: <AllUsers /> },
      { path: "upload-image", element: <UploadImage /> },
      { path: "manage-images", element: <ManageImage /> },

      { path: "admin-profile", element: <Addprofile /> },

      { path: "add-gallerimg", element: <AddGallery /> },
      { path: "all-galleryimg", element: <GalleryList /> },
    ],
  },
]);

function App() {
  return (
    <>

      <RouterProvider router={router} />
      <ToastContainer position="top-center" />

    </>
  );
}

export default App;
