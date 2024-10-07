import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ nbPages, produits }) => {
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + nbPages;
  const currentItems = produits.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(produits.length / { nbPages });

  const handlePageClick = (event) => {
    const newOffset = (event.selected * nbPages) % produits.length;
    // console.log(
    //   `User requested page number ${event.selected}, which is offset ${newOffset}`
    // );
    setItemOffset(newOffset);
  };
  return (
    <div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 ">
        <ReactPaginate
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          activeClassName={"active"}
          className="flex items-center justify-center "
          breakLabel="..."
          onPageChange={handlePageClick}
          pageCount={pageCount}
          previousLabel={
            <IconContext.Provider value={{ color: "#2f4858", size: "36px" }}>
              <AiFillLeftCircle className="mx-7 opacity-90" />
            </IconContext.Provider>
          }
          nextLabel={
            <IconContext.Provider value={{ color: "#2f4858", size: "36px" }}>
              <AiFillRightCircle className="mx-7 opacity-90" />
            </IconContext.Provider>
          }
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default Pagination;
