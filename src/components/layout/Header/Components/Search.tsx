import { IoIosSearch } from "react-icons/io";

export  function Search() {
  return (
    <div className="header-search">
      <input type="text" placeholder="Search ..." />
      <IoIosSearch />
    </div>
  );
}
