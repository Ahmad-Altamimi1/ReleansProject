import Header from "../layouts/Header";
import Sidebar from "../layouts/sidebar";
import Content from "../sections/StockMovement/content";

// Create the UserContext

export default function () {
  return (
    <>
      <Header />
      <Sidebar />
      <Content />
    </>
  );
}
