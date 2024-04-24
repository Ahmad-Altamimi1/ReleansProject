import Header from "../layouts/Header";
import Sidebar from "../layouts/sidebar";
import Content from "../sections/home/index";

export default function () {
  return (
    <>
      <Header />
      <Sidebar />
      <Content />
    </>
  );
}
